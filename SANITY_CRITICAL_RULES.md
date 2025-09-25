# 🚨 Sanity-Next.js 連携 重要ルール - 絶対に触ってはいけない箇所

## 1. ❌ 絶対に変更禁止の設定

### `/lib/sanity.client.ts`
```typescript
// これらの値は絶対に変更しない
projectId: 'e4aqw590'  // ✅ 固定値
dataset: 'production'   // ✅ 固定値
apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01' // ✅ 環境変数使用必須
```

### 環境変数（.env.local）
```bash
# これらの環境変数は削除・変更禁止
NEXT_PUBLIC_SANITY_PROJECT_ID=e4aqw590
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=（トークン値）
```

## 2. ⚠️ 変更時に細心の注意が必要な箇所

### GROQクエリの基本構造
```javascript
// ❌ してはいけない
const QUERY = groq`*[_type == "blogPost"][0]` // slug条件なしで取得

// ✅ 正しい形
const QUERY = groq`*[_type == "blogPost" && slug.current == $slug][0]`
```

### PortableTextコンポーネント
```jsx
// ❌ してはいけない - componentsプロパティを削除
<PortableText value={post.content} />

// ✅ 正しい形 - 画像ハンドラを必ず含める
<PortableText
  value={post.content}
  components={{
    types: {
      image: ({value}) => { /* 画像処理 */ }
    }
  }}
/>
```

## 3. 🔒 データ取得パターン（変更禁止）

### 単一記事取得
```typescript
// このパターンを維持
async function getPost(slug: string) {
  const draft = await draftMode()
  const isPreview = draft.isEnabled
  const selectedClient = isPreview ? previewClient : publicClient

  return selectedClient.fetch(QUERY, { slug })
}
```

### 参照の展開
```javascript
// 必ずこの形式を維持
author-> {
  name,
  image,
  bio
}
```

## 4. 📝 フィールド取得時の注意点

### 必須フィールド（削除禁止）
- `_id`
- `_type`
- `slug`
- `title`

### オプショナルフィールド（存在チェック必須）
```jsx
// ❌ してはいけない
<div>{post.tldr}</div>

// ✅ 正しい形
{post.tldr && (
  <div>{post.tldr}</div>
)}
```

## 5. 🚫 絶対に削除してはいけないインポート

```javascript
import { client, groq, urlFor, publicClient, previewClient } from '@/lib/sanity.client'
import { PortableText } from '@portabletext/react'
import { draftMode } from 'next/headers'
```

## 6. ⚠️ Sanity Studio関連

### `/studio/sanity.config.ts`
- プラグインの削除・変更は慎重に
- 特にdashboardTool、schemaMarkupは削除禁止

### スキーマファイル
- `/studio/schemas/documents/`内のファイルは基本構造を維持
- フィールド追加は可、削除は要注意

## 7. 🔴 キャッシュ設定（重要）

```typescript
// 本番環境
useCdn: true  // CDN使用でパフォーマンス向上

// プレビュー環境
useCdn: false // リアルタイムデータ取得
```

## 8. ✅ 安全に変更できる部分

- UIコンポーネントのスタイリング
- 表示順序の変更
- 新規セクションの追加（既存を壊さない形で）
- エラーメッセージのカスタマイズ
- バリデーションルールの追加

## 9. 🎯 トラブルシューティング

### よくある問題と原因

1. **データが表示されない**
   - クエリにフィールドが含まれていない
   - 存在チェックが漏れている

2. **画像が表示されない**
   - PortableTextの画像ハンドラが未定義
   - urlForの使用方法が間違っている

3. **API エラー (429, 404)**
   - APIバージョンの不一致
   - レート制限
   - プロジェクトID/データセットの誤り

## 10. 📋 チェックリスト（変更前に確認）

- [ ] 環境変数は正しく設定されているか
- [ ] クエリに必要なフィールドがすべて含まれているか
- [ ] オプショナルフィールドの存在チェックをしているか
- [ ] PortableTextの画像ハンドラは定義されているか
- [ ] プレビューモードとパブリックモードの切り替えは正しいか
- [ ] キャッシュ設定は適切か

---
**最終更新**: 2025-01-10
**重要度**: 🔴 最高

このドキュメントは必ず開発時に参照し、変更を加える前に確認すること。