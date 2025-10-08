# AI Knowledge API

AIエージェント向けの公開APIエンドポイント

## 概要

Sanity CMSのコンテンツ（ブログ記事、講座、講師情報）をJSON形式で提供するREST APIです。GPT-4、Perplexity、Claudeなどのプラットフォームからのアクセスを想定しています。

## エンドポイント

```
GET /api/ai-knowledge
```

## クエリパラメータ

| パラメータ | 型 | デフォルト | 説明 |
|----------|---|----------|------|
| `type` | string | `'all'` | コンテンツタイプ: `blog`, `course`, `instructor`, `all` |
| `q` | string | - | 検索クエリ（部分一致） |
| `limit` | number | `10` | 取得件数（1-100の範囲） |

## 使用例

### 1. ブログ記事を取得

```bash
# 最新10件のブログ記事
curl "https://cafekinesi.com/api/ai-knowledge?type=blog&limit=10"

# キネシオロジーに関する記事
curl "https://cafekinesi.com/api/ai-knowledge?type=blog&q=キネシオロジー"
```

### 2. 講座情報を取得

```bash
# 全講座を取得
curl "https://cafekinesi.com/api/ai-knowledge?type=course"

# タオに関する講座
curl "https://cafekinesi.com/api/ai-knowledge?type=course&q=タオ"
```

### 3. 講師情報を取得

```bash
# 全講師を取得
curl "https://cafekinesi.com/api/ai-knowledge?type=instructor"

# 東京の講師を検索
curl "https://cafekinesi.com/api/ai-knowledge?type=instructor&q=東京"
```

### 4. 全コンテンツを取得

```bash
# ブログ、講座、講師を各タイプから取得
curl "https://cafekinesi.com/api/ai-knowledge?type=all&limit=30"
```

## レスポンス形式

### 成功レスポンス (200)

```json
{
  "success": true,
  "data": [
    {
      "_id": "abc123",
      "_type": "blogPost",
      "title": "キネシオロジーの基礎",
      "slug": "kinesiology-basics",
      "excerpt": "キネシオロジーの基本的な考え方を解説します...",
      "publishedAt": "2025-01-15T10:00:00Z",
      "_updatedAt": "2025-01-16T12:00:00Z",
      "url": "/blog/kinesiology-basics",
      "tags": ["キネシオロジー", "基礎"],
      "category": "学習",
      "author": "山田太郎",
      "imageUrl": "https://cdn.sanity.io/images/..."
    }
  ],
  "meta": {
    "count": 10,
    "type": "blog",
    "query": "キネシオロジー",
    "limit": 10,
    "processingTime": 156,
    "timestamp": "2025-10-08T04:30:00.000Z"
  }
}
```

### エラーレスポンス (429) - レート制限超過

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "リクエスト数が制限を超えました。1時間後に再試行してください。",
  "retryAfter": 3600
}
```

### エラーレスポンス (500) - サーバーエラー

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "データの取得に失敗しました。"
}
```

## レスポンスフィールド

### Blog Post

| フィールド | 型 | 説明 |
|----------|---|------|
| `_id` | string | 一意のID |
| `_type` | string | コンテンツタイプ（`blogPost`） |
| `title` | string | 記事タイトル |
| `slug` | string | URLスラッグ |
| `excerpt` | string | 記事の概要 |
| `publishedAt` | string | 公開日時（ISO 8601） |
| `_updatedAt` | string | 最終更新日時（ISO 8601） |
| `url` | string | 記事URL（相対パス） |
| `tags` | string[] | タグ配列 |
| `category` | string | カテゴリ |
| `author` | string | 著者名 |
| `imageUrl` | string | メイン画像URL |

### Course

| フィールド | 型 | 説明 |
|----------|---|------|
| `_id` | string | 一意のID |
| `_type` | string | コンテンツタイプ（`course`） |
| `title` | string | 講座タイトル |
| `subtitle` | string | サブタイトル |
| `slug` | string | URLスラッグ |
| `description` | string | 講座説明 |
| `_updatedAt` | string | 最終更新日時（ISO 8601） |
| `url` | string | 講座URL（相対パス） |
| `features` | string[] | 講座の特徴 |
| `imageUrl` | string | 画像URL |

