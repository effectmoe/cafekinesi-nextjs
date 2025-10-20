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

// イベント情報を取得（全詳細）
export const EVENTS_QUERY = `
  *[_type == "event" && endDate >= now()] | order(startDate) {
    _id,
    title,
    titleEn,
    slug,
    description,
    descriptionEn,
    startDate,
    endDate,
    location,
    image {
      asset->,
      alt
    },
    registrationUrl,
    capacity,
    currentParticipants,
    fee,
    status,
    category,
    instructor-> {
      _id,
      name,
      slug
    },
    tags,
    useForAI
  }
`

// 月別イベントを取得
export const EVENTS_BY_MONTH_QUERY = `
  *[_type == "event" &&
    startDate >= $startOfMonth &&
    startDate < $endOfMonth
  ] | order(startDate) {
    _id,
    title,
    slug,
    startDate,
    endDate,
    status,
    category,
    capacity,
    currentParticipants,
    location,
    image {
      asset->,
      alt
    }
  }
`

// 期間指定イベント取得
export const EVENTS_BY_DATE_RANGE_QUERY = `
  *[_type == "event" &&
    startDate >= $startDate &&
    endDate <= $endDate
  ] | order(startDate) {
    _id,
    title,
    titleEn,
    slug,
    description,
    startDate,
    endDate,
    location,
    image {
      asset->,
      alt
    },
    registrationUrl,
    capacity,
    currentParticipants,
    fee,
    status,
    category,
    instructor-> {
      _id,
      name,
      slug
    },
    tags
  }
`

// 空きありイベント取得（AI用）
export const AVAILABLE_EVENTS_QUERY = `
  *[_type == "event" &&
    useForAI == true &&
    status == "open" &&
    endDate >= now() &&
    (capacity == null || currentParticipants < capacity)
  ] | order(startDate) {
    _id,
    title,
    slug,
    description,
    startDate,
    endDate,
    location,
    capacity,
    currentParticipants,
    fee,
    category,
    instructor-> {
      name
    },
    tags
  }
`

// イベント詳細取得
export const EVENT_DETAIL_QUERY = `
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    titleEn,
    slug,
    description,
    descriptionEn,
    startDate,
    endDate,
    location,
    image {
      asset->,
      alt
    },
    registrationUrl,
    capacity,
    currentParticipants,
    fee,
    status,
    category,
    instructor-> {
      _id,
      name,
      slug,
      title,
      image {
        asset->,
        alt
      },
      bio
    },
    tags,
    useForAI,
    aiSearchText
  }
`

// ブログ記事を取得（最新N件、デフォルト9件）
export const RECENT_POSTS_QUERY = `
  *[_type == "blogPost"] | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->{
      name
    }
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

// ホームページの情報を取得（新形式）
export const HOMEPAGE_QUERY = `
  *[_type == "homepage"][0]{
    _id,
    _type,
    title,
    categoryCards[]{
      titleJa,
      titleEn,
      image,
      colorScheme,
      link,
      isActive,
      displayOrder
    } | order(displayOrder asc),
    blogSection,
    socialLinks[]{
      platform,
      url,
      displayText,
      isActive,
      order
    } | order(order asc),
    viewAllButton,
    profileButton,
    navigationMenu[]{
      label,
      link,
      order,
      isActive
    } | order(order asc),
    headerIcons {
      searchIcon {
        show,
        link
      },
      cartIcon {
        show,
        link
      }
    }
  }
`

// ホームページのセクション情報を取得（既存形式 - 後方互換性）
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
    lastUpdated,
    _updatedAt,
    isClusterPage,
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
    sidebar {
      showContactButton,
      contactButtonText,
      contactButtonLink,
      socialMedia {
        facebookUrl,
        instagramPostUrl,
        youtubeVideoUrl
      },
      customSections[] {
        title,
        items[] {
          text,
          link
        }
      }
    },
    faq[] {
      question,
      answer
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
    lastUpdated,
    _updatedAt,
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

// インストラクター一覧を取得
export const INSTRUCTORS_QUERY = `
  *[_type == "instructor" && isActive == true] | order(order asc) {
    _id,
    name,
    slug,
    title,
    image {
      asset->,
      alt
    },
    bio,
    region,
    specialties,
    order,
    isActive,
    featured
  }
