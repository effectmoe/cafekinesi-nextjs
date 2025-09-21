import { sanityFetch } from '@/lib/sanity.client'
import { BLOG_POSTS_QUERY } from '@/lib/queries'

interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  mainImage?: any;
  publishedAt: string;
  category: string;
  featured: boolean;
  author?: {
    name: string;
    image?: any;
  };
}

export default async function DebugBlogPage() {
  let debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: 'production',
    sanityConfig: {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      apiToken: process.env.NEXT_PUBLIC_SANITY_API_TOKEN ? '***SET***' : 'NOT_SET'
    }
  }

  try {
    console.log('[DEBUG] Starting blog posts fetch...')
    const posts = await sanityFetch<BlogPost[]>(BLOG_POSTS_QUERY)
    debugInfo.postsCount = posts?.length || 0
    debugInfo.posts = posts?.map(post => ({
      id: post._id,
      title: post.title,
      hasImage: !!post.mainImage?.asset,
      imageAsset: post.mainImage?.asset?._ref || 'NO_ASSET',
      publishedAt: post.publishedAt
    })) || []
    debugInfo.success = true
  } catch (error: any) {
    console.error('[DEBUG] Error fetching posts:', error)
    debugInfo.error = error.message
    debugInfo.success = false
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Blog Debug Information</h1>
      <div className="bg-gray-100 p-4 rounded">
        <pre className="text-sm overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    </div>
  )
}