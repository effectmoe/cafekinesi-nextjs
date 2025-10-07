# Sanity Webhook自動同期設定ガイド

## 概要
このガイドは、Sanityのコンテンツ更新を自動的にVercel Postgresデータベースに同期するWebhookの設定方法を説明します。

## システムフロー
```
1. 人間がSanityに情報登録
   ↓
2. Sanity Webhookが発火
   ↓
3. /api/sync-dbエンドポイントが受信
   ↓
4. Vercel Postgresデータベースに自動書き込み
   ↓
5. AIがデータベースから情報を読む
   ↓
6. AIが能動的に判断してユーザーに回答
```

## Webhook設定手順

### 1. Sanity Studioにログイン
https://www.sanity.io/manage

### 2. プロジェクト選択
プロジェクト名: **cafekinesi**
プロジェクトID: **e4aqw590**

### 3. Webhooks設定に移動
API タブ → Webhooks セクション → "Create Webhook"

### 4. Webhook情報入力

#### 基本設定
- **Name**: Database Sync Webhook
- **Description**: Syncs content to Vercel Postgres database

#### エンドポイント設定
- **URL**:
  - 本番: `https://cafekinesi-nextjs.vercel.app/api/sync-db`
  - ステージング: `https://cafekinesi-nextjs-staging.vercel.app/api/sync-db`

#### トリガー設定
- **Dataset**: production
- **Trigger on**:
  - ✓ Create
  - ✓ Update
  - ✓ Delete

#### フィルター（GROQ）
```groq
_type in ["instructor", "course", "blogPost", "page"]
```

#### セキュリティ設定
- **Secret**: ランダムな文字列を生成
  ```bash
  openssl rand -hex 32
  ```
- **HTTP Method**: POST
- **Headers**:
  ```
  Content-Type: application/json
  ```

### 5. 環境変数の設定

#### Vercel Dashboard
Settings → Environment Variables
```
SANITY_WEBHOOK_SECRET=[生成したSecret]
```

#### ローカル環境（.env.local）
```
SANITY_WEBHOOK_SECRET=[生成したSecret]
```

## 手動同期（初回設定時）

### ローカル環境
```bash
curl -X GET "http://localhost:3000/api/sync-db"
```

### 本番環境
```bash
curl -X GET "https://cafekinesi-nextjs.vercel.app/api/sync-db"
```

## 動作確認

### 1. Sanityでコンテンツ更新
Sanity Studioで任意のインストラクター情報を更新

### 2. Webhook配信確認
Sanity管理画面 → Webhooks → View Logs

### 3. データベース確認
```bash
curl "https://cafekinesi-nextjs.vercel.app/api/debug/instructors"
```

### 4. AIチャットで確認
チャット画面で「どのようなインストラクターがいますか？」と質問

## トラブルシューティング

### Webhook配信失敗
- Secretの不一致を確認
- エンドポイントURLの正確性を確認
- Vercelのログを確認

### データベース同期失敗
- POSTGRES_URLなどの環境変数を確認
- ベクトルストアの初期化エラーを確認
- Vercelのログで詳細を確認

### AIが最新情報を返さない
- RAGエンジンの検索閾値を調整
- embeddings テーブルの内容を確認
- キャッシュのクリアを検討

## 重要な注意点

1. **初回設定後は手動同期が必要**
   - 既存のデータをデータベースに反映させるため

2. **Webhook Secretは安全に管理**
   - Gitにコミットしない
   - 環境変数で管理

3. **データタイプの追加**
   - 新しいコンテンツタイプを追加する場合は、Webhookフィルターと/api/sync-dbの両方を更新

## 関連ファイル
- `/app/api/sync-db/route.ts` - 同期エンドポイント
- `/app/api/chat/route.ts` - AIチャットAPI
- `/lib/vector/vercel-vector-store.ts` - ベクトルストア
- `/lib/rag/rag-engine.ts` - RAGエンジン