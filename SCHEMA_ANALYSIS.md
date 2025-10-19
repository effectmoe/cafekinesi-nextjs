# Sanity スキーマ分析レポート

**生成日時**: 2025-10-19
**生成方法**: `npm run analyze:schemas`

---

## 📊 サマリー

- **アクティブなスキーマ**: 39個
- **非推奨化されたスキーマ**: 8個
- **総スキーマ数**: 47個

---

## ✅ アクティブなスキーマ（39個）

| # | スキーマ名 | タイトル | アイコン | ステータス |
|---|-----------|---------|---------|-----------|
| 1 | `blogPost` | ブログ記事 | 📝 | ✅ 使用中 |
| 2 | `author` | 著者 | ✍️ | ✅ 使用中 |
| 3 | `event` | イベント | 📅 | ✅ 使用中 |
| 4 | `page` | ページ | 📄 | ✅ 使用中 |
| 5 | `homepage` | トップページ | 🏠 | ✅ 使用中 |
| 6 | `siteSettings` | サイト設定 | ⚙️ | ⚠️ 確認必要 |
| 7 | `course` | 講座 | - | ✅ 使用中 |
| 8 | `schoolPage` | スクールページ設定 | - | ✅ 使用中 |
| 9 | `schoolPageContent` | スクールページコンテンツ | - | - |
| 10 | `instructor` | インストラクター | - | ✅ 使用中 |
| 11 | `instructorPage` | インストラクターページ設定 | - | ✅ 使用中 |
| 12 | `profilePage` | プロフィールページ設定 | - | ✅ 使用中 |
| 13 | `aboutPage` | カフェキネシについて（Aboutページ） | ℹ️ | ✅ 使用中 |
| 14 | `representative` | 代表者 | 👔 | ✅ 使用中 |
| 15 | `faqCard` | FAQ質問カード | ❓ | ✅ 使用中 |
| 16 | `chatModal` | チャットモーダル設定 | 💬 | ✅ 使用中 |
| 17 | `chatConfiguration` | チャット設定 | - | - |
| 18 | `aiGuardrails` | AIガードレール設定 | - | - |
| 19 | `aiProviderSettings` | AIプロバイダー設定 | - | - |
| 20 | `ragConfiguration` | RAG設定 | - | - |
| 21 | `seo` | SEO設定 | - | - |
| 22 | `schemaOrg` | Schema.org設定 | - | - |
| 23 | `hero` | ヒーローセクション | - | - |
| 24 | `cta` | Call to Action | - | - |
| 25 | `feature` | 機能・特徴セクション | - | - |
| 26 | `testimonial` | お客様の声 | - | - |
| 27 | `categoryCard` | カテゴリーカード | - | - |
| 28 | `socialLink` | ソーシャルリンク | - | - |
| 29 | `navigationMenu` | ナビゲーションメニュー | - | - |
| 30 | `table` | テーブル（表） | - | - |
| 31 | `infoBox` | 情報ボックス | - | - |
| 32 | `comparisonTable` | 比較表 | - | - |
| 33 | `internalLink` | 内部リンク | - | - |
| 34 | `externalReference` | 外部リンク（参考文献） | - | - |
| 35 | `customImage` | 画像 | - | - |
| 36 | `portableText` | リッチテキスト | - | - |
| 37 | `videoEmbed` | 動画埋め込み | - | - |
| 38 | `socialEmbed` | SNS埋め込み | - | - |
| 39 | `codeBlock` | コードブロック | - | - |

---

## ⚠️ 非推奨化されたスキーマ（8個）

| # | スキーマ名 | ファイルパス |
|---|-----------|------------|
| 1 | `person` | ./ai-first/person |
| 2 | `service` | ./ai-first/service |
| 3 | `organization` | ./ai-first/organization |
| 4 | `aiContent` | ./ai-first/aiContent |
| 5 | `category` | ./documents/category |
| 6 | `news` | ./documents/news |
| 7 | `menuItem` | ./documents/menuItem |
| 8 | `shopInfo` | ./documents/shopInfo |

---

## 📝 詳細情報

### アクティブなスキーマの詳細

#### 📝 ブログ記事 (`blogPost`)

📍 使用箇所: /blog, /blog/[slug] | ステータス: ✅ 使用中 | ブログ記事の管理

