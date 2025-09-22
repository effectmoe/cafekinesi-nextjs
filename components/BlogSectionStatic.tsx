import BlogCard from "./BlogCard";
import blogData from '../public/blog-posts.json';

const BlogSectionStatic = () => {
  const posts = blogData.slice(0, 9);

  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="font-noto-serif text-sm font-medium text-[hsl(var(--text-primary))] tracking-[0.2em] uppercase mb-2">
          ブログ
        </h2>
        <div className="w-12 h-px bg-[hsl(var(--border))] mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post: any) => (
          <BlogCard
            key={post._id}
            image={post.mainImage?.asset ?
              `https://cdn.sanity.io/images/e4aqw590/production/${post.mainImage.asset._ref.replace('image-', '').replace('-webp', '.webp').replace('-jpg', '.jpg')}?w=400&h=300&q=80&fm=webp`
              : '/images/blog-1.webp'}
            title={post.title}
            excerpt={post.excerpt}
            date={new Date(post.publishedAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\//g, '.')}
            slug={post.slug}
          />
        ))}
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

export default BlogSectionStatic;