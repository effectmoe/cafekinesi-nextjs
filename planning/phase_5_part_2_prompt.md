@planning/claude_execution_plan.md を読み込んでください。
Phase 5 (Batch 1-3) お疲れ様でした。エラー数が順調に減っています（残り97件）。
残りのエラーの多くが `components/ui` (未使用コンポーネント) や `scripts/` にあるとのことですので、アプローチを変えて「整理・削除」を行います。

**Phase 5 Part 2 具体的な指示:**

1.  **未使用コンポーネントの削除 (Cleanup)**:
    - 以下のコンポーネントがプロジェクト内で **全く使用されていない** ことを確認し、ファイルを削除してください。
      - `components/ui/chart.tsx` (または関連ディレクトリ)
      - `components/ui/calendar.tsx`
      - `components/ui/resizable.tsx`
      - その他、エラーを出しているが `grep` 等で検索して使用箇所がないUIコンポーネント。
    - **注意**: 使用されている場合は削除せず、必要なパッケージ（`recharts`や`react-resizable-panels`等）をインストールしてエラーを解消してください。

2.  **Scripts / Studio のエラー対応**:
    - `scripts/` ディレクトリ配下のファイルは、`tsconfig.json` の `include` に含まれていますか？
    - もし開発用スクリプトでビルドに関係ないなら、`tsconfig.json` の `exclude` に追加するか、個別に `// @ts-nocheck` を付与してエラーを抑制することも検討してください。
    - `studio/` 配下のエラーも、CMSの動作に支障がない軽微な型エラーであれば、同様のアプローチで抑制してください。

これで再度 `npx tsc --noEmit` を実行し、エラー数がさらに減ったか確認・報告してください。
目標は **50件以下** です。
