'use client'

import BlogCard from "./BlogCard";

const BlogSectionHardcoded = () => {
  // APIから取得した実際のデータをハードコード
  const posts = [
    {
      "_id": "post-9",
      "category": "wellness",
      "excerpt": "簡単にできる呼吸法を身につけることで、日常のストレスを効果的に解放することができます。正しい呼吸が心身に与える影響について詳しく解説します。",
      "featured": false,
      "publishedAt": "2025-09-21T08:05:14.736Z",
      "slug": {
        "_type": "slug",
        "current": "breathing-stress-relief"
      },
      "title": "呼吸法で日常のストレスを解放"
    },
    {
      "_id": "XAQEqtwWGfwaiZX4sDipwF",
      "category": "wellness",
      "excerpt": "マーカー機能のテスト用記事ですよー！\nいかがですか？",
      "featured": false,
      "publishedAt": "2025-09-18T17:42:40.674Z",
      "slug": {
        "_type": "slug",
        "current": "marker-test-post"
      },
      "title": "マーカー機能テスト記事"
    },
    {
      "_id": "post-1",
      "category": "wellness",
      "excerpt": "忙しい現代社会において、ほんの少しの時間でも心を落ち着かせることの大切さを改めて感じています。日本茶を丁寧に淹れる時間は、自分自身と向き合う貴重なひとときとなります。",
      "featured": true,
      "publishedAt": "2024-12-15T00:00:00.000Z",
      "slug": {
        "_type": "slug",
        "current": "japanese-tea-mindfulness"
      },
      "title": "心と身体を整える日本茶の時間"
    },
    {
      "_id": "post-2",
      "category": "wellness",
      "excerpt": "朝の目覚めを心地よくするアロマの選び方をご紹介します。自然の香りが持つ力を借りて、一日を穏やかに始めるための実践的なアプローチを探っていきましょう。",
      "featured": false,
      "publishedAt": "2024-12-08T00:00:00.000Z",
      "slug": {
        "_type": "slug",
        "current": "morning-aromatherapy-routine"
      },
      "title": "アロマテラピーで始める新しい朝の習慣"
    },
    {
      "_id": "post-3",
      "category": "wellness",
      "excerpt": "日常生活の中に静寂な時間を取り入れるための空間デザインについて考えてみました。シンプルで機能的な環境が、心の平穏をもたらすための基盤となります。",
      "featured": false,
      "publishedAt": "2024-12-01T00:00:00.000Z",
      "slug": {
        "_type": "slug",
        "current": "meditation-space-design"
      },
      "title": "瞑想空間としての住まいづくり"
    },
    {
      "_id": "post-4",
      "category": "wellness",
      "excerpt": "身体の緊張をほぐし、精神的な安定を得るための基本的なヨガポーズをご紹介します。日々の練習を通じて、内なる平和と調和を見つけていきましょう。",
      "featured": false,
      "publishedAt": "2024-11-24T00:00:00.000Z",
      "slug": {
        "_type": "slug",
        "current": "yoga-poses-for-mindfulness"
      },
      "title": "ヨガのポーズで心を整える"
    },
    {
      "_id": "post-5",
      "category": "wellness",
      "excerpt": "自宅でできる簡単なセルフマッサージの方法をお伝えします。緊張した筋肉をほぐし、血行を促進することで、心身のリラクゼーションを深めることができます。",
      "featured": false,
      "publishedAt": "2024-11-17T00:00:00.000Z",
      "slug": {
        "_type": "slug",
        "current": "healing-massage-techniques"
      },
      "title": "癒しのマッサージ技法"
    },
    {
      "_id": "post-6",
      "category": "wellness",
      "excerpt": "旬の食材を使った栄養バランスの取れた食事は、身体だけでなく心の健康にも大きく影響します。自然の恵みを活かした食習慣について考えてみましょう。",
      "featured": false,
      "publishedAt": "2024-11-10T00:00:00.000Z",
      "slug": {
        "_type": "slug",
        "current": "healthy-eating-beauty"
      },
      "title": "健康的な食事で内側から美しく"
    },
    {
      "_id": "post-7",
      "category": "wellness",
      "excerpt": "小さなスペースでも楽しめる庭づくりのコツをご紹介します。植物と触れ合う時間は、忙しい日常の中で心を癒し、自然とのつながりを感じさせてくれます。",
      "featured": false,
      "publishedAt": "2024-11-03T00:00:00.000Z",
      "slug": {
        "_type": "slug",
        "current": "natural-harmony-gardening"
      },
      "title": "自然との調和を感じる庭づくり"
    }
  ];

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
            image="/images/blog-1.webp"
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

export default BlogSectionHardcoded;