`

// インストラクター詳細を取得
export const INSTRUCTOR_DETAIL_QUERY = `
  *[_type == "instructor" && slug.current == $slug && isActive == true][0] {
    _id,
    name,
    slug,
    title,
    image {
      asset->,
      alt
    },
    bio,
    profileDetails,
    region,
    certifications[] {
      title,
      organization,
      year
    },
    experience[] {
      year,
      description
    },
    teachingCourses[]-> {
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
    specialties,
    email,
    phone,
    website,
    socialLinks[] {
      platform,
      url
    },
    order,
    isActive,
    featured,
    seo
  }
`

// 注目インストラクターを取得
export const FEATURED_INSTRUCTORS_QUERY = `
  *[_type == "instructor" && isActive == true && featured == true] | order(order asc) [0...3] {
    _id,
    name,
    slug,
    title,
    image {
      asset->,
      alt
    },
    bio,
    region,
    specialties,
    order
  }
`

// インストラクターページ設定を取得
export const INSTRUCTOR_PAGE_QUERY = `
  *[_type == "instructorPage"][0] {
    _id,
    title,
    heroSection {
      title,
      description,
      backgroundImage {
        asset->,
        alt
      }
    },
    aboutSection {
      title,
      description,
      image {
        asset->,
        alt
      }
    },
    servicesSection {
      title,
      services[] {
        title,
        description,
        icon
      }
    },
    mapSection {
      title,
      description
    },
    seo {
      title,
      description,
      keywords,
      ogImage {
        asset->
      }
    },
    isActive
  }
`

// プロフィールページ情報を取得
export const PROFILE_PAGE_QUERY = `
  *[_type == "profilePage"][0] {
    _id,
    title,
    profileSection {
      photo {
        asset-> {
          _id,
          url
        }
      },
      name,
      nameReading,
      location
    },
    historyTitle,
    historyItems[] | order(order asc) {
      text,
      order
    },
    activitiesTitle,
    activitiesDescription,
    activitiesItems[] | order(order asc) {
      title,
      order
    },
    seo {
      title,
      description,
      keywords,
      ogImage {
        asset->
      }
    },
    isActive
  }
`

// About（カフェキネシについて）ページ情報を取得
export const ABOUT_PAGE_QUERY = `
  *[_type == "aboutPage"][0] {
    _id,
    title,
    heroSection {
      image {
        asset-> {
          _id,
          url
        },
        alt
      },
      title,
      subtitle
    },
    tableOfContents[] {
      text,
      link
    },
    sections[] {
      id,
      title,
      layout,
      backgroundColor,
      customBackgroundColor,
      image {
        asset-> {
          _id,
          url
        },
        alt
      },
      content,
      highlightBox {
        show,
        content
      },
      button {
        show,
        text,
        link
      },
      cards[] {
        number,
        title,
        description,
        bgColor,
        customBgColor
      },
      linkCards[] {
        title,
        description,
        link,
        image {
          asset-> {
            _id,
            url
          },
          alt
        },
        bgColor
      }
    },
    seo {
      title,
      description,
      keywords,
      ogImage {
        asset->
      }
    },
    isActive
  }
`
// FAQ質問カードを取得
export const FAQ_CARDS_QUERY = `
  *[_type == "faqCard" && isActive == true] | order(order asc) {
    _id,
    title,
    icon,
    bgColor,
    iconColor,
    order,
    isActive
  }
`

// チャットモーダル設定を取得
export const CHAT_MODAL_QUERY = `
  *[_type == "chatModal"][0] {
    _id,
    headerTitle,
    headerSubtitle,
    inputPlaceholder,
    footerMessage,
    welcomeMessage,
    sampleMessages[] {
      role,
      content,
      time
    },
    faqSectionTitle,
    faqSectionSubtitle,
    calendarButtonEnabled,
    calendarButtonText,
    calendarButtonUrl,
    contactFormButtonEnabled,
    contactFormButtonText,
    contactFormButtonUrl,
    contactFormButtonIcon,
    contactFormButtonCustomIcon {
      asset-> {
        _id,
        url
      },
      alt
    },
    contactFormButtonBgColor,
    contactFormButtonCustomBgColor,
    isActive
  }
`

// FAQカテゴリー一覧を取得
export const FAQ_CATEGORIES_QUERY = `
  *[_type == "faqCategory"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    order
  }
`

// FAQ一覧を取得（カテゴリー情報をpopulate、カテゴリー別、順序付き）
export const FAQ_LIST_QUERY = `
  *[_type == "faq"] | order(category->order asc, order asc) {
    _id,
    question,
    answer,
    category-> {
      _id,
      _type,
      title,
      slug,
      order
    },
    order
  }
`
