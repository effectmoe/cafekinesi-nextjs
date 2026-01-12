---
prompt: |
  あなたは熟練したプログラミングエージェントです。
  以下の「実行計画書」に従って、Cafe Kinesiのフロントページに「講座説明ブロック」をSanityから動的に取得して表示させるように修正を行ってください。
  
  【タスク概要】
  現在、フロントページ(`app/page.tsx`)に講座詳細情報が表示されていません。
  Sanityに格納されている`course`（講座）データを取得し、既存の`CourseCard`コンポーネントを使用して表示させてください。
  
  【手順】
  1. `lib/queries.ts`に新しいクエリ`HOMEPAGE_COURSES_QUERY`を追加します。これは主要講座(`courseType == "main"`)とその子講座(`childCourses`)を階層的に取得するものです。
  2. `app/page.tsx`で上記クエリを使用してデータを取得し、`CourseCard`コンポーネントをループさせて表示します。
  
  作業完了後は、変更内容を報告してください。
---

# 講座説明ブロック Sanity連携・表示 実行計画書

## 現状分析
1.  **問題**: フロントページに講座の詳細説明（説明文、特徴、CTAなど）が表示されていない。
2.  **要件**: ユーザー提供画像に基づき、Sanityの`course`スキーマのデータ（講座説明、特徴など）を表示する必要がある。
3.  **リソース**:
    -   `components/school/CourseCard.tsx`: 必要なUI（画像、タイトル、説明、特徴リスト、CTAボックス、子講座表示）を実装済みのコンポーネント。
    -   `studio/schemas/documents/course.ts`: データ構造。`courseType` ('main' | 'auxiliary') と `parentCourse` で階層構造を持つ。

## 解決策
Sanityから階層構造（親講座＋子講座）を維持した状態でデータを取得し、`CourseCard`を用いてレンダリングする。

## 実行ステップ

### 1. クエリの追加 (`lib/queries.ts`)
`lib/queries.ts`の末尾（または適切な位置）に以下のクエリを追加する。

```typescript
// ホームページ用講義取得（階層構造付き）
export const HOMEPAGE_COURSES_QUERY = `
  *[_type == "course" && isActive == true && courseType == "main"] | order(order asc) {
    _id,
    courseId,
    title,
    subtitle,
    description,
    features,
    image {
      asset->,
      alt
    },
    backgroundClass,
    order,
    ctaBox,
    "childCourses": *[_type == "course" && parentCourse._ref == ^._id && isActive == true] | order(order asc) {
      _id,
      courseId,
      title,
      subtitle,
      description,
      features,
      image {
        asset->,
        alt
      },
      backgroundClass,
      order,
      ctaBox
    }
  }
`
```

### 2. コンポーネントの実装 (`app/page.tsx`)
`HomePage`コンポーネントを修正する。

1.  **インポートの追加**:
    ```typescript
    import CourseCard from '@/components/school/CourseCard'
    import { HOMEPAGE_COURSES_QUERY } from '@/lib/queries'
    import { Course } from '@/lib/types/course'
    ```

2.  **データ取得**:
    ```typescript
    // 講座データ取得
    const courses = await sanityFetch<Course[]>({
      query: HOMEPAGE_COURSES_QUERY,
      tags: ['course'],
      preview: isPreview,
    })
    ```

3.  **レンダリング**:
    カテゴリーカードグリッドの下、ChatSectionWrapperの上に以下を配置する。
    ```tsx
          {/* 講座リストセクション */}
          {courses && courses.length > 0 && (
            <div className="w-full max-w-screen-xl mx-auto px-6 mb-16">
              <div className="text-center mb-12">
                <h2 className="font-noto-serif text-sm font-medium text-[hsl(var(--text-primary))] tracking-[0.2em] uppercase mb-2">
                  COURSES
                </h2>
                <div className="w-12 h-px bg-[hsl(var(--border))] mx-auto mb-4"></div>
                <h3 className="text-2xl font-bold text-gray-900">講座一覧</h3>
              </div>
              
              <div className="space-y-12">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            </div>
          )}
    ```

## 検証項目
-   フロントページに「講座一覧」セクションが表示されること。
-   Sanityに入力された説明文、特徴リスト、画像が正しく表示されること。
-   親講座（例：カフェキネシI）の中に子講座（もしあれば）が含まれて表示されるか（CourseCardの機能）。
