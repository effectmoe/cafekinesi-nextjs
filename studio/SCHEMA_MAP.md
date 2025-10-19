# スキーママップ - Sanity Studio全スキーマ構成

**最終更新**: 2025-10-20

## 📋 目次

1. [ドキュメントタイプ（28個）](#ドキュメントタイプ)
2. [オブジェクト/コンポーネント（22個）](#オブジェクトコンポーネント)
3. [Sanity Studio表示構成](#sanity-studio表示構成)

---

## ドキュメントタイプ

### 🤖 AI-First ドキュメント（4個）
API経由で管理されるスキーマ。手動編集非推奨。

| スキーマ名 | ファイルパス | 用途 | Studio表示 |
|----------|-------------|------|-----------|
| `person` | `documents/person.ts` | 個人情報（DB同期） | ✅ 自動表示 |
| `service` | `documents/service.ts` | サービス情報（DB同期） | ✅ 自動表示 |
| `organization` | `documents/organization.ts` | 組織情報（DB同期） | ✅ 自動表示 |
| `aiContent` | `documents/aiContent.ts` | AI生成コンテンツ | ✅ 自動表示 |

---

### 📄 ページ管理（7個）

| スキーマ名 | ファイルパス | 用途 | Studio表示 |
|----------|-------------|------|-----------|
| `homepage` | `documents/homepage.ts` | トップページ | 🏠 サイト設定 |
| `aboutPage` | `documents/aboutPage.ts` | About Us | 📄 ページ管理 |
| `page` | `documents/page.ts` | 汎用ページ | 📄 ページ管理 |
| `schoolPage` | `documents/schoolPage.ts` | スクール情報 | 📄 ページ管理 |
| `schoolPageContent` | `documents/schoolPageContent.ts` | スクール詳細 | ✅ 自動表示 |
| `instructorPage` | `documents/instructorPage.ts` | 講師紹介設定 | ✅ 自動表示 |
| `profilePage` | `documents/profilePage.ts` | プロフィール | ✅ 自動表示 |

---

### 📝 ブログ・コンテンツ（4個）

| スキーマ名 | ファイルパス | 用途 | Studio表示 |
|----------|-------------|------|-----------|
| `blogPost` | `documents/blogPost.ts` | ブログ記事 | 📝 ブログ記事 |
| `author` | `author.ts` | 著者 | 📝 ブログ記事 |
| `category` | `category.ts` | カテゴリー | ✅ 自動表示 |
| `news` | `documents/news.ts` | ニュース | ✅ 自動表示 |

---

### 🎓 講座・イベント（3個）

| スキーマ名 | ファイルパス | 用途 | Studio表示 |
|----------|-------------|------|-----------|
| `course` | `documents/course.ts` | 講座 | 🎓 講座（階層表示） |
| `instructor` | `documents/instructor.ts` | インストラクター | ✅ 自動表示 |
| `event` | `documents/event.ts` | イベント | ✅ 自動表示 |

---

### 💬 チャット・FAQ（5個）

| スキーマ名 | ファイルパス | 用途 | Studio表示 |
|----------|-------------|------|-----------|
| `chatModal` | `documents/chatModal.ts` | チャットモーダル設定 | 💬 チャット設定 |
| `faqCard` | `documents/faqCard.ts` | FAQ質問カード | 💬 チャット設定 |
| `faq` | `documents/faq.ts` | FAQ | ✅ 自動表示 |
| `faqCategory` | `documents/faqCategory.ts` | FAQカテゴリー | ✅ 自動表示 |
| `chatConfiguration` | `documents/chatConfiguration.ts` | チャット詳細設定 | 💬 チャット設定 |

---

### 🤖 AI/RAG設定（4個）

| スキーマ名 | ファイルパス | 用途 | Studio表示 |
|----------|-------------|------|-----------|
| `ragConfiguration` | `documents/ragConfiguration.ts` | RAG設定 | 🤖 AI/RAG設定 |
| `aiGuardrails` | `documents/aiGuardrails.ts` | AIガードレール | 🤖 AI/RAG設定 |
| `aiProviderSettings` | `documents/aiProviderSettings.ts` | AIプロバイダー設定 | 🤖 AI/RAG設定 |
| `knowledgeBase` | `documents/knowledgeBase.ts` | ナレッジベース | 🤖 AI/RAG設定 |

---

### ⚙️ その他設定（3個）

| スキーマ名 | ファイルパス | 用途 | Studio表示 |
|----------|-------------|------|-----------|
| `siteSettings` | `documents/siteSettings.ts` | サイト全体設定 | 🏠 サイト設定 |
| `menuItem` | `documents/menuItem.ts` | メニュー | ✅ 自動表示 |
| `shopInfo` | `documents/shopInfo.ts` | ショップ情報 | ✅ 自動表示 |

---

### 👤 組織・代表者（1個）

| スキーマ名 | ファイルパス | 用途 | Studio表示 |
|----------|-------------|------|-----------|
| `representative` | `representative.ts` | 代表者 | ✅ 自動表示 |

---

## オブジェクト/コンポーネント

他のドキュメント内で使用される部品。ドキュメントリストには表示されない。

### 🎨 UI コンポーネント（14個）

| スキーマ名 | ファイルパス | 用途 |
|----------|-------------|------|
| `seo` | `objects/seo.ts` | SEO設定 |
| `schemaOrg` | `objects/schemaOrg.ts` | Schema.org設定 |
| `hero` | `objects/hero.ts` | ヒーローセクション |
| `cta` | `objects/cta.ts` | CTA（行動喚起） |
| `feature` | `objects/feature.ts` | 機能紹介 |
| `testimonial` | `objects/testimonial.ts` | お客様の声 |
| `categoryCard` | `objects/categoryCard.ts` | カテゴリーカード |
| `socialLink` | `objects/socialLink.ts` | SNSリンク |
| `navigationMenu` | `objects/navigationMenu.ts` | ナビゲーションメニュー |
| `table` | `objects/table.ts` | テーブル |
| `infoBox` | `objects/infoBox.ts` | 情報ボックス |
| `comparisonTable` | `objects/comparisonTable.ts` | 比較表 |
| `internalLink` | `objects/internalLink.ts` | 内部リンク |
| `externalReference` | `objects/externalReference.ts` | 外部参照 |

---

### 📸 メディアコンポーネント（8個）

| スキーマ名 | ファイルパス | 用途 |
|----------|-------------|------|
| `customImage` | `components/customImage.ts` | カスタム画像 |
| `portableText` | `components/portableText.ts` | リッチテキスト |
| `videoEmbed` | `components/videoEmbed.ts` | 動画埋め込み |
| `socialEmbed` | `components/socialEmbed.ts` | SNS埋め込み |
| `codeBlock` | `components/codeBlock.ts` | コードブロック |
| `blockContent` | `blockContent.ts` | ブロックコンテンツ |
| `customBlock` | `customBlock.ts` | カスタムブロック |
| `descriptionBlock` | `descriptionBlock.ts` | 説明ブロック |

---

## Sanity Studio表示構成

### 明示的に定義されたセクション

```
📁 Sanity Studio
├── 🏠 サイト設定
│   ├── siteSettings（サイト全体設定）
│   └── homepage（ホームページ）
│
├── 📄 ページ管理
│   ├── aboutPage（カフェキネシについて）
│   ├── page（一般ページ）
│   ├── schoolPage（スクールページ設定）
│   ├── instructorPage（インストラクターページ設定）
│   └── profilePage（プロフィールページ）
│
├── 📝 ブログ記事
│   ├── blogPost（ブログ記事）
│   └── author（著者）
│
├── 🎓 講座
│   ├── 主要講座（mainCourses）
│   └── 補助講座（supportCourses）
│
├── 💬 チャット設定
│   ├── chatModal（チャットモーダル）
│   ├── faqCard（FAQ質問カード）
│   └── chatConfiguration（チャット設定）
│
└── 🤖 AI/RAG設定
    ├── ragConfiguration（RAG設定）
    ├── aiGuardrails（AIガードレール）
    ├── aiProviderSettings（AIプロバイダー設定）
    └── knowledgeBase（ナレッジベース）
```

---

### 自動表示（その他のコンテンツ）

以下は明示的なセクションには含まれず、「その他のコンテンツ」に自動表示されます：

- ✅ `category`（カテゴリー）
- ✅ `event`（イベント）
- ✅ `news`（ニュース）
- ✅ `menuItem`（メニューアイテム）
- ✅ `shopInfo`（ショップ情報）
- ✅ `schoolPageContent`（スクールページコンテンツ）
- ✅ `instructor`（インストラクター）
- ✅ `instructorPage`（インストラクターページ設定）
- ✅ `profilePage`（プロフィールページ）
- ✅ `representative`（代表者）
- ✅ `faq`（FAQ）
- ✅ `faqCategory`（FAQカテゴリー）
- ✅ `person`, `service`, `organization`, `aiContent`（AI-First）

---

### 非表示（オブジェクト/コンポーネント）

以下はドキュメントリストには表示されません（他のドキュメント内で使用）：

- 🔒 `seo`, `hero`, `cta`, `feature`, `testimonial`
- 🔒 `categoryCard`, `socialLink`, `navigationMenu`, `table`
- 🔒 `infoBox`, `comparisonTable`, `internalLink`, `externalReference`
- 🔒 `customImage`, `portableText`, `videoEmbed`, `socialEmbed`, `codeBlock`
- 🔒 `blockContent`, `customBlock`, `descriptionBlock`

---

## 除外リスト（deskStructure.ts）

以下のスキーマは明示的セクションで定義されているため除外されています：

```typescript
[
  'siteSettings',
  'homepage',
  'aboutPage',
  'chatModal',
  'page',
  'blogPost',
  'author',  // ブログ記事セクションで明示的に定義
  'course',  // 講座は上で明示的に定義
  'schoolPage',  // スクールページは上で明示的に定義
  'schoolPageContent',  // ページ管理セクションで明示的に定義
  'instructorPage',  // ページ管理セクションで明示的に定義
  'profilePage',  // ページ管理セクションで明示的に定義
  'faqCard',  // チャット設定セクションで明示的に定義
  'chatConfiguration',  // チャット設定セクションで明示的に定義
  'ragConfiguration',  // AI/RAG設定セクションで明示的に定義
  'aiGuardrails',  // AI/RAG設定セクションで明示的に定義
  'aiProviderSettings',  // AI/RAG設定セクションで明示的に定義
  'knowledgeBase',  // AI/RAG設定セクションで明示的に定義
  // オブジェクト・コンポーネントスキーマは非表示（schemaOrgは編集可能）
  'seo',
  'hero',
  'cta',
  'feature',
  'testimonial',
  'categoryCard',
  'socialLink',
  'navigationMenu',
  'table',
  'infoBox',
  'comparisonTable',
  'internalLink',
  'externalReference',
  'customImage',
  'portableText',
  'videoEmbed',
  'socialEmbed',
  'codeBlock',
  'blockContent',
  'customBlock',
  'descriptionBlock'
]
```

---

## 📝 メンテナンス履歴

- **2025-10-20**: 初版作成
