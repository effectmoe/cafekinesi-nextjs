import BlogCard from "./BlogCard";
import { client, urlFor } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

const query = groq`
  *[_type == "blogPost"] | order(publishedAt desc) [0...9] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    category,
    featured,
    author-> {
      name,
      image {
        asset-> {
          url
        }
      }
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
          // Sanity公式のurlFor()を使用した画像URL生成
          let imageUrl = '/images/blog-1.webp';

          if (post.mainImage) {
            try {
              imageUrl = urlFor(post.mainImage)
                .width(400)
                .height(300)
                .quality(80)
                .format('webp')
                .url();
              console.log(`[BlogSectionDynamic] Generated URL with urlFor() for "${post.title}":`, imageUrl);
            } catch (error) {
              console.error(`[BlogSectionDynamic] Error generating URL for "${post.title}":`, error);
              console.warn(`[BlogSectionDynamic] Using fallback image for "${post.title}"`);
            }
          } else {
            console.warn(`[BlogSectionDynamic] No mainImage found for "${post.title}", using fallback`);
          }

          // 著者情報のデバッグ
          console.log(`[BlogSectionDynamic] Author for "${post.title}":`, post.author);
          if (!post.author) {
            console.warn(`[BlogSectionDynamic] ❌ No author set for "${post.title}" - will show default`);
          } else {
            console.log(`[BlogSectionDynamic] ✅ Author "${post.author.name}" for "${post.title}"`);
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
              author={post.author || { name: 'カフェきねし', image: null }}
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