// Sanity GROQ queries for Next.js

// メニューアイテムを取得
export const MENU_ITEMS_QUERY = `
  *[_type == "menuItem"] | order(category, order) {
    _id,
    name,
    nameEn,
    description,
    descriptionEn,
    price,
    category,
    image,
    available,
    featured
  }
`

// カテゴリーを取得
export const CATEGORIES_QUERY = `
  *[_type == "category"] | order(order) {
    _id,
    name,
    nameEn,
    slug,
    description,
    image
  }
`

// 店舗情報を取得
export const SHOP_INFO_QUERY = `
  *[_type == "shopInfo"][0] {
    _id,
    name,
    nameEn,
    description,
    descriptionEn,
    address,
    addressEn,
    phone,
    email,
    businessHours,
    holidays,
    socialMedia
  }
`

// お知らせを取得
export const NEWS_QUERY = `
  *[_type == "news"] | order(publishedAt desc) [0...10] {
    _id,
    title,
    titleEn,
    content,
    contentEn,
    publishedAt,
    category,
    image
  }
`

// イベント情報を取得
export const EVENTS_QUERY = `
  *[_type == "event" && endDate >= now()] | order(startDate) {
    _id,
    title,
    titleEn,
    description,
    descriptionEn,
    startDate,
    endDate,
    location,
    image,
    registrationUrl
  }
`

// ブログ記事を取得（最新9件）
export const BLOG_POSTS_QUERY = `
  *[_type == "blogPost"] | order(publishedAt desc) [0...9] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    category,
    featured,
    "author": author->{
      name,
      image
    }
  }
`

// 特定のブログ記事を取得
export const BLOG_POST_BY_SLUG_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    tldr,
    mainImage,
    content,
    keyPoint,
    summary,
    faq,
    contentOrder,
    publishedAt,
    category,
    tags,
    "author": author->{
      name,
      bio,
      image
    }
  }
`

// プレビュー用：下書きも含めて取得
export const BLOG_POST_PREVIEW_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    _rev,
    title,
    slug,
    excerpt,
    tldr,
    mainImage,
    content,
    keyPoint,
    summary,
    faq,
    contentOrder,
    publishedAt,
    category,
    tags,
    "author": author->{
      name,
      bio,
      image
    }
  }
`

// ホームページのセクション情報を取得
export const HOMEPAGE_SECTIONS_QUERY = `
  *[_type == "homepage"][0] {
    _id,
    title,
    sections[] {
      _key,
      _type,
      title,
      description,
      image,
      backgroundClass,
      link
    }
  }
`

// 講座詳細情報を取得
export const COURSE_DETAIL_QUERY = `
  *[_type == "course" && courseId == $courseId && isActive == true][0] {
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
    recommendations,
    effects,
    order,
    isActive,
    price,
    duration,
    prerequisites,
    applicationLink,
    tableOfContents,
    sections[] {
      id,
      title,
      content
    },
    gallery[] {
      asset->,
      alt
    },
    instructorInfo {
      name,
      bio,
      image {
        asset->,
        alt
      },
      profileUrl
    },
    relatedCourses[]-> {
      _id,
      courseId,
      title,
      subtitle,
      description,
      image {
        asset->,
        alt
      },
      backgroundClass,
      order
    },
    seo
  }
`

// すべての講座情報を取得（詳細付き）
export const COURSES_WITH_DETAILS_QUERY = `
  *[_type == "course" && isActive == true] | order(order asc) {
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
    recommendations,
    effects,
    order,
    isActive,
    price,
    duration,
    prerequisites,
    applicationLink,
    tableOfContents,
    sections[] {
      id,
      title,
      content
    },
    gallery[] {
      asset->,
      alt
    },
    instructorInfo {
      name,
      bio,
      image {
        asset->,
        alt
      },
      profileUrl
    },
    relatedCourses[]-> {
      _id,
      courseId,
      title,
      subtitle,
      description,
      image {
        asset->,
        alt
      },
      backgroundClass,
      order
    }
  }
`