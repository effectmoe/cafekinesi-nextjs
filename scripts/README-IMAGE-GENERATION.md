# クラスターページ画像生成ガイド

このドキュメントでは、カフェキネシⅠクラスターページ用のAI画像生成スクリプトの使用方法を説明します。

## 📋 概要

`generate-cluster-images.ts`スクリプトは、OpenAI DALL-E 3を使用してクラスターページ用の高品質な画像を自動生成します。

### 生成される画像（全5枚）

1. **ヒーロー画像** - セラピーセッションのメイン画像
2. **筋肉反射テスト** - 技術のクローズアップ画像
3. **講座風景** - 少人数制クラスの様子
4. **修了証書** - 完了証のイメージ
5. **エネルギーワーク** - チャクラ・エネルギーフローの抽象画像

## 🚀 使い方

### ステップ1: 環境変数を設定

`.env.local`ファイルに以下の環境変数が設定されていることを確認してください：

```bash
OPENAI_API_KEY=sk-xxx...  # OpenAI APIキー
SANITY_API_TOKEN=skxxx... # Sanity APIトークン（書き込み権限）
```

### ステップ2: 画像を生成

```bash
npx tsx scripts/generate-cluster-images.ts
```

**処理内容:**
- ✅ DALL-E 3で5枚の画像を生成（各画像間で5秒の待機時間）
- ✅ 生成した画像を`/public/generated-images/`にダウンロード
- ✅ 自動的にSanityにアップロード
- ✅ 結果を`/public/generated-images/results.json`に保存

**実行時間:** 約3-5分（5枚の画像 + 待機時間）

### ステップ3: クラスターページに画像を追加

```bash
npx tsx scripts/update-cluster-images.ts
```

**処理内容:**
- ✅ `results.json`から画像情報を読み込む
- ✅ ヒーロー画像をクラスターページの`image`フィールドに設定
- ✅ 残りの画像を`gallery`フィールドに追加
- ✅ Sanityに反映

### ステップ4: 確認

1. **Sanity Studio で確認:**
   ```
   https://cafekinesi.sanity.studio/structure/course;kinesi1-cluster
   ```

2. **本番環境で確認:**
   ```
   https://cafekinesi-nextjs.vercel.app/school/kinesi1-cluster
   ```

## 📁 ファイル構成

```
scripts/
├── generate-cluster-images.ts  # 画像生成メインスクリプト
├── update-cluster-images.ts    # 画像をクラスターページに追加
└── README-IMAGE-GENERATION.md  # このファイル

public/
└── generated-images/
    ├── hero-image.png          # 生成された画像ファイル
    ├── muscle-testing.png
    ├── classroom-scene.png
    ├── certification.png
    ├── energy-work.png
    └── results.json            # 生成結果メタデータ
```

## 🎨 カスタマイズ

### 画像プロンプトを変更する

`scripts/generate-cluster-images.ts`の`imagePrompts`配列を編集してください：

```typescript
const imagePrompts = [
  {
    name: 'hero-image',
    prompt: 'あなたのカスタムプロンプトをここに...',
    description: '画像の説明'
  },
  // ... 追加の画像
]
```

### 画像サイズを変更する

デフォルトは`1792x1024`（ワイド形式）です：

```typescript
const response = await openai.images.generate({
  // ...
  size: '1792x1024', // '1024x1024', '1024x1792' も利用可能
  // ...
})
```

## 💰 コスト

**DALL-E 3 HDモデル:**
- 1792x1024サイズ: $0.12/画像
- **合計（5枚）: 約$0.60**

## ⚠️ 注意事項

1. **APIレート制限**: 各画像生成の間に5秒の待機時間を設けています
2. **エラーハンドリング**: 1枚の画像生成に失敗しても、他の画像は引き続き処理されます
3. **Sanityアップロード**: アップロードに失敗した場合でも、ローカルにファイルは保存されます

## 🔧 トラブルシューティング

### OpenAI APIキーエラー

```bash
Error: Invalid API key
```

→ `.env.local`の`OPENAI_API_KEY`を確認してください

### Sanityアップロードエラー

```bash
Error: Insufficient permissions
```

→ `.env.local`の`SANITY_API_TOKEN`に書き込み権限があることを確認してください

### 画像生成が遅い

- 正常です。DALL-E 3は1枚あたり30-60秒かかります
- 5枚生成する場合、3-5分程度お待ちください

## 📚 参考リンク

- [OpenAI DALL-E 3 Documentation](https://platform.openai.com/docs/guides/images)
- [Sanity Image Asset API](https://www.sanity.io/docs/assets)

---

**作成日:** 2025-10-15
**最終更新:** 2025-10-15
