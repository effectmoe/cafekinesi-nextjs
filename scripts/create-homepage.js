// Sanity Studioで手動でHomepageを作成する手順

console.log(`
=====================================================
📝 Sanity StudioでHomepageを作成する手順
=====================================================

1. Sanity Studio (https://cafekinesi.sanity.studio/) を開く

2. 左側のメニューから「Homepage」をクリック
   （もし表示されていない場合は、メニューアイテムを探してください）

3. 「+ Create new」ボタンをクリック

4. 以下の内容を入力:

   Title: Cafe Kinesi

   Sections:
   - Hero Sectionを追加
     * Heading: "心と体を癒す空間へようこそ"
     * Subheading: "アロマテラピーとキネシオロジーが融合した新しい体験"
     * CTA Text: "詳しく見る"
     * CTA Link: "/about"

   - Features Sectionを追加
     * Title: "私たちの特徴"
     * Features:
       1. Title: "アロマテラピー"
          Description: "厳選された精油を使用した本格的なアロマセラピー"
       2. Title: "キネシオロジー"
          Description: "身体の声を聴く、筋肉反射テスト"
       3. Title: "オーガニックカフェ"
          Description: "体に優しい有機食材を使用したメニュー"

   SEO:
   - Title: "Cafe Kinesi - 心と体を癒すアロマテラピーカフェ"
   - Description: "アロマテラピーとキネシオロジーが融合した癒しの空間。オーガニック食材を使用したカフェメニューもご用意。"
   - Keywords: "アロマテラピー, キネシオロジー, オーガニックカフェ, 癒し, リラクゼーション"

5. 右上の「Publish」ボタンをクリックして公開

6. ブラウザでサイトをリロード:
   - ローカル: http://localhost:3002
   - 本番: https://cafekinesi-nextjs-gbhkmm5yu-effectmoes-projects.vercel.app

=====================================================
`);