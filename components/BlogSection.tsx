'use client'

import BlogCard from "./BlogCard";
import { sanityFetch, urlFor } from '@/lib/sanity.client';
import { BLOG_POSTS_QUERY } from '@/lib/queries';
import { useEffect, useState } from 'react';

// ローカルの画像をインポート（フォールバック用）
const blog1 = "/images/blog-1.webp";
const blog2 = "/images/blog-2.webp";
const blog3 = "/images/blog-3.webp";
const blog4 = "/images/blog-4.webp";
const blog5 = "/images/blog-5.webp";
const blog6 = "/images/blog-6.webp";
const blog7 = "/images/blog-7.webp";
const blog8 = "/images/blog-8.webp";
const blog9 = "/images/blog-9.webp";

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

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        console.log('[BlogSection] Fetching blog posts...');
        const posts = await sanityFetch<BlogPost[]>(BLOG_POSTS_QUERY);
        console.log('[BlogSection] Fetched posts:', posts);
        setBlogPosts(posts || []);
      } catch (err) {
        console.error('[BlogSection] Error fetching posts:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  // デフォルトのブログ記事データ（Sanityにデータがない場合のフォールバック）
  const defaultBlogPosts = [
    {
      id: 1,
      image: blog1,
      title: "心と身体を整える日本茶の時間",
      excerpt: "忙しい現代社会において、ほんの少しの時間でも心を落ち着かせることの大切さを改めて感じています。日本茶を丁寧に淹れる時間は、自分自身と向き合う貴重なひとときとなります。",
      date: "2024.12.15",
      slug: "japanese-tea-time"
    },
    {
      id: 2,
      image: blog2,
      title: "アロマテラピーで始める新しい朝の習慣",
      excerpt: "朝の目覚めを心地よくするアロマの選び方をご紹介します。自然の香りが持つ力を借りて、一日を穏やかに始めるための実践的なアプローチを探っていきましょう。",
      date: "2024.12.08",
      slug: "aroma-morning-routine"
    },
    {
      id: 3,
      image: blog3,
      title: "瞑想空間としての住まいづくり",
      excerpt: "日常生活の中に静寂な時間を取り入れるための空間デザインについて考えてみました。シンプルで機能的な環境が、心の平穏をもたらすための基盤となります。",
      date: "2024.12.01",
      slug: "meditation-space-design"
    },
    {
      id: 4,
      image: blog4,
      title: "ヨガのポーズで心を整える",
      excerpt: "身体の緊張をほぐし、精神的な安定を得るための基本的なヨガポーズをご紹介します。日々の練習を通じて、内なる平和と調和を見つけていきましょう。",
      date: "2024.11.24",
      slug: "yoga-poses-mindfulness"
    },
    {
      id: 5,
      image: blog5,
      title: "癒しのマッサージ技法",
      excerpt: "自宅でできる簡単なセルフマッサージの方法をお伝えします。緊張した筋肉をほぐし、血行を促進することで、心身のリラクゼーションを深めることができます。",
      date: "2024.11.17",
      slug: "healing-massage-techniques"
    },
    {
      id: 6,
      image: blog6,
      title: "健康的な食事で内側から美しく",
      excerpt: "旬の食材を使った栄養バランスの取れた食事は、身体だけでなく心の健康にも大きく影響します。自然の恵みを活かした食習慣について考えてみましょう。",
      date: "2024.11.10",
      slug: "healthy-eating-beauty"
    },
    {
      id: 7,
      image: blog7,
      title: "自然との調和を感じる庭づくり",
      excerpt: "小さなスペースでも楽しめる庭づくりのコツをご紹介します。植物と触れ合う時間は、忙しい日常の中で心を癒し、自然とのつながりを感じさせてくれます。",
      date: "2024.11.03",
      slug: "natural-gardening"
    },
    {
      id: 8,
      image: blog8,
      title: "自然由来のスキンケア習慣",
      excerpt: "化学的な成分に頼らない、自然な素材を使ったスキンケアの方法をお伝えします。肌本来の美しさを引き出し、健やかな状態を保つための日々のケアについて。",
      date: "2024.10.27",
      slug: "natural-skincare"
    },
    {
      id: 9,
      image: blog9,
      title: "呼吸法で日常のストレスを解放",
      excerpt: "簡単にできる呼吸法を身につけることで、日常のストレスを効果的に解放することができます。正しい呼吸が心身に与える影響について詳しく解説します。",
      date: "2024.10.20",
      slug: "breathing-stress-relief"
    }
  ];

  // Sanityからのデータがある場合はそちらを優先、ない場合はデフォルトデータを使用
  // loadingが終わってデータがある場合のみSanityのデータを使用
  const displayPosts = (blogPosts && blogPosts.length > 0) ? blogPosts.slice(0, 9) : defaultBlogPosts;
  const usingSanityData = blogPosts && blogPosts.length > 0;

  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="font-noto-serif text-sm font-medium text-[hsl(var(--text-primary))] tracking-[0.2em] uppercase mb-2">
          ブログ
        </h2>
        <div className="w-12 h-px bg-[hsl(var(--border))] mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {usingSanityData ? (
          // Sanityからのデータを表示
          displayPosts.map((post: any) => (
            <BlogCard
              key={post._id}
              image={post.mainImage ? urlFor(post.mainImage).width(400).height(300).quality(80).url() : blog1}
              title={post.title}
              excerpt={post.excerpt}
              date={new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).replace(/\//g, '.')}
              slug={post.slug}
            />
          ))
        ) : (
          // デフォルトデータを表示
          displayPosts.map((post: any) => (
            <BlogCard
              key={post.id}
              image={post.image}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              slug={post.slug}
            />
          ))
        )}
      </div>

      {error && (
        <div className="text-center mt-8 text-sm text-gray-500">
          ※ 現在、サンプルデータを表示しています
        </div>
      )}

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

export default BlogSection;