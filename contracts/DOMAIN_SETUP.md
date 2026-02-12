# EnablerDAO ドメイン取得手順

## 1. ENS ドメイン (enablerdao.eth) の取得

### 1.1 前提条件

- MetaMask等のWeb3ウォレット (Ethereumメインネットに接続)
- 登録料 + ガス代相当のETH (目安: 0.01 ETH/年 + ガス代)
- ENS名の登録にはトランザクションが2回必要

### 1.2 取得手順

#### ステップ1: 空き状況の確認

1. [ENS App](https://app.ens.domains/) にアクセス
2. 検索バーに `enablerdao.eth` を入力
3. "Available" と表示されれば取得可能

#### ステップ2: 登録プロセス

ENSの登録は以下の3ステップで行われます (フロントランニング防止のため):

**Step 1 - Request to Register (コミットメント)**
1. 登録年数を選択 (推奨: 最低2年以上)
2. "Request to Register" をクリック
3. MetaMaskでトランザクションを承認 (ガス代のみ)
4. 1分間の待機期間

**Step 2 - Wait (待機)**
- 1分間待ちます (フロントランニング防止のための待機)

**Step 3 - Register (登録)**
1. "Register" をクリック
2. MetaMaskでトランザクションを承認 (登録料 + ガス代)
3. 登録完了

#### ステップ3: レコードの設定

登録完了後、以下のレコードを設定します:

1. **ETH Address (アドレスレコード)**
   - EnablerTreasury または Multisig のアドレスを設定
   - これにより `enablerdao.eth` 宛のETH送金が可能に

2. **Content Hash (コンテンツハッシュ)**
   - EnablerDAOのWebサイトのIPFSハッシュを設定 (任意)
   - 例: `ipfs://QmXxx...`

3. **Text Records (テキストレコード)**
   ```
   url        = https://enablerdao.com
   description = EnablerDAO - Decentralized Autonomous Organization
   com.github = enablerdao
   com.twitter = enablerdao (Twitterアカウントがある場合)
   ```

4. **Primary Name (逆引き設定)**
   - Governorコントラクトの primary name として `enablerdao.eth` を設定可能

#### ステップ4: オーナーシップの移管 (推奨)

セキュリティ強化のため、ENSドメインのオーナーシップをDAOのMultisigまたはTimelockに移管します:

1. ENS App で "enablerdao.eth" のページを開く
2. "Transfer" タブを選択
3. **Registrant** (オーナー) を Timelock アドレスに変更
4. **Controller** を Multisig アドレスに変更

> **注意**: オーナーシップを移管すると、以降のドメイン管理はガバナンス提案を通じてのみ可能になります。移管前に全ての初期設定を完了してください。

### 1.3 サブドメインの設定 (任意)

DAOの各機能にサブドメインを割り当てることができます:

| サブドメイン | 用途 | 設定先 |
|-------------|------|--------|
| `gov.enablerdao.eth` | ガバナンス | Governor コントラクト |
| `treasury.enablerdao.eth` | トレジャリー | Treasury コントラクト |
| `token.enablerdao.eth` | トークン | Token コントラクト |
| `vesting.enablerdao.eth` | ベスティング | Vesting コントラクト |

サブドメインの設定方法:
1. ENS App の "Subdomains" タブを開く
2. サブドメイン名を入力して作成
3. 各サブドメインにアドレスを設定

### 1.4 費用の目安

| 項目 | 概算コスト |
|------|-----------|
| 登録料 (1年) | ~$5 (名前の長さによる) |
| コミットメント Tx | ガス代のみ (~$2-10) |
| 登録 Tx | ガス代 (~$5-20) |
| レコード設定 (各) | ガス代 (~$2-10) |
| サブドメイン作成 (各) | ガス代 (~$2-10) |

> ガス代は Ethereum ネットワークの混雑状況により変動します。ガス代が安い時間帯 (UTC 深夜〜早朝) に実行することを推奨します。

---

## 2. Solana ドメイン (enablerdao.sol) の取得

### 2.1 前提条件

- Phantom 等の Solana ウォレット
- 登録料相当の SOL (約 20 USDC 相当)
- Bonfida SNS (Solana Name Service) を使用

### 2.2 取得手順

#### ステップ1: 空き状況の確認

1. [Bonfida SNS](https://www.sns.id/) にアクセス
2. 検索バーに `enablerdao` を入力
3. "Available" と表示されれば取得可能

#### ステップ2: 登録

1. ドメインの検索結果ページで「Register」をクリック
2. ストレージ容量を選択 (最小 1kB で十分)
3. Phantom ウォレットでトランザクションを承認
4. 登録完了 (Solana は 1 トランザクションで完了)

> **Solana ドメインの特徴**: ENS と異なり、Solana ドメインは**一度きりの支払い**で永続的に所有できます (年間更新料なし)。

#### ステップ3: レコードの設定

Bonfida SNS で以下のレコードを設定:

1. **SOL Address**
   - EnablerDAO の Solana トレジャリーアドレスを設定

2. **URL**
   - `https://enablerdao.com`

3. **その他のレコード**
   ```
   IPFS    = EnablerDAO の IPFS コンテンツハッシュ
   Twitter = @enablerdao
   Discord = discord.gg/enablerdao
   Github  = enablerdao
   ```

#### ステップ4: プロフィール画像の設定 (任意)

1. Bonfida の Profile ページで NFT を選択
2. EnablerDAO のロゴ NFT をプロフィール画像に設定

### 2.3 Solana ドメインのオーナーシップ管理

Solana では `.sol` ドメインは NFT (SPL Token) として管理されます。
オーナーシップの移管は NFT の転送で行えます。

- **Multisig への移管**: Squads Protocol 等の Solana Multisig を使用
- **プログラムへの移管**: カスタム Solana プログラムでドメインを管理

### 2.4 費用の目安

| 項目 | 概算コスト |
|------|-----------|
| ドメイン登録 | ~20 USDC (一度きり) |
| ストレージ (1kB) | ~0.003 SOL |
| レコード設定 | トランザクション手数料のみ (~0.00001 SOL) |

---

## 3. その他のドメイン / アイデンティティ

### 3.1 推奨する追加ドメイン

| ドメイン | サービス | 用途 |
|----------|---------|------|
| `enablerdao.eth` | ENS | Ethereum エコシステム |
| `enablerdao.sol` | Bonfida SNS | Solana エコシステム |
| `enablerdao.com` | 通常のDNS | Webサイト |
| `enablerdao.lens` | Lens Protocol | ソーシャルグラフ (任意) |

### 3.2 ドメイン管理のベストプラクティス

1. **セキュリティ**: 全てのドメインのオーナーシップを Multisig に移管する
2. **更新管理**: ENS の更新期限をカレンダーに登録する
3. **バックアップ**: ドメインの管理権限は複数のキーで保護する
4. **DNS連携**: ENS の DNS 統合機能を使い、enablerdao.com と enablerdao.eth を連携させることも可能

---

## 4. チェックリスト

### ENS (enablerdao.eth)

- [ ] ENS App でドメインの空き状況を確認
- [ ] コミットメント Tx を実行
- [ ] 1分待機後、登録 Tx を実行
- [ ] ETH アドレスレコードを設定
- [ ] テキストレコードを設定
- [ ] サブドメインを作成 (任意)
- [ ] オーナーシップを Multisig/Timelock に移管

### Bonfida SNS (enablerdao.sol)

- [ ] Bonfida で空き状況を確認
- [ ] 登録 Tx を実行
- [ ] SOL アドレスレコードを設定
- [ ] URL レコードを設定
- [ ] オーナーシップを Multisig に移管