- **ファイル**: `studio/schemas/./documents/blogPost.ts`

---

#### ✍️ 著者 (`author`)

📍 使用箇所: /author/[slug], /blog/* | ステータス: ✅ 使用中 | ブログ記事の著者情報

- **ファイル**: `studio/schemas/./documents/author.ts`

---

#### 📅 イベント (`event`)

📍 使用箇所: /events/[slug], /calendar | ステータス: ✅ 使用中 | AI検索対応 | イベントの管理

- **ファイル**: `studio/schemas/./documents/event.ts`

---

#### 📄 ページ (`page`)

📍 使用箇所: /[slug] (動的ページ) | ステータス: ✅ 使用中 | ページビルダーを使用したカスタムページ

- **ファイル**: `studio/schemas/./documents/page.ts`

---

#### 🏠 トップページ (`homepage`)

📍 使用箇所: / (トップページ) | ステータス: ✅ 使用中 | トップページの設定（カテゴリーカード、ブログセクションなど）

- **ファイル**: `studio/schemas/./documents/homepage.ts`

---

#### ⚙️ サイト設定 (`siteSettings`)

📍 使用箇所: 全ページ（グローバル設定） | ステータス: ⚠️ 確認必要 | サイト全体の設定（シングルトン）

- **ファイル**: `studio/schemas/./documents/siteSettings.ts`

---

#### 📄 講座 (`course`)

📍 使用箇所: /school, /school/[courseId] | ステータス: ✅ 使用中 | AI検索対応 | 講座の管理

- **ファイル**: `studio/schemas/./documents/course.ts`

---

#### 📄 スクールページ設定 (`schoolPage`)

📍 使用箇所: /school | ステータス: ✅ 使用中 | スクールページの設定（FAQ、学習フローなど）

- **ファイル**: `studio/schemas/./documents/schoolPage.ts`

---

#### 📄 スクールページコンテンツ (`schoolPageContent`)

説明なし

- **ファイル**: `studio/schemas/./documents/schoolPageContent.ts`

---

#### 📄 インストラクター (`instructor`)

📍 使用箇所: /instructor, /instructor/[prefecture]/[slug] | ステータス: ✅ 使用中 | AI検索対応 | インストラクター情報の管理

- **ファイル**: `studio/schemas/./documents/instructor.ts`

---

#### 📄 インストラクターページ設定 (`instructorPage`)

📍 使用箇所: /instructor | ステータス: ✅ 使用中 | インストラクターページの設定（サービスセクション含む）

- **ファイル**: `studio/schemas/./documents/instructorPage.ts`

---

#### 📄 プロフィールページ設定 (`profilePage`)

📍 使用箇所: /profile | ステータス: ✅ 使用中 | API（DB同期） | 代表者のプロフィールページ

- **ファイル**: `studio/schemas/./documents/profilePage.ts`

---

#### ℹ️ カフェキネシについて（Aboutページ） (`aboutPage`)

📍 使用箇所: /about | ステータス: ✅ 使用中 | チャットAPI | カフェキネシの紹介ページ

- **ファイル**: `studio/schemas/./documents/aboutPage.ts`

---

#### 👔 代表者 (`representative`)

📍 使用箇所: API（DB同期） | ステータス: ✅ 使用中 | 代表者情報の管理（データベース同期用）

- **ファイル**: `studio/schemas/./representative.ts`

---

#### ❓ FAQ質問カード (`faqCard`)

📍 使用箇所: / (トップページ) | ステータス: ✅ 使用中 | FAQカードの管理（チャットモーダル用）

- **ファイル**: `studio/schemas/./documents/faqCard.ts`

---

#### 💬 チャットモーダル設定 (`chatModal`)

📍 使用箇所: / (トップページ) | ステータス: ✅ 使用中 | チャットモーダルの設定

- **ファイル**: `studio/schemas/./documents/chatModal.ts`

---

#### 📄 チャット設定 (`chatConfiguration`)

絵文字またはアイコン文字

- **ファイル**: `studio/schemas/./chat/chatConfiguration.ts`

---

#### 📄 AIガードレール設定 (`aiGuardrails`)

説明なし

- **ファイル**: `studio/schemas/./ai/aiGuardrails.ts`

---

#### 📄 AIプロバイダー設定 (`aiProviderSettings`)

説明なし

- **ファイル**: `studio/schemas/./ai/aiProviderSettings.ts`

---

#### 📄 RAG設定 (`ragConfiguration`)

説明なし

- **ファイル**: `studio/schemas/./rag/ragConfiguration.ts`

---

#### 📄 SEO設定 (`seo`)

検索結果やソーシャルメディアで表示されるタイトル（60文字以内推奨）

- **ファイル**: `studio/schemas/./objects/seo.ts`

---

#### 📄 Schema.org設定 (`schemaOrg`)

説明なし

- **ファイル**: `studio/schemas/./objects/schemaOrg.ts`

---

#### 📄 ヒーローセクション (`hero`)

0-1の範囲で設定（0が透明、1が不透明）

- **ファイル**: `studio/schemas/./objects/hero.ts`

---

#### 📄 Call to Action (`cta`)

HEXコード（例: #FF0000）

- **ファイル**: `studio/schemas/./objects/cta.ts`

---

#### 📄 機能・特徴セクション (`feature`)

Font Awesomeのクラス名またはemoji

- **ファイル**: `studio/schemas/./objects/feature.ts`

---

#### 📄 お客様の声 (`testimonial`)

1-5の範囲で設定

- **ファイル**: `studio/schemas/./objects/testimonial.ts`

---

#### 📄 カテゴリーカード (`categoryCard`)

例: /about, /school, /instructor, https://example.com など

- **ファイル**: `studio/schemas/./objects/categoryCard.ts`

---

#### 📄 ソーシャルリンク (`socialLink`)

未入力の場合はプラットフォーム名を使用

- **ファイル**: `studio/schemas/./objects/socialLink.ts`

---

#### 📄 ナビゲーションメニュー (`navigationMenu`)

例: /#about-section, /school, /instructor など

- **ファイル**: `studio/schemas/./objects/navigationMenu.ts`

---

#### 📄 テーブル（表） (`table`)

表のタイトル・説明（オプション）

- **ファイル**: `studio/schemas/./objects/table.ts`

---

#### 📄 情報ボックス (`infoBox`)

ボックスのタイトル（オプション）

- **ファイル**: `studio/schemas/./objects/infoBox.ts`

---

#### 📄 比較表 (`comparisonTable`)

比較表のタイトル（オプション）

- **ファイル**: `studio/schemas/./objects/comparisonTable.ts`

---

#### 📄 内部リンク (`internalLink`)

サイト内の相対パス（例: /school/peach-touch）

- **ファイル**: `studio/schemas/./objects/internalLink.ts`

---

#### 📄 外部リンク（参考文献） (`externalReference`)

参考文献のタイトル

- **ファイル**: `studio/schemas/./objects/externalReference.ts`

---

#### 📄 画像 (`customImage`)

アクセシビリティのため必須です。画像の内容を簡潔に説明してください。

- **ファイル**: `studio/schemas/./components/customImage.ts`

---

#### 📄 リッチテキスト (`portableText`)

説明なし

- **ファイル**: `studio/schemas/./components/portableText.ts`

---

#### 📄 動画埋め込み (`videoEmbed`)

YouTube、Vimeo、またはその他の動画プラットフォームのURL

- **ファイル**: `studio/schemas/./components/videoEmbed.ts`

---

#### 📄 SNS埋め込み (`socialEmbed`)

投稿またはプロフィールのURL

- **ファイル**: `studio/schemas/./components/socialEmbed.ts`

---

#### 📄 コードブロック (`codeBlock`)

コードブロックの説明（オプション）

- **ファイル**: `studio/schemas/./components/codeBlock.ts`

---


## 🔧 メンテナンス

### スキーマを非推奨化する場合

1. `studio/schemas/index.ts` でimport文とexport文をコメントアウト
2. このスクリプトを実行して分析レポートを更新: `npm run analyze:schemas`
3. `SCHEMA_MAP.md` を手動で更新（必要に応じて）

### スキーマを復元する場合

1. `studio/schemas/index.ts` でコメントアウトを解除
2. このスクリプトを実行: `npm run analyze:schemas`
3. `SCHEMA_MAP.md` を手動で更新

---

**このレポートは自動生成されました。手動で編集しないでください。**
