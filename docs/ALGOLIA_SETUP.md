# Algolia検索機能 セットアップガイド

このガイドでは、Algoliaを使用したサイト内検索機能のセットアップ方法を説明します。

## 1. Algoliaアカウントの作成

1. [Algolia公式サイト](https://www.algolia.com/)にアクセス
2. 「Start free」をクリックしてアカウント作成
3. 必要情報を入力（メールアドレス、パスワード）
4. 無料プラン（Free plan）を選択

## 2. アプリケーション（Application）の作成

1. Algoliaダッシュボードにログイン
2. 左サイドバーから「Applications」を選択
3. 新しいアプリケーションを作成（または既存のものを使用）
4. アプリケーション名: `cafekinesi-search`（任意）

## 3. インデックス（Index）の作成

1. 左サイドバーから「Search」→「Index」を選択
2. 「Create Index」をクリック
3. インデックス名を入力:
   - `cafekinesi_content`

## 4. API キーの取得

1. 左サイドバーから「Settings」→「API Keys」を選択
2. 以下の情報をコピー:

### 必要なキー:

#### Application ID
```
例: ABC123DEF4
```

#### Search-Only API Key（公開可能）
```
例: 1234567890abcdef1234567890abcdef
```

#### Admin API Key（秘密鍵、公開厳禁）
```
例: abcdef1234567890abcdef1234567890
```

## 5. 環境変数の設定

### ローカル開発環境（.env.local）

`.env.local` ファイルに以下を追加:

```bash
# Algolia設定
NEXT_PUBLIC_ALGOLIA_APP_ID=your_application_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_only_api_key
ALGOLIA_ADMIN_API_KEY=your_admin_api_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=cafekinesi_content
```

**重要:** `.env.local` はGitにコミットしないでください（.gitignoreに追加済み）

### 本番環境（Vercel）

1. Vercelダッシュボードにアクセス
2. プロジェクト「cafekinesi-nextjs」を選択
3. 「Settings」→「Environment Variables」を開く
4. 以下の環境変数を追加:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | your_application_id | Production, Preview, Development |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` | your_search_only_api_key | Production, Preview, Development |
| `ALGOLIA_ADMIN_API_KEY` | your_admin_api_key | Production, Preview, Development |
| `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` | cafekinesi_content | Production, Preview, Development |

5. 「Save」をクリック
6. プロジェクトを再デプロイ

## 6. データの同期

初回セットアップ後、以下のコマンドでSanityからAlgoliaにデータを同期します:

```bash
npm run algolia:sync
```

このスクリプトは以下のデータをAlgoliaにインデックス化します:
- ブログ記事
- コース情報
- インストラクター情報
- ページコンテンツ

## 7. 自動同期の設定（オプション）

Sanityのコンテンツが更新された際に自動的にAlgoliaを更新するには、Sanity Webhookを設定します。

### Sanity Webhook設定:

1. Sanity管理画面にログイン: https://www.sanity.io/manage
2. プロジェクト「cafekinesi」を選択
3. 「API」→「Webhooks」を開く
4. 「Add webhook」をクリック
5. 以下の情報を入力:
   - **Name**: Algolia Sync
   - **URL**: `https://cafekinesi-nextjs.vercel.app/api/webhooks/algolia-sync`
   - **Dataset**: production
   - **Trigger on**: Create, Update, Delete
   - **Filter**: すべてのドキュメントタイプ
   - **Secret**: ランダムな文字列を生成（後で使用）
6. 「Save」をクリック

### Webhook Secret を環境変数に追加:

```bash
# .env.local
SANITY_WEBHOOK_SECRET=your_webhook_secret
```

Vercelにも同じ環境変数を追加してください。

## 8. 検索機能のテスト

1. ローカル開発サーバーを起動:
   ```bash
   npm run dev
   ```

2. ブラウザで http://localhost:3000 を開く

3. ヘッダーの検索アイコン（🔍）をクリック

4. 検索モーダルが開くことを確認

5. 何かキーワードを入力して検索結果が表示されることを確認

## トラブルシューティング

### 検索結果が表示されない

- Algoliaダッシュボードでインデックスにデータがあるか確認
- `npm run algolia:sync` を実行してデータを再同期
- ブラウザのコンソールでエラーがないか確認

### "Application ID or API key is invalid"

- 環境変数が正しく設定されているか確認
- `.env.local` の内容を確認
- Vercelの環境変数を確認

### データ同期が失敗する

- `ALGOLIA_ADMIN_API_KEY` が正しく設定されているか確認
- Sanityの接続情報が正しいか確認
- ネットワーク接続を確認

## 無料プランの制限

Algolia無料プランの制限:
- **検索リクエスト**: 10,000/月
- **レコード数**: 10,000
- **ファイルサイズ**: 1GB

制限を超える場合は、有料プランへのアップグレードを検討してください。

## サポート

問題が解決しない場合は、以下を確認してください:
- [Algolia公式ドキュメント](https://www.algolia.com/doc/)
- [Next.js + Algolia統合ガイド](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)

---

**作成日**: 2025-10-16
**対応者**: Claude & tonychustudio
