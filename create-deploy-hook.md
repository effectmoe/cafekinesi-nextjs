# Vercel Deploy Hook 作成手順

## 新しいDeploy Hookを作成する方法

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/effectmoes-projects/cafekinesi-nextjs/settings/git

2. **Deploy Hooksセクションを探す**
   - Settings → Git → Deploy Hooks

3. **新しいHookを作成**
   - Hook Name: `Sanity Webhook`
   - Branch: `master`
   - Create Hookボタンをクリック

4. **生成されたURLをコピー**
   - 形式: `https://api.vercel.com/v1/integrations/deploy/prj_mRxfRYnAxSW4mFGtjtwfE0udEiKE/[新しいID]`

## テスト方法
```bash
curl -X POST [生成されたURL]
```

## 現在動作する方法
```bash
# GitHubプッシュで自動デプロイ
git push origin master

# または手動デプロイ
npx vercel --prod
```