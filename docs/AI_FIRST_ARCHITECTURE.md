# AI-First データアーキテクチャ設計書

## パラダイムシフト

### 現状の問題
- データ構造がWeb表示に最適化されている
- AIが情報を探しづらい
- 同じ情報が複数箇所に分散
- AIが文脈を理解しづらい

### 新しいアプローチ
**「AIが理解しやすいデータ構造」を最優先に設計**

## AI-First データ設計原則

### 1. 統一エンティティ原則
```typescript
// 従来：役割ごとに分散
- profilePage（代表者ページ）
- aboutPage（代表者の名前だけ）
- instructor（インストラクター）
- author（著者）

// AI-First：人物として統一
- person {
    role: "representative" | "instructor" | "author"
    name: string
    profile: {...}
    activities: [...]
    searchKeywords: ["代表", "創業者", "星ユカリ"]
  }
```

### 2. 検索最適化原則
```typescript
// すべてのエンティティに検索用メタデータ
{
  searchKeywords: ["代表", "創業者", "founder", "星", "ユカリ"],
  synonyms: ["社長", "CEO", "設立者"],
  context: "会社について", // 質問の文脈
  priority: 10 // 検索優先度
}
```

### 3. 関連性明示原則
```typescript
// エンティティ間の関係を明確に
{
  _type: "person",
  name: "星ユカリ",
  relatedTo: [
    { type: "company", id: "cafekinesi", relation: "founder" },
    { type: "course", id: "peach-touch", relation: "instructor" },
    { type: "location", id: "nagano", relation: "resident" }
  ]
}
```

### 4. コンテキスト保持原則
```typescript
// AIが文脈を理解できる情報
{
  _type: "course",
  name: "ピーチタッチ",
  context: {
    whatIs: "キネシオロジーとアロマを使った健康法",
    whoFor: "初心者でも2時間でインストラクターになれる",
    whereAvailable: "世界中",
    whenCreated: "2011年",
    whyCreated: "誰もがセラピストになれる世界を目指して",
    howWorks: "手とアロマだけで3分でストレス解消"
  }
}
```

## 実装提案

### Phase 1: エンティティ統合（優先度：高）
1. **Person エンティティ**
   - 代表者、インストラクター、著者を統合
   - roleフィールドで役割を区別
   - AI検索用キーワードを埋め込み

2. **Service エンティティ**
   - コース、講座、セッションを統合
   - 提供者（Person）との関連付け
   - 料金、スケジュール、場所を構造化

3. **Content エンティティ**
   - ブログ、ニュース、FAQを統合
   - カテゴリとタグで分類
   - 関連Person、Serviceとリンク

### Phase 2: AI最適化レイヤー（優先度：中）
1. **AI Knowledge Graph**
   ```typescript
   {
     entities: [...],
     relationships: [...],
     contexts: [...],
     synonyms: {...}
   }
   ```

2. **Smart Search Index**
   - 全エンティティの検索インデックス
   - 同義語辞書
   - 文脈別重み付け

### Phase 3: 自動学習システム（将来）
1. **質問パターン学習**
   - よくある質問を記録
   - 回答精度の向上

2. **データ品質監視**
   - 欠損情報の自動検出
   - 更新推奨の提示

## 具体的な改善例

### Before（現在）
```typescript
// profilePageとaboutPageに分散
profilePage: { name: "星ユカリ", location: "長野県" }
aboutPage: { sections: [{ description: "創業者 星ユカリ" }] }

// AIが「代表者は？」と聞かれても見つけづらい
```

### After（AI-First）
```typescript
person: {
  _id: "yukari-hoshi",
  name: "星ユカリ",
  roles: ["代表者", "創業者", "インストラクター"],
  searchKeywords: ["代表", "創業者", "星", "ユカリ", "founder", "CEO"],
  aiSummary: "Cafe Kinesi創業者。キネシオロジーとアロマの専門家。",
  structuredInfo: {
    founded: "2010年",
    location: "長野県茅野市",
    mission: "誰もがセラピストになれる世界を創る"
  }
}

// AIが即座に適切な情報を見つけられる
```

## 実装ロードマップ

### Step 1: スキーマ設計（1週間）
- [ ] Person統合スキーマ作成
- [ ] Service統合スキーマ作成
- [ ] AI検索メタデータ追加

### Step 2: データ移行（1週間）
- [ ] 既存データの統合
- [ ] 検索キーワード追加
- [ ] 関連付けの設定

### Step 3: AI最適化（2週間）
- [ ] RAGエンジンの改良
- [ ] 検索アルゴリズムの調整
- [ ] 回答品質の向上

## メリット

1. **AIの回答精度が劇的に向上**
   - 適切な情報を即座に発見
   - 文脈を理解した回答

2. **メンテナンスが簡単**
   - データの重複なし
   - 一箇所更新で全体反映

3. **将来の拡張性**
   - 新しいAI機能の追加が容易
   - 多言語対応も簡単

4. **ユーザー体験の向上**
   - より自然な会話
   - より正確な情報提供

## まとめ
**「Webサイトのための構造」から「AIのための構造」へ**

これがAI時代の正しいアーキテクチャです。