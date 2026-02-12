# EnablerDAO ガバナンス体制

## 概要

EnablerDAOは、ENBトークン保有者による分散型ガバナンスを採用しています。
すべての重要な意思決定は、オンチェーンの提案・投票・実行プロセスを通じて行われます。

## トークノミクス

### ENBトークン (ENABLER)

| 項目 | 値 |
|------|-----|
| トークン名 | ENABLER |
| シンボル | ENB |
| 規格 | ERC-20 (ERC20Votes) |
| 総供給量 | 1,000,000,000 (10億) |
| デシマル | 18 |

### 配分計画

| カテゴリ | 割合 | 量 | 用途 |
|----------|------|-----|------|
| コミュニティ報酬 | 40% | 400,000,000 ENB | エアドロップ、流動性マイニング、コミュニティ貢献報酬 |
| 開発チーム | 20% | 200,000,000 ENB | コア開発チーム (2年ベスティング、6ヶ月クリフ) |
| トレジャリー | 25% | 250,000,000 ENB | DAO運営資金、戦略的パートナーシップ |
| エコシステム助成 | 15% | 150,000,000 ENB | グラント、ハッカソン、エコシステム開発支援 |

### ベスティングスケジュール (開発チーム)

```
月 0-6:   クリフ期間 (リリース不可)
月 6-24:  線形ベスティング (毎秒比例してリリース可能)
月 24~:   全量リリース可能
```

## ガバナンスプロセス

### コントラクト構成

```
┌─────────────────┐    提案    ┌──────────────────┐
│  ENB Token      │───────────>│  EnablerGovernor  │
│  (ERC20Votes)   │   投票     │                  │
│                 │<───────────│                  │
└─────────────────┘            └────────┬─────────┘
                                        │ 可決
                                        v
                               ┌──────────────────┐
                               │  EnablerTimelock  │
                               │  (2日遅延)        │
                               └────────┬─────────┘
                                        │ 実行
                                        v
                               ┌──────────────────┐
                               │  EnablerTreasury  │
                               │  / 任意のTarget   │
                               └──────────────────┘
```

### 1. 提案作成

- **提案閾値**: 1,000,000 ENB (総供給量の0.1%)
- 提案者は上記以上のENBを保有 (またはデリゲート) している必要があります
- 提案には、実行するトランザクションの詳細 (ターゲット、値、データ) と説明を含めます

### 2. 投票

- **投票遅延**: 約1日 (7,200ブロック)
  - 提案作成から投票開始までの猶予期間
  - この間にコミュニティが提案を検討する時間を確保
- **投票期間**: 約1週間 (50,400ブロック)
  - 賛成 (For) / 反対 (Against) / 棄権 (Abstain) のいずれかで投票
- **定足数**: 投票時点での総供給量の4%

### 3. キュー & 実行

- 可決された提案はTimelockのキューに追加されます
- **タイムロック遅延**: 2日 (172,800秒)
  - この間に、問題のある提案を発見・対応する時間を確保
- 遅延期間後、誰でも提案を実行可能

### 4. 緊急対応

- トレジャリーにはガーディアン (GUARDIAN_ROLE) が設定されています
- ガーディアンは以下を実行可能:
  - トレジャリーの**一時停止** (`pause`)
  - ※一時停止の**解除**はガバナンス決議が必要
- Governorを通じて提案のキャンセルも可能

## 投票権のデリゲーション

ENBトークンの投票権はデリゲーション (委任) 方式です。

### 重要: 自分自身にデリゲートが必要

ENBトークンを保有するだけでは投票権は有効になりません。
投票するには、自分自身または信頼できるアドレスにデリゲートする必要があります。

```solidity
// 自分自身にデリゲート (投票権を有効化)
enbToken.delegate(myAddress);

// 他のアドレスにデリゲート
enbToken.delegate(trustedDelegate);
```

## セキュリティ

### アクセス制御

| コントラクト | ロール | 保有者 | 権限 |
|-------------|--------|--------|------|
| EnablerToken | DEFAULT_ADMIN_ROLE | Timelock | ロール管理 |
| EnablerToken | MINTER_ROLE | Timelock | 追加ミント |
| EnablerTimelock | PROPOSER_ROLE | Governor | 提案のキュー |
| EnablerTimelock | EXECUTOR_ROLE | Governor | 提案の実行 |
| EnablerTimelock | CANCELLER_ROLE | Governor | 提案のキャンセル |
| EnablerTreasury | DEFAULT_ADMIN_ROLE | Timelock | ロール管理 |
| EnablerTreasury | GOVERNOR_ROLE | Timelock | 資金移動 |
| EnablerTreasury | GUARDIAN_ROLE | Guardian EOA | 緊急停止 |

### セキュリティ機能

1. **タイムロック**: 全ての重要な操作に2日の遅延
2. **再入攻撃防止**: Treasury と Vesting に ReentrancyGuard を適用
3. **送金上限**: Treasury の ETH/トークン送金に上限を設定
4. **一時停止機能**: 緊急時に Treasury を一時停止可能
5. **バーン機能**: トークンのバーン (焼却) が可能
6. **ガスレス承認**: ERC20Permit による gasless approval をサポート
7. **供給量上限**: MAX_SUPPLY を超えるミントは不可

## コントラクトアドレス

> デプロイ後にここを更新してください。

| コントラクト | ネットワーク | アドレス |
|-------------|-------------|---------|
| EnablerToken | - | - |
| TokenVesting | - | - |
| EnablerTimelock | - | - |
| EnablerGovernor | - | - |
| EnablerTreasury | - | - |

## デプロイ手順

```bash
# 1. 依存関係のインストール
cd contracts
npm install

# 2. コンパイル
npm run compile

# 3. テスト
npm test

# 4. ローカルノードでテストデプロイ
npm run node          # 別ターミナルで
npm run deploy:local

# 5. テストネット (Sepolia) へデプロイ
export DEPLOYER_PRIVATE_KEY=<your-private-key>
export SEPOLIA_RPC_URL=<your-rpc-url>
npm run deploy:sepolia

# 6. メインネットへデプロイ
export DEPLOYER_PRIVATE_KEY=<your-private-key>
export MAINNET_RPC_URL=<your-rpc-url>
npm run deploy:mainnet
```

## チームベスティング設定

デプロイ後、チームメンバーのベスティングを設定:

```bash
export VESTING_CONTRACT=<vesting-contract-address>
export TEAM_MEMBERS=0xAddr1,0xAddr2,0xAddr3
export TEAM_AMOUNTS=80000000,60000000,60000000
npx hardhat run scripts/setup-vesting.ts --network <network>
```
