# ADS Optimizer for Salesforce

> Affinity Depth Score (ADS) で顧客との関係深度を可視化し、ビジネスの"取りこぼし"を防ぐ

## 概要

CRMを「需要創出装置」ではなく「損失防止装置」として正しく機能させるための  
Salesforce拡張ダッシュボード。

**ADS = (IS × IDS × NS)^(1/3)**

| スコア | 指標 | データソース |
|--------|------|-------------|
| IS（非代替性） | 指名行動・比較回避・回帰行動 | GA4 |
| IDS（同一化） | 自己表現語彙・公開選択 | SNS/アンケート |
| NS（物語参加） | 継続年数・エピソード言語 | CRM |

## 画面構成

- **LTV分解** — 4層ファネルでボトルネックを可視化
- **ADS診断** — IS/IDS/NSのレーダーチャート
- **アクション** — スコア別Salesforceシナリオ提案
- **AIアドバイス** — Claude APIによる動的施策生成
- **分布分析** — 顧客ポートフォリオとブランドリスク
- **データ入力** — CSVアップロードで実データ対応

## セットアップ

```bash
npm install
npm run dev
```

## デプロイ（Vercel）

```bash
npm run build
# Vercel CLIまたはGitHub連携でデプロイ
```

## データ入力（Phase 2まで）

CSVアップロード機能を使って仮データを差し替え可能。  
必須列: `customer_id`, `branded_search`, `direct`, `converted`,  
`repurchased`, `is_score`, `ids_score`, `ns_score`

## Roadmap

- [x] Phase 1: モックUIの完成
- [x] Phase 2: CSVアップロード + スコア計算
- [x] Phase 3: Claude APIによるAIサジェスト
- [ ] Phase 4: GA4 / Salesforce OAuth連携（POC顧客との実証）
