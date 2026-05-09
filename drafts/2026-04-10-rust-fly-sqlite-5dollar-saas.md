---
title: "Rust + Fly.io + SQLite で月額$5の本番SaaSを動かす実例"
slug: rust-fly-sqlite-5dollar-saas-2026-04-10
date: 2026-04-10
description: "Enablerで実際に本番稼働している複数のRust製SaaSを月額$5前後で動かしている構成をそのまま公開する。Fermyon Spin、Fly.io Machines、SQLite WALモード、デプロイパイプラインまで、コピペで使える現場の知見。"
tags: [rust, fly-io, sqlite, saas, infrastructure, enablerdao]
lang: ja
category: Engineering
author: Yuki Hamada
---

## 月額$5で本番SaaS、本当にできるのか

できる。このブログ自体（enablerdao.com）がそうだし、[jiuflow-ssr](https://jiuflow.art)、yukihamada.jp、miseban-ai もだいたい同じ構成で動いていて、合計してもFly.ioへの請求は月$30を切っている。1プロダクトあたりに割ると$5〜$8程度だ。

この記事では、実際にEnablerで本番稼働している構成を、コピペで使える粒度で開示する。派手な最適化は一切ない。ただし「地味にコスト効率がいい選択を全部やった」という話だ。

---

## スタックの全体像

```
┌─────────────────────────────────────────┐
│  Browser                                 │
└────────────────┬────────────────────────┘
                 │ HTTPS
┌────────────────▼────────────────────────┐
│  Fly.io nrt (Tokyo) — shared-cpu-1x 256M │
│  ┌──────────────────────────────────┐    │
│  │ Rust (axum 0.7) / Spin WASM      │    │
│  └────────────────┬─────────────────┘    │
│                   │                       │
│  ┌────────────────▼─────────────────┐    │
│  │ SQLite (WAL mode, /data volume)  │    │
│  └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

- **VM**: Fly.io `shared-cpu-1x 256MB` = 月 **$1.94**
- **Volume**: 1GB永続ボリューム = 月 **$0.15**
- **転送量**: 無料枠の160GB/月で十分
- **合計**: **月 $2〜$5** (プロダクトによって)

SQLiteをローカルボリュームに置くことで、DBサーバーへの月額支払いがゼロになる。これが効く。

---

## Dockerfile — cargo-chef で必ず速くなる

Rustビルドの最大の問題は「依存関係のコンパイルが遅い」こと。cargo-chef で依存だけを先にレイヤー化すると、2回目以降のビルドが **5〜10分 → 1〜2分** に落ちる。

```dockerfile
FROM rust:1.88-bookworm AS chef
RUN cargo install cargo-chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release --bin enablerdao

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/enablerdao /usr/local/bin/
EXPOSE 8080
CMD ["enablerdao"]
```

`.dockerignore` も必ず置く:

```
target/
.git/
.env
.env.*
*.md
.DS_Store
data/
*.db
*.db-wal
*.db-shm
```

これを全Rustプロジェクトに統一したのは最近の話で、詳しくは [WASM × Rust × ローカルモデル](/blog/why-wasm-rust-ai-agents-2026-03-02) の回でも触れた。

---

## axum 0.7 のミニマル構成

```rust
use axum::{routing::get, Router};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { "ok" }))
        .route("/api/health", get(health));

    let addr: SocketAddr = "0.0.0.0:8080".parse().unwrap();
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health() -> &'static str {
    "ok"
}
```

これだけで **バイナリサイズ 9MB程度**、Fly.io `shared-cpu-1x 256M` で十分動く。メモリ使用量は起動時で20MB以下。

---

## SQLite を WAL モードで使う

SQLite は設定次第で「複数プロセスが同時読み書き」でもちゃんと動く。WALモードを有効にするのは起動時の1行:

```rust
use rusqlite::Connection;