### Instructor

| フィールド | 型 | 説明 |
|----------|---|------|
| `_id` | string | 一意のID |
| `_type` | string | コンテンツタイプ（`instructor`） |
| `name` | string | 講師名 |
| `slug` | string | URLスラッグ |
| `bio` | string | プロフィール |
| `region` | string | 地域（都道府県） |
| `specialties` | string[] | 専門分野 |
| `_updatedAt` | string | 最終更新日時（ISO 8601） |
| `url` | string | 講師URL（相対パス） |
| `imageUrl` | string | プロフィール画像URL |

## セキュリティ

### レート制限

- **制限**: 100リクエスト/時間/IP
- **超過時**: HTTP 429 (Too Many Requests)
- **リセット**: 1時間後に自動リセット

### データ保護

- ✅ ドラフトコンテンツは除外
- ✅ 公開データのみ提供
- ✅ GROQインジェクション対策済み
- ✅ IPアドレスベースの制限

## パフォーマンス

- **Runtime**: Vercel Edge Runtime
- **レイテンシー**: 平均 100-200ms
- **キャッシュ**: 5分間（`Cache-Control: s-maxage=300`）
- **再検証**: ISR（5分ごと）

## AIエージェント統合例

### GPT-4 Actions

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Cafe Kinesi Knowledge API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://cafekinesi.com"
    }
  ],
  "paths": {
    "/api/ai-knowledge": {
      "get": {
        "operationId": "getKnowledge",
        "parameters": [
          {
            "name": "type",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": ["blog", "course", "instructor", "all"]
            }
          },
          {
            "name": "q",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100
            }
          }
        ]
      }
    }
  }
}
```

### Perplexity Integration

Perplexityでは自動的にAPIを検出しますが、明示的に統合する場合：

```javascript
const response = await fetch(
  'https://cafekinesi.com/api/ai-knowledge?type=blog&q=瞑想&limit=5'
)
const { data } = await response.json()
```

### Claude MCP Server

```json
{
  "mcpServers": {
    "cafekinesi": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-fetch"],
      "env": {
        "API_BASE_URL": "https://cafekinesi.com/api/ai-knowledge"
      }
    }
  }
}
```

## モニタリング

### ログ

すべてのリクエストはサーバーログに記録されます：

```
[AI Knowledge API] Request from 1.2.3.4: type=blog, q=キネシオロジー, limit=10
[AI Knowledge API] Success: 10 items in 156ms
```

### レート制限の監視

```typescript
// レスポンスヘッダーで確認
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-Response-Time: 156ms
```

## トラブルシューティング

### 429 エラー（レート制限）

**原因**: 1時間あたり100リクエストを超過

**解決策**:
- リクエスト頻度を下げる
- キャッシュを活用する
- 1時間待つ

### 500 エラー（サーバーエラー）

**原因**: Sanity接続エラー、クエリエラー

**解決策**:
- Sanity Studioでコンテンツを確認
- 環境変数を確認（`SANITY_PROJECT_ID`, `SANITY_DATASET`）
- ログを確認

## ベストプラクティス

1. **キャッシュを活用**: 同じクエリは5分間キャッシュされます
2. **limitを適切に設定**: 必要最小限の件数を取得
3. **検索クエリを使用**: `q`パラメータで絞り込み
4. **エラーハンドリング**: 429/500エラーに対応
5. **レスポンシブ**: processingTimeを監視

## ライセンス

このAPIは公開情報を提供するものであり、商用利用は利用規約に従ってください。

## サポート

- **ドキュメント**: https://cafekinesi.com/docs
- **問い合わせ**: info@cafekinesi.com
- **GitHub**: https://github.com/effectmoe/cafekinesi-nextjs
