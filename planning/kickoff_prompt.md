以下は、Claude Codeに実行計画を開始させるためのプロンプト案です。

---

@planning/claude_execution_plan.md を読み込んでください。
現在、このプロジェクトは Next.js 16 へのアップグレード作業中です。
作成された実行計画書 (**Phase 1: Stabilization**) に従って作業を開始してください。

**具体的な指示:**

1.  **Developブランチの作成と切り替え**:
    - 現在の作業状態（`tsconfig.json`の変更含む）を持って、`develop` ブランチを作成・切り替えしてください。
    - すぐに GitHub (`origin`) に `develop` をプッシュしてください。

2.  **`tsconfig.json` のコミット**:
    - `develop` ブランチ上で、現在 `tsconfig.json` にある未保存の変更を確認してください。
    - 問題なければ、コミットメッセージ `chore: update tsconfig.json for Next.js 16` でコミットしてください。

3.  **依存関係の確認**:
    - 現在の依存パッケージが React 19 と互換性があるか確認してください (`npm outdated` や `npm list react` などを活用)。

手順が完了したら報告してください。次のフェーズに進みます。