fn open_db(path: &str) -> Connection {
    let conn = Connection::open(path).unwrap();
    conn.pragma_update(None, "journal_mode", "WAL").unwrap();
    conn.pragma_update(None, "synchronous", "NORMAL").unwrap();
    conn.pragma_update(None, "foreign_keys", "ON").unwrap();
    conn
}
```

- `journal_mode=WAL`: 読み取り中でも書き込める
- `synchronous=NORMAL`: fsyncを減らして速度UP（Fly.ioのVolumeはすでに信頼性あり）
- `foreign_keys=ON`: FKの整合性チェックを有効化

これで月1000リクエストくらいのSaaSなら余裕で捌ける。それ以上になったら `libsql` や PostgreSQLへの移行を検討する。

---

## fly.toml — 最小構成

```toml
app = "enablerdao"
primary_region = "nrt"

[build]
dockerfile = "Dockerfile"

[[mounts]]
source = "data"
destination = "/data"

[http_service]
internal_port = 8080
force_https = true
auto_stop_machines = "stop"
auto_start_machines = true
min_machines_running = 0

[[services.http_checks]]
interval = "30s"
grace_period = "10s"
method = "GET"
path = "/api/health"
```

ポイントは **`auto_stop_machines = "stop"` + `min_machines_running = 0`**。アクセスがないときはマシンが完全停止してVM料金が0になる。次のアクセスで自動起動する（コールドスタート1〜2秒）。

これで「アクセス少ないときはタダ、アクセスあるときだけ課金」の構造になる。月$5に収まる秘訣がこれ。

---

## デプロイは1行

```bash
fly deploy --remote-only -a enablerdao
```

`--remote-only` を付けるとビルドがFly.ioのリモートビルダーで走る。ローカルのDockerを汚さない。CI/CDからも同じコマンドで走る。

GitHub Actionsからデプロイする場合は `FLY_API_TOKEN` をsecretsに入れて:

```yaml
- uses: superfly/flyctl-actions/setup-flyctl@master
- run: flyctl deploy --remote-only
  env:
    FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

---

## 実測コスト (2026年3月)

Enablerが抱える主要Rust製SaaSの実測コスト:

| サービス | Fly.io | Volume | 合計/月 |
|------|------|------|------|
| enablerdao.com | $1.94 | $0.15 | **$2.09** |
| yukihamada.jp | $1.94 | - | **$1.94** |
| jiuflow-ssr | $4.12 | $0.45 | **$4.57** |
| miseban-ai | $3.88 | $0.30 | **$4.18** |
| news.xyz | $1.94 | - | **$1.94** |
| **合計** | — | — | **$14.72/月** |

5プロダクトで **月$14.72**。1プロダクトあたり **$2.94**。タイトルの「$5」は盛っていない、むしろ余裕がある。

---

## 落とし穴 (実体験)

いくつかのハマりポイント:

1. **cargo clean -p だと include_str! が更新されない** → フルクリーンしろ
2. **Lambdaと違ってFly.io Machinesは時々再起動される** → ステートは必ずSQLite or Volumeに
3. **auto_stop_machines でコールドスタート1〜2秒発生** → health check を10秒grace periodに
4. **SQLite WALファイル (.wal/.shm) を .dockerignore に入れ忘れ** → ビルドコンテキスト肥大
5. **Fly.io Tokyoリージョン(nrt)は稀に容量制限あり** → 予備で `hkg` を検討

これらは全部実際にやらかして直した。詳しい経緯の一部は [全プロジェクト横断セキュリティレビュー](/blog/cross-project-security-review-2026-02) にも書いている。

---

## まとめ

- Rust + Fly.io + SQLite は **本番SaaS月$5で回る**
- `shared-cpu-1x 256M` + `auto_stop_machines` の組み合わせが神
- cargo-chef は必須。初回以降の高速化が段違い
- SQLite WAL モードで同時読み書きは問題なく動く
- `fly deploy --remote-only` でローカルを汚さない

月額数千円のクラウド支払いに疲れているソロ開発者は、試してみる価値がある。

---

## CTA

この構成で動いている本物のプロダクトを見たい方は:

- **enablerdao.com** — この記事を返しているサーバー自体
- **JiuFlow** — Fly.io + SQLite で柔術大会データを配信: <https://jiuflow.art>
- **KAGI** — Rust + Fly.io + libSQL の大型SaaS: <https://chatweb.ai>

実装で質問があれば [アイデアページ](/ideas) で声をかけてください。

---

*Yuki Hamada / EnablerDAO*
*2026年4月10日*
