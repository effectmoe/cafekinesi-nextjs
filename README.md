# Cafe Kinesi - RAG搭載AIチャットシステム

Next.js 14 + Sanity CMS + Vercel Postgres + DeepSeek AIで構築された、最新のフルスタックWebアプリケーション

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fcafekinesi-nextjs)

## ✨ 特徴

- 🤖 **RAG搭載AIチャット** - ベクトル検索 + ハイブリッドサーチで高精度な自動応答
- 📚 **Sanity CMS統合** - 管理画面でコンテンツを簡単更新
- 🔍 **pgvector検索** - PostgreSQL + pgvector による高速ベクトル検索
- ⚡ **Next.js 14 App Router** - 最新のReact Server Componentsを活用
- 🎨 **Tailwind CSS** - モダンで美しいUIデザイン
- 🚀 **Vercel自動デプロイ** - GitHubプッシュで即座にデプロイ

## 📊 デモ

**ライブデモ**: [https://cafekinesi.com](https://cafekinesi.com)

### スクリーンショット

```
[ここにスクリーンショットを追加]
```

## 🚀 クイックスタート

### 前提条件

- Node.js 18以上
- pnpm（または npm/yarn）
- Vercelアカウント
- Sanityアカウント
- DeepSeek APIキー

### 1分でセットアップ（自動）

```bash
# リポジトリクローン
git clone https://github.com/your-username/cafekinesi-nextjs.git
cd cafekinesi-nextjs

# 自動セットアップスクリプト実行
chmod +x setup.sh
./setup.sh
```

スクリプトが以下を自動実行：
- 依存関係インストール
- 環境変数設定
- Sanity Studio初期化
- Postgres + pgvector設定
- エンベディング生成
- 開発サーバー起動

### 手動セットアップ

詳細は [フルスタック構築マニュアル](./docs/2025-10-09_フルスタック構築マニュアル_Phase0-5統合版.md) を参照

```bash
# 1. 依存関係インストール
pnpm install

# 2. 環境変数設定
cp .env.example .env.local
# .env.local を編集してAPIキーを設定

# 3. Sanity Studio初期化
cd studio
pnpm install
npx sanity init

# 4. Postgres設定
vercel postgres create
vercel postgres exec -- "CREATE EXTENSION IF NOT EXISTS vector"

# 5. エンベディング生成
pnpm run populate-embeddings

# 6. 開発サーバー起動
pnpm dev
```

### 環境変数

`.env.local` に以下を設定：

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-01-01"
SANITY_API_TOKEN="your-token"

# Postgres
POSTGRES_URL="your-vercel-postgres-url"

# AI Provider
AI_PROVIDER="deepseek"
DEEPSEEK_API_KEY="your-deepseek-key"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## 📁 プロジェクト構造

```
cafekinesi-nextjs/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── chat/            # チャット関連API
│   │   ├── health/          # ヘルスチェック
│   │   └── ai-knowledge/    # AI Knowledge API
│   ├── school/              # 講座ページ
│   ├── blog/                # ブログページ
│   └── page.tsx             # ホームページ
├── components/              # Reactコンポーネント
│   └── chat/               # チャット関連コンポーネント
├── hooks/                  # カスタムフック
│   └── useChat.ts          # チャット機能フック
├── lib/                    # ライブラリ・ユーティリティ
│   ├── ai/                # AIプロバイダー
│   ├── rag/               # RAGエンジン
│   ├── chat/              # チャット管理
│   └── embeddings/        # エンベディング生成
├── studio/                # Sanity Studio
│   └── schemas/          # CMSスキーマ
├── scripts/              # ユーティリティスクリプト
│   └── populate-embeddings.ts
└── docs/                 # 詳細マニュアル
```

## 🛠️ 技術スタック

| カテゴリー | 技術 |
|-----------|------|
| **フロントエンド** | Next.js 14, React 18, TypeScript |
| **スタイリング** | Tailwind CSS, lucide-react |
| **CMS** | Sanity Studio |
| **データベース** | Vercel Postgres, pgvector |
| **AI** | DeepSeek API, Xenova/Transformers |
| **デプロイ** | Vercel |
| **キャッシュ** | Upstash Redis (任意) |

## 📖 ドキュメント

詳細なマニュアルは `docs/` フォルダ内：

- [マスターガイド](./docs/2025-10-08_Cafe_Kinesi_システム構築マスターガイド.md) - 全体像とナビゲーション
- [フルスタック構築マニュアル](./docs/2025-10-09_フルスタック構築マニュアル_Phase0-5統合版.md) - 統合版手順書
- [Phase 0: プロジェクト基盤](./docs/2025-10-09_Phase0_プロジェクト基盤構築マニュアル.md)
- [Phase 3: AIプロバイダー設定](./docs/2025-10-09_Phase3_AIプロバイダー設定マニュアル.md)
- [Phase 4: フロントエンド実装](./docs/2025-10-09_Phase4_フロントエンド実装マニュアル.md)
- [Phase 5: AI検索最適化](./docs/2025-10-09_Phase5_AI検索最適化マニュアル.md)
- [RAGエンジン完全構築マニュアル](./docs/2025-10-08_RAGエンジン完全構築マニュアル.md)

## 🚀 デプロイ

### Vercelへのデプロイ

```bash
# Vercel CLIでデプロイ
vercel

# 環境変数設定
vercel env add AI_PROVIDER
vercel env add DEEPSEEK_API_KEY
vercel env add SANITY_API_TOKEN

# 本番デプロイ
vercel --prod
```

または、GitHubと連携して自動デプロイ：

1. Vercel Dashboard → Import Git Repository
2. リポジトリ選択
3. 環境変数を設定
4. Deploy

以降、`main` ブランチへのプッシュで自動デプロイ。

## 🎨 カスタマイズ

### カラーテーマ変更

```typescript
// tailwind.config.ts
colors: {
  primary: {
    amber: '#f59e0b',  // ← 好きな色に変更
  }
}
```

### クイック質問ボタン

```typescript
// components/chat/QuickQuestionButtons.tsx
const quickQuestions = [
  { icon: Clock, text: '営業時間', question: '営業時間を教えてください' },
  // ← 追加・変更
];
```

### AIプロンプト

```typescript
// lib/ai/providers/deepseek.ts
systemPrompt = `あなたは[カスタム設定]のAIアシスタントです。`;
```

## 📊 パフォーマンス

| 指標 | 目標値 |
|------|--------|
| 検索精度 | 95%+ |
| 応答時間 | <1秒 |
| Lighthouse Score | 90+ |
| キャッシュヒット率 | 30%+ |

## 🐛 トラブルシューティング

### よくある問題

**Q: エンベディング生成エラー**
```bash
A: Node.js 18以上を使用してください
   node -v  # v18.0.0+
```

**Q: Postgres接続エラー**
```bash
A: 環境変数を確認してください
   echo $POSTGRES_URL
```

**Q: AI応答がない**
```bash
A: DeepSeek APIキーを確認してください
   echo $DEEPSEEK_API_KEY
```

詳細は [フルスタック構築マニュアル - トラブルシューティング](./docs/2025-10-09_フルスタック構築マニュアル_Phase0-5統合版.md#トラブルシューティング) を参照。

## 🤝 コントリビューション

プルリクエスト歓迎！

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 ライセンス

MIT License

## 👤 作成者

**tonychustudio & Claude**

- Website: [https://cafekinesi.com](https://cafekinesi.com)
- GitHub: [@your-username](https://github.com/your-username)

## 🙏 謝辞

- [Next.js](https://nextjs.org/)
- [Sanity](https://www.sanity.io/)
- [Vercel](https://vercel.com/)
- [DeepSeek](https://www.deepseek.com/)
- [Xenova/Transformers](https://github.com/xenova/transformers.js)

---

**⭐ このプロジェクトが役に立ったらスターをお願いします！**

