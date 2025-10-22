# Database Migration Guide - document_embeddings テーブル作成

## 問題の概要
AI チャット機能が 500 エラーを返す原因：
- Vercel Postgres データベースは存在 ✅
- 環境変数は設定済み ✅
- `document_embeddings` テーブルが未作成 ❌
- pgvector 拡張機能が未有効化 ❌

## 解決方法

### Step 1: Vercel Dashboard で SQL マイグレーション実行

1. **Vercel Dashboard にアクセス**
   - https://vercel.com/dashboard
   - プロジェクト `cafekinesi-nextjs` を選択

2. **Storage タブに移動**
   - 上部メニューから `Storage` をクリック
   - Postgres データベースを選択

3. **Query タブを開く**
   - データベース詳細画面で `Query` タブをクリック

4. **マイグレーション SQL を実行**
   - `/migrations/001_create_document_embeddings.sql` の内容をコピー
   - Query エディタに貼り付け
   - `Execute` ボタンをクリック

### Step 2: マイグレーション成功の確認

実行後、以下のコマンドで確認：

```sql
-- テーブルが作成されたか確認
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'document_embeddings';

-- pgvector 拡張機能が有効か確認
SELECT * FROM pg_extension WHERE extname = 'vector';

-- インデックスが作成されたか確認
SELECT indexname
FROM pg_indexes
WHERE tablename = 'document_embeddings';
```

**期待される結果**:
- `document_embeddings` テーブルが存在
- `vector` 拡張機能が有効
- 5 つのインデックスが作成されている：
  - `idx_document_embeddings_type`
  - `idx_document_embeddings_updated_at`
  - `idx_document_embeddings_content_gin`
  - `idx_document_embeddings_title_gin`
  - `idx_document_embeddings_embedding_ivfflat`

### Step 3: データ投入スクリプト実行

マイグレーション完了後、以下のコマンドでデータを投入：

```bash
# プロジェクトルートで実行
npm run populate-embeddings

# または直接実行
npx tsx scripts/populate-document-embeddings.ts
```

### Step 4: 動作確認

1. **Vercel にデプロイ**
   ```bash
   git add .
   git commit -m "feat: document_embeddings テーブル作成とデータ投入"
   git push origin master
   ```

2. **本番環境で AI チャットをテスト**
   - https://cafekinesi-nextjs.vercel.app/ にアクセス
   - AI チャットで質問を送信
   - 500 エラーが解消されていることを確認

## トラブルシューティング

### エラー: "extension \"vector\" does not exist"

**原因**: pgvector 拡張機能がインストールされていない

**解決策**:
```sql
-- 拡張機能を有効化（管理者権限が必要）
CREATE EXTENSION IF NOT EXISTS vector;
```

Vercel Postgres では pgvector は標準でサポートされています。上記のコマンドで有効化できます。

### エラー: "permission denied for schema public"

**原因**: データベースユーザーに十分な権限がない

**解決策**: Vercel Dashboard の Settings → Environment Variables で以下を確認：
- `POSTGRES_URL` が正しく設定されている
- データベース接続ユーザーに CREATE 権限がある

### データ投入時のエラー: "DEEPSEEK_API_KEY is not set"

**原因**: DeepSeek API キーが設定されていない

**解決策**: Vercel Dashboard の Settings → Environment Variables で以下を設定：
```
DEEPSEEK_API_KEY=your_api_key_here
```

### データ投入時のエラー: "Rate limit exceeded"

**原因**: DeepSeek API のレート制限に達した

**解決策**: `scripts/populate-document-embeddings.ts` の `RATE_LIMIT_DELAY` を増やす：
```typescript
const RATE_LIMIT_DELAY = 2000; // 1000ms → 2000ms に変更
```

## 参考情報

### document_embeddings テーブル構造

| カラム名 | 型 | 説明 |
|---------|---|------|
| id | TEXT | 主キー (例: blog-{slug}, faq-{id}) |
| type | TEXT | ドキュメントタイプ (blog, faq, course, event) |
| title | TEXT | タイトル |
| content | TEXT | 本文テキスト |
| url | TEXT | URL パス |
| metadata | JSONB | メタデータ (タグ, カテゴリ等) |
| embedding | vector(1536) | ベクトル埋め込み (DeepSeek) |
| updated_at | TIMESTAMP | 最終更新日時 |

### ベクトル検索の仕組み

1. **ユーザーの質問**: "ストレス解消法を教えて"
2. **埋め込み生成**: DeepSeek API で質問を 1536 次元ベクトルに変換
3. **類似度検索**: `document_embeddings` テーブルからコサイン類似度で検索
4. **ハイブリッド検索**: ベクトル検索 + キーワード検索を組み合わせ
5. **プロンプト拡張**: 検索結果を AI プロンプトに追加
6. **応答生成**: DeepSeek AI が拡張プロンプトから回答を生成

### 更新・メンテナンス

新しいブログ記事や FAQ を追加した場合：
```bash
# 差分データのみ投入
npm run populate-embeddings -- --incremental

# 全データを再投入
npm run populate-embeddings -- --force
```

---

**作成日**: 2025-10-22
**対応バージョン**: Next.js 15, Vercel Postgres, pgvector 0.5.0+
