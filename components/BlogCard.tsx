'use client'

import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  image: string;
  title: string;
  excerpt: string;
  date: string;
  slug?: string | { current: string };  // Sanityからのデータ用
  className?: string;
}

const BlogCard = ({ image, title, excerpt, date, slug, className }: BlogCardProps) => {
  // プリロード用の関数
  const handleMouseEnter = () => {
    // Next.jsでは自動的にプリロードされるため、特別な処理は不要
  };

  const content = (
    <article className={`group cursor-pointer ${className}`} onMouseEnter={handleMouseEnter}>
      <div className="aspect-[4/3] relative overflow-hidden mb-4 bg-gray-100">
        {image.startsWith('http') ? (
          // Sanityの画像
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('/images/blog-1.webp')) {
                target.src = '/images/blog-1.webp';
              }
            }}
          />
        ) : (
          // ローカル画像はNext.js Imageコンポーネントを使用
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="space-y-3">
        <h3 className="font-noto-serif text-lg font-medium text-[hsl(var(--text-primary))] leading-relaxed group-hover:text-[hsl(var(--primary))] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        <time className="text-xs text-[hsl(var(--text-muted))] font-light tracking-wider uppercase">
          {date}
        </time>
      </div>
    </article>
  );

  // slugがある場合はリンクでラップ
  if (slug && slug.current) {
    return (
      <Link href={`/blog/${slug.current}`} className="block">
        {content}
      </Link>
    );
  } else if (slug && typeof slug === 'string') {
    return (
      <Link href={`/blog/${slug}`} className="block">
        {content}
      </Link>
    );
  }

  // slugがない場合（デフォルトデータ）はそのまま表示
  return content;
};

export default BlogCard;