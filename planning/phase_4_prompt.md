@planning/claude_execution_plan.md を読み込んでください。
Phase 3 でのデプロイ確認と並行して、**Phase 4: コードの健全性回復** を開始します。
現在のビルド成功は「型チェックエラーを無視している」状態（またはビルドだけで通っている状態）の可能性がありますが、長期的なメンテナンスのためにこれらを修正します。

**具体的な指示:**

1.  **型エラーの現状把握**:
    - `npx tsc --noEmit` を実行し、出力されるエラーを確認してください。
    - 特に **Next.js 16の Breaking Change (`params` が Promise になった件)** に関連するエラーを特定してください。
      - Error: `Type '...' is not assignable to type 'Promise<...>'` のようなものが頻出しているはずです。

2.  **`params` の修正**:
    - エラーが出ている Page/Layout コンポーネントの `params` を `await` する形、または適切な型定義 (`Promise<...>` を受け取る形) に修正してください。
    - 修正後、再度 `npx tsc --noEmit` でエラーが減ったことを確認してください。

3.  **Lint OOM の修正**:
    - `package.json` の `lint` コマンドを以下のように修正して、OOMが解消するか試してください。
    - 修正前: `"lint": "eslint"`
    - 修正後: `"lint": "NODE_OPTIONS='--max-old-space-size=4096' eslint"` (または環境に合わせて調整)
    - その後 `npm run lint` が完走するか確認してください。

上記修正を行い、`develop` ブランチにコミット・プッシュしてください。
