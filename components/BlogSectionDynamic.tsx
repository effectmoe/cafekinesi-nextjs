import BlogCard from "./BlogCard";
import { client } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

const query = groq`
  *[_type == "blogPost"] | order(publishedAt desc) [0...9] {
    _id,
    title,
    slug,
    excerpt,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    publishedAt,
    category,
    featured,
    author-> {
      name,
      image
    }
  }
`;

async function getPosts() {
  try {
    console.log('[BlogSectionDynamic] Fetching from Sanity...');
    const posts = await client.fetch(query, {}, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    console.log('[BlogSectionDynamic] Fetched posts:', posts?.length || 0);
    return posts || [];
  } catch (error) {
    console.error('[BlogSectionDynamic] Error fetching posts:', error);
    return [];
  }
}

const BlogSectionDynamic = async () => {
  const posts = await getPosts();

  if (!posts || posts.length === 0) {
    return (
      <section className="w-full max-w-screen-xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-noto-serif text-sm font-medium text-[hsl(var(--text-primary))] tracking-[0.2em] uppercase mb-2">
            ブログ
          </h2>
          <div className="w-12 h-px bg-[hsl(var(--border))] mx-auto"></div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">記事が見つかりませんでした</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="font-noto-serif text-sm font-medium text-[hsl(var(--text-primary))] tracking-[0.2em] uppercase mb-2">
          ブログ
        </h2>
        <div className="w-12 h-px bg-[hsl(var(--border))] mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post: any) => {
          // Sanity画像URLの生成（修正版）
          let imageUrl = '/images/blog-1.webp';

          if (post.mainImage?.asset?.url) {
            // 直接URLがある場合（推奨）
            imageUrl = `${post.mainImage.asset.url}?w=400&h=300&q=80&fm=webp`;
            console.log(`[BlogSectionDynamic] Using direct URL for "${post.title}":`, imageUrl);
          } else if (post.mainImage?.asset?._ref) {
            // _refからURL生成（フォールバック）
            const ref = post.mainImage.asset._ref;
            const imageId = ref.replace('image-', '').replace(/-([a-z]+)$/, '.$1');
            imageUrl = `https://cdn.sanity.io/images/e4aqw590/production/${imageId}?w=400&h=300&q=80&fm=webp`;
            console.log(`[BlogSectionDynamic] Generated URL from _ref for "${post.title}":`, imageUrl);
          } else {
            console.warn(`[BlogSectionDynamic] No image asset found for "${post.title}", using fallback`);
          }

          return (
            <BlogCard
              key={post._id}
              image={imageUrl}
              title={post.title}
              excerpt={post.excerpt}
              date={new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).replace(/\//g, '.')}
              author={post.author}
              slug={post.slug}
            />
          );
        })}
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">
          ※ 最新の9件を表示しています
        </p>
        <a
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-[hsl(var(--text-primary))] border border-[hsl(var(--border))] rounded-full hover:bg-[hsl(var(--background-secondary))] transition-colors"
        >
          すべての記事を見る
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default BlogSectionDynamic;