// Sanity schema types (手動定義)

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface SanityImageAsset {
  _id: string;
  _type: 'sanity.imageAsset';
  url: string;
  metadata: {
    dimensions: {
      width: number;
      height: number;
    };
  };
}

export interface SanityImage {
  _type: 'customImage';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface SeoSettings {
  _type: 'seo';
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: SanityImage;
  noindex?: boolean;
}

export interface HeroSection {
  _type: 'hero';
  _key: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: SanityImage;
  overlayOpacity?: number;
  textColor?: 'white' | 'black' | 'primary';
  buttons?: Array<{
    text: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
  }>;
  alignment?: 'left' | 'center' | 'right';
}

export interface CtaSection {
  _type: 'cta';
  _key: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
  backgroundImage?: SanityImage;
  backgroundColor?: 'primary' | 'secondary' | 'gray' | 'white' | 'custom';
  customBackgroundColor?: string;
  textColor?: 'white' | 'black' | 'primary';
  layout?: 'center' | 'split' | 'stacked';
}

export interface FeatureSection {
  _type: 'feature';
  _key: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: SanityImage;
  icon?: string;
  features?: Array<{
    title: string;
    description?: string;
    icon?: string;
    image?: SanityImage;
  }>;
  layout?: 'grid-3' | 'grid-2' | 'grid-4' | 'split' | 'vertical';
  alignment?: 'left' | 'center' | 'right';
  backgroundColor?: 'transparent' | 'white' | 'gray' | 'primary';
}

export interface TestimonialSection {
  _type: 'testimonial';
  _key: string;
  title?: string;
  subtitle?: string;
  testimonials?: Array<{
    quote: string;
    author: string;
    position?: string;
    company?: string;
    avatar?: SanityImage;
    rating?: number;
    featured?: boolean;
  }>;
  layout?: 'slider' | 'grid-3' | 'grid-2' | 'vertical';
  showRating?: boolean;
  backgroundColor?: 'white' | 'gray' | 'primary' | 'transparent';
}

export type PageSection = HeroSection | FeatureSection | CtaSection | TestimonialSection;

export interface Page extends SanityDocument {
  _type: 'page';
  title: string;
  slug: {
    current: string;
  };
  pageBuilder?: PageSection[];
  seo?: SeoSettings;
}

export interface Homepage extends SanityDocument {
  _type: 'homepage';
  title: string;
  hero?: HeroSection;
  aboutSection?: {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: SanityImage;
  };
  servicesSection?: {
    title?: string;
    services?: FeatureSection[];
  };
  blogSection?: {
    title?: string;
    showLatest?: boolean;
    postCount?: number;
  };
  cta?: CtaSection;
  seo?: SeoSettings;
}

export interface SiteSettings extends SanityDocument {
  _type: 'siteSettings';
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  logo?: SanityImage;
  navigation?: Array<{
    title: string;
    link: string;
    subItems?: Array<{
      title: string;
      link: string;
    }>;
  }>;
  footer?: {
    copyright?: string;
    description?: string;
    links?: Array<{
      title: string;
      url: string;
    }>;
    socialMedia?: Array<{
      platform: 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'linkedin';
      url: string;
    }>;
  };
  seo?: SeoSettings;
}

export interface BlogPost extends SanityDocument {
  _type: 'blogPost';
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  mainImage: SanityImage;
  content: any; // Portable Text content
  publishedAt: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  tldr?: string;
  gallery?: SanityImage[];
  additionalImages?: SanityImage[];
  keyPoint?: string | { title?: string; content?: string };
  summary?: string;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  contentOrder?: string[];
  seo?: SeoSettings;
  author?: {
    _ref: string;
    _type: 'reference';
    name?: string;
    image?: SanityImage;
    bio?: string;
  };
  relatedArticles?: Array<{
    _id: string;
    title: string;
    slug: {
      current: string;
    };
    excerpt?: string;
    mainImage?: SanityImage;
    publishedAt?: string;
    author?: {
      name: string;
    };
  }>;
  internalLinks?: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
  externalReferences?: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
}

export interface Author extends SanityDocument {
  _type: 'author';
  name: string;
  bio?: string;
  image?: SanityImage;
}

// ============================================
// LLMO最適化用の追加型定義
// ============================================

// セマンティックメタデータ（AI用）
export interface SemanticMetadata {
  entityType?: string;
  conversationalQueries?: string[];
  topicClusters?: string[];
  intentType?: 'informational' | 'transactional' | 'navigational' | 'commercial';
  targetKeywords?: string[];
}

// 構造化データ（Schema.org JSON-LD）
export interface StructuredData {
  schemaOrgType: string;
  jsonLd: string;
  generatedAt: string;
}

// AI埋め込みコンテンツ
export interface AIEmbeddingContent {
  content: string;
  generatedAt: string;
  model?: string;
}

// ベクトルDBメタデータ
export interface VectorMetadata {
  id: string;
  type: string;
  title: string;
  url: string;
  semantic_type?: string;
  topics: string[];
  queries: string[];
  last_updated: string;
}

// ハイブリッド検索結果
export interface HybridSearchResult {
  id: string;
  totalScore: number;
  vectorScore?: number;
  keywordScore?: number;
  vectorRank?: number;
  keywordRank?: number;
  data: any;
}

// Helper types for queries
export type PageQueryResult = Page | null;
export type HomepageQueryResult = Homepage | null;
export type SiteSettingsQueryResult = SiteSettings | null;
export type BlogPostsQueryResult = BlogPost[];
export type BlogPostQueryResult = BlogPost | null;