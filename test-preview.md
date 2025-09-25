# Sanity Studioプレビュー機能のテスト手順

## 起動手順

### 1. Next.jsアプリケーションの起動
```bash
cd /Users/tonychustudio/cafekinesi-nextjs
npm run dev
```
→ http://localhost:3000 で起動

### 2. Sanity Studioの起動
```bash
cd /Users/tonychustudio/cafekinesi-nextjs/studio
npm run dev
```
→ http://localhost:3333 で起動

## テスト手順

1. **Sanity Studioにアクセス**
   - http://localhost:3333 にアクセス
   - ログイン（必要に応じて）

2. **コンテンツを開く**
   - 「Content」タブを開く
   - 任意のブログ記事またはページを選択

3. **プレビュー機能の確認**
   - 右上の「Presentation」ボタンをクリック
   - プレビュー画面が表示されることを確認

## 実装された機能

1. **Visual Editing パッケージ** - ✅ インストール済み
2. **環境変数設定** - ✅ 設定済み
3. **CORS設定** - ✅ 設定済み
4. **Stega設定** - ✅ 有効化済み
5. **Draft Mode API** - ✅ 実装済み

## トラブルシューティング

### プレビューが表示されない場合

1. **Chrome拡張機能を無効化**
   - シークレットモードで試す
   - または拡張機能を一時的に無効化

2. **開発サーバーの再起動**
   ```bash
   # Next.jsサーバーを再起動
   npm run dev

   # Sanity Studioを再起動
   cd studio && npm run dev
   ```

3. **ブラウザのキャッシュクリア**
   - Cmd + Shift + R でハードリロード

## 環境情報

- **Project ID**: e4aqw590
- **Dataset**: production
- **Next.js**: http://localhost:3000
- **Sanity Studio**: http://localhost:3333
- **Vercel**: https://cafekinesi-nextjs.vercel.app