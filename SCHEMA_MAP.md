# Sanity スキーママッピング

このドキュメントは、Sanity CMSスキーマとNext.jsフロントエンドページの対応関係を示します。

**最終更新**: 2025-10-19
**管理者**: tonychustudio

---

## 📋 目次

1. [概要](#概要)
2. [スキーマ一覧](#スキーマ一覧)
3. [ページ別スキーマ使用状況](#ページ別スキーマ使用状況)
4. [AI検索対応スキーマ](#ai検索対応スキーマ)
5. [非推奨化されたスキーマ](#非推奨化されたスキーマ)
6. [メンテナンスガイドライン](#メンテナンスガイドライン)

---

## 概要

### 現在のスキーマ構成

- **総スキーマ数**: 20個（使用中）
- **非推奨化**: 8個
- **AI検索対応**: 4個

### ディレクトリ構造

```
studio/schemas/
├── ai-first/          # AI検索最適化スキーマ（非推奨化）
├── ai/                # AI/RAG設定スキーマ
├── chat/              # チャット設定スキーマ
├── components/        # 再利用可能コンポーネントスキーマ
├── documents/         # ドキュメントスキーマ
├── objects/           # オブジェクトスキーマ
├── rag/               # RAG設定スキーマ
├── representative.ts  # 代表者スキーマ
└── index.ts           # スキーマエクスポート
```

---

## スキーマ一覧

### ✅ 使用中のスキーマ（20個）

| # | スキーマ名 | タイプ | 使用箇所 | AI検索 | GROQクエリ |
|---|-----------|-------|---------|--------|-----------|
| 1 | blogPost | document | `/blog`<br>`/blog/[slug]` | ✅ | `BLOG_POSTS_QUERY`<br>`BLOG_POST_BY_SLUG_QUERY`<br>`BLOG_POST_PREVIEW_QUERY` |
| 2 | course | document | `/school`<br>`/school/[courseId]` | ✅ | `COURSES_WITH_DETAILS_QUERY`<br>`COURSE_DETAIL_QUERY` |
| 3 | event | document | `/events/[slug]`<br>`/calendar` | ✅ | `EVENTS_QUERY`<br>`EVENTS_BY_MONTH_QUERY`<br>`EVENTS_BY_DATE_RANGE_QUERY`<br>`AVAILABLE_EVENTS_QUERY`<br>`EVENT_DETAIL_QUERY` |
| 4 | instructor | document | `/instructor`<br>`/instructor/[prefecture]/[slug]` | ✅ | `INSTRUCTORS_QUERY`<br>`INSTRUCTOR_DETAIL_QUERY`<br>`FEATURED_INSTRUCTORS_QUERY` |
| 5 | instructorPage | document | `/instructor` | - | `INSTRUCTOR_PAGE_QUERY` |
| 6 | author | document | `/author/[slug]`<br>`/blog/*` | - | (blogPostから参照) |
| 7 | homepage | document | `/` | - | `HOMEPAGE_QUERY`<br>`HOMEPAGE_SECTIONS_QUERY` |
| 8 | page | document | `/[slug]` | - | `PAGE_QUERY`<br>`ALL_PAGES_QUERY` |
| 9 | schoolPage | document | `/school` | - | `SCHOOL_PAGE_QUERY` |
| 10 | profilePage | document | `/profile` | - | `PROFILE_PAGE_QUERY` |
| 11 | aboutPage | document | `/about` | - | `ABOUT_PAGE_QUERY` |
| 12 | representative | document | API（DB同期） | - | - |
| 13 | siteSettings | document | 全ページ | - | - |
| 14 | faqCard | document | `/` | - | `FAQ_CARDS_QUERY` |
| 15 | chatModal | document | `/` | - | `CHAT_MODAL_QUERY` |
| 16 | chatConfiguration | document | チャットAPI | - | - |
| 17 | aiGuardrails | document | チャットAPI | - | `/api/chat/rag` |
| 18 | aiProviderSettings | document | チャットAPI | - | `/api/chat/rag` |
| 19 | ragConfiguration | document | RAG設定 | - | `/api/chat/rag` |
| 20 | knowledgeBase | document | RAG設定 | - | - |

---

## ページ別スキーマ使用状況

### トップページ (`/`)

**ファイル**: `app/page.tsx`

| スキーマ | 用途 |
|---------|------|
| homepage | カテゴリーカード、ブログセクション設定、ナビゲーションメニュー |
| blogPost | ブログ記事一覧表示 |
| aboutPage | Aboutセクションのデータ |
| faqCard | チャットモーダルのFAQカード |
| chatModal | チャットモーダルの設定 |

**GROQクエリ**:
- `HOMEPAGE_QUERY`
- `RECENT_POSTS_QUERY`
- `ABOUT_PAGE_QUERY`
- `FAQ_CARDS_QUERY`
- `CHAT_MODAL_QUERY`

---

### ブログ (`/blog`, `/blog/[slug]`)

**ファイル**: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`

| スキーマ | 用途 |
|---------|------|
| blogPost | ブログ記事の内容 |
| author | 記事の著者情報 |

**GROQクエリ**:
- `POSTS_QUERY`
- `POST_QUERY`
- `DRAFT_POST_QUERY`
- `ALL_POSTS_QUERY`

---

### スクール (`/school`, `/school/[courseId]`)

**ファイル**: `app/school/page.tsx`, `app/school/[courseId]/page.tsx`

| スキーマ | 用途 |
|---------|------|
| course | 講座情報、詳細ページ |
| schoolPage | スクールページ設定（FAQ、学習フロー、認定情報） |

**GROQクエリ**:
- `COURSES_QUERY`
- `SCHOOL_PAGE_QUERY`
- `COURSE_DETAIL_QUERY`

---

### インストラクター (`/instructor`, `/instructor/[prefecture]/[slug]`)

**ファイル**: `app/instructor/page.tsx`, `app/instructor/[prefecture]/[slug]/page.tsx`

| スキーマ | 用途 |
|---------|------|
| instructor | インストラクター情報 |
| instructorPage | インストラクターページ設定（ヒーローセクション、サービスセクション） |

**GROQクエリ**:
- `INSTRUCTORS_QUERY`
- `INSTRUCTOR_PAGE_QUERY`
- `INSTRUCTOR_DETAIL_QUERY`

---

### イベント (`/events/[slug]`, `/calendar`)

**ファイル**: `app/events/[slug]/page.tsx`, `app/calendar/page.tsx`

| スキーマ | 用途 |
|---------|------|
| event | イベント情報、詳細ページ |

**GROQクエリ**:
- `EVENTS_QUERY`
- `EVENTS_BY_MONTH_QUERY`
- `EVENT_DETAIL_QUERY`

---

### Aboutページ (`/about`)

**ファイル**: (トップページに組み込み)

| スキーマ | 用途 |
|---------|------|
| aboutPage | カフェキネシについての情報 |

**GROQクエリ**:
- `ABOUT_PAGE_QUERY`

---

### プロフィールページ (`/profile`)

**ファイル**: `app/profile/page.tsx`

| スキーマ | 用途 |
|---------|------|
| profilePage | 代表者プロフィール情報 |

**GROQクエリ**:
- `PROFILE_PAGE_QUERY`

---

### 動的ページ (`/[slug]`)

**ファイル**: `app/[slug]/page.tsx`

| スキーマ | 用途 |
|---------|------|
| page | ページビルダーを使用したカスタムページ |

**GROQクエリ**:
- `PAGE_QUERY`
- `ALL_PAGES_QUERY`

---

### 著者ページ (`/author/[slug]`)

**ファイル**: `app/author/[slug]/page.tsx`

| スキーマ | 用途 |
|---------|------|
| author | 著者情報、プロフィール |
| blogPost | 著者の記事一覧 |

**GROQクエリ**:
- `AUTHOR_QUERY`

---

### APIエンドポイント

#### `/api/chat/rag`

| スキーマ | 用途 |
|---------|------|
| ragConfiguration | RAG設定 |
| aiGuardrails | AIガードレール設定 |
| aiProviderSettings | AIプロバイダー設定 |

#### `/api/sync-db`

| スキーマ | 用途 |
|---------|------|
| representative | 代表者情報のDB同期 |
| instructor | インストラクター情報のDB同期 |
| profilePage | プロフィールページのDB同期 |
| course | 講座情報のDB同期 |
| blogPost | ブログ記事のDB同期 |
| page | ページ情報のDB同期 |

---

## AI検索対応スキーマ

以下のスキーマはAI検索（チャットボット、RAG）に対応しています。

### 対応スキーマ

| スキーマ | AI最適化フィールド |
|---------|------------------|
| blogPost | - 通常のフィールド（title, excerpt, content等）をAI検索に使用 |
| course | `aiSearchKeywords`, `aiQuickAnswer`, `conversationalQueries`, `topicClusters`, `intentType` |
| event | `tags`, `useForAI`, `aiSearchText` |
| instructor | `aiSearchKeywords`, `aiQuickAnswer`, `conversationalQueries` |

### AI検索で使用されるクエリ

**ファイル**: `app/api/ai-knowledge/route.ts`

- ブログ記事検索
- 講座検索
- インストラクター検索
- イベント検索（`useForAI == true` のみ）

---

## 非推奨化されたスキーマ

以下のスキーマは `studio/schemas/index.ts` でコメントアウトされ、Sanity Studioから非表示になっています。

### AI-Firstスキーマ（4個）

| スキーマ名 | 理由 | 復元方法 |
|-----------|------|---------|
| service | フロントエンド未実装、instructorPage.servicesSectionと混同の可能性 | `index.ts` のコメントアウト解除 |
| person | フロントエンド未実装、instructorスキーマと重複 | `index.ts` のコメントアウト解除 |
| organization | 将来的な実装を想定して保持 | `index.ts` のコメントアウト解除 |
| aiContent | AI検索最適化用（将来的な実装を想定） | `index.ts` のコメントアウト解除 |

### ドキュメントスキーマ（4個）

| スキーマ名 | 理由 | 復元方法 |
|-----------|------|---------|
| news | フロントエンドページ未実装 | `index.ts` のコメントアウト解除 |
| menuItem | カフェメニュー機能未実装 | `index.ts` のコメントアウト解除 |
| shopInfo | 店舗情報ページ未実装 | `index.ts` のコメントアウト解除 |
| category | menuItemの参照先、menuItem自体が未使用 | `index.ts` のコメントアウト解除 |

---

## メンテナンスガイドライン

### 新しいスキーマを追加する場合

1. **スキーマファイルを作成**
   ```bash
   touch studio/schemas/documents/newSchema.ts
   ```

2. **メタ情報を必ず追加**
   ```typescript
   export default defineType({
     name: 'newSchema',
     title: 'New Schema',
     type: 'document',
     icon: () => '🆕', // 絵文字アイコン
     description: '📍 使用箇所: /new-page | ステータス: ✅ 使用中 | 説明文',
     fields: [...]
   })
   ```

3. **`index.ts` にインポート**
   ```typescript
   import newSchema from './documents/newSchema'

   export const schemaTypes = [
     ...
     newSchema,
   ]
   ```

4. **このドキュメントを更新**
   - スキーマ一覧に追加
   - ページ別使用状況に追加
   - 必要に応じてAI検索対応状況も更新

5. **GROQクエリを `lib/queries.ts` に追加**
   ```typescript
   export const NEW_SCHEMA_QUERY = `
     *[_type == "newSchema"] {
       ...
     }
   `
   ```

---

### 既存のスキーマを更新する場合

1. **スキーマファイルを更新**
2. **このドキュメントの該当箇所を更新**
3. **必要に応じてGROQクエリも更新**

---

### スキーマを非推奨化する場合

1. **`studio/schemas/index.ts` でコメントアウト**
   ```typescript
   // import oldSchema from './documents/oldSchema' // 未使用（YYYY-MM-DD）

   export const schemaTypes = [
     // oldSchema, // 未使用（YYYY-MM-DD）
   ]
   ```

2. **このドキュメントの非推奨化リストに追加**

3. **ファイル自体は削除しない**（将来の復元のため）

---

### トラブルシューティング

#### スキーマがSanity Studioに表示されない

1. `studio/schemas/index.ts` でインポートされているか確認
2. `schemaTypes` 配列に追加されているか確認
3. Sanity Studioを再起動

#### GROQクエリが機能しない

1. `lib/queries.ts` にクエリが定義されているか確認
2. スキーマ名（`_type`）が正しいか確認
3. Sanityダッシュボードでデータが存在するか確認

---

## 参考リンク

- [Sanity スキーマドキュメント](https://www.sanity.io/docs/schema-types)
- [GROQクエリリファレンス](https://www.sanity.io/docs/query-cheat-sheet)
- [プロジェクトREADME](./README.md)

---

**作成日**: 2025-10-19
**更新履歴**:
- 2025-10-19: 初版作成（20スキーマ、8個非推奨化）
