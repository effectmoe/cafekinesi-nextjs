# 🚀 完全自動同期設定ガイド

## 現在の状況
✅ **代表者情報がAIで回答可能になりました！**
- 星 ユカリさんの情報がデータベースに同期済み
- 6名のインストラクター情報も同期済み

## 完全自動化の仕組み
```
Sanityで編集 → Webhook発火 → データベース自動同期 → AIが即座に回答
```

## Webhook設定手順（1回だけ）

### 1. Sanity管理画面にログイン
https://www.sanity.io/manage/project/e4aqw590

### 2. Webhooks設定
1. **API** タブを開く
2. **Webhooks** セクション
3. **Create Webhook** をクリック

### 3. Webhook情報を入力

```yaml
Name: Database Auto Sync
URL: https://cafekinesi-nextjs.vercel.app/api/sync-db
Dataset: production
HTTP Method: POST

Trigger on:
  ✓ Create
  ✓ Update
  ✓ Delete

Filter (GROQ):
_type in ["instructor", "profilePage", "course", "blogPost", "page", "aboutPage"]

Secret: [ランダム文字列を生成]
```

### 4. シークレット生成
```bash
openssl rand -hex 32
```
例：`a3f7b9c2d8e1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9`

### 5. 環境変数設定

#### Vercel Dashboard
https://vercel.com/effectmoes-projects/cafekinesi-nextjs/settings/environment-variables

```
SANITY_WEBHOOK_SECRET=[生成したSecret]
```

#### ローカル（.env.local）
```
SANITY_WEBHOOK_SECRET=[生成したSecret]
```

## 対応済みコンテンツタイプ

| タイプ | 内容 | 状態 |
|-------|------|------|
| profilePage | 代表者情報（星ユカリ） | ✅ 対応済み |
| instructor | インストラクター情報 | ✅ 対応済み |
| course | コース情報 | ✅ 対応済み |
| blogPost | ブログ記事 | ✅ 対応済み |
| page | 各種ページ | ✅ 対応済み |

## 今すぐできること

### 1. 手動同期（Webhook設定前）
```bash
# 本番環境の同期（1回実行すれば代表者情報がAIで回答可能に）
curl -X GET "https://cafekinesi-nextjs.vercel.app/api/sync-db"
```

### 2. AIチャットで確認
「代表者はどんな人ですか？」と質問
→ 星ユカリさんの詳細情報が返ってきます

## Webhook設定後の流れ（完全自動）

1. **Sanity Studioで編集**
   - https://cafekinesi.sanity.studio/
   - プロフィール、インストラクター、コースなどを編集

2. **自動同期**（設定不要）
   - 保存ボタンを押した瞬間に自動同期

3. **AIが即座に対応**
   - 編集内容が即座にAIチャットに反映

## トラブルシューティング

### AIが最新情報を返さない場合
1. 手動同期を実行
   ```bash
   curl -X GET "https://cafekinesi-nextjs.vercel.app/api/sync-db"
   ```

2. Webhook設定を確認
   - Sanity管理画面 → Webhooks → View Logs

3. 環境変数を確認
   - `SANITY_WEBHOOK_SECRET`が正しく設定されているか

### 新しいコンテンツタイプを追加する場合
1. Sanityスキーマに追加
2. `/app/api/sync-db/route.ts`に処理を追加
3. WebhookのFilterに追加

## まとめ
- **現在**: 手動同期で代表者情報がAIで回答可能
- **Webhook設定後**: 完全自動化、編集即反映
- **必要な作業**: Webhook設定（1回だけ）