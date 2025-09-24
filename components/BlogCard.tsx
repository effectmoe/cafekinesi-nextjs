'use client'

import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  image: string;
  title: string;
  excerpt: string;
  date: string;
  author?: { name: string; image?: any } | null;  // 著者情報を追加
  slug?: string | { current: string };  // Sanityからのデータ用
  className?: string;
}

const BlogCard = ({ image, title, excerpt, date, author, slug, className }: BlogCardProps) => {
  // プリロード用の関数
  const handleMouseEnter = () => {
    // Next.jsでは自動的にプリロードされるため、特別な処理は不要
  };

  const content = (
    <article className={`group cursor-pointer ${className}`} onMouseEnter={handleMouseEnter}>
      <div className="aspect-[4/3] relative overflow-hidden mb-4 bg-gray-100">
        {image.startsWith('http') ? (
          // Sanityの画像（通常のimg tag）
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              console.error('❌ Image failed to load:', {
                src: target.src,
                title: title,
                naturalWidth: target.naturalWidth,
                naturalHeight: target.naturalHeight
              });
              if (!target.src.includes('/images/blog-1.webp')) {
                console.log('🔄 Falling back to default image');
                target.src = '/images/blog-1.webp';
              }
            }}
            onLoad={(e) => {
              const target = e.target as HTMLImageElement;
              console.log('✅ Image loaded successfully:', {
                src: image,
                title: title,
                naturalWidth: target.naturalWidth,
                naturalHeight: target.naturalHeight
              });
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
            onError={() => console.warn('❌ Local image failed to load:', image)}
            onLoad={() => console.log('✅ Local image loaded:', image)}
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
        <div className="flex items-center justify-between text-xs text-[hsl(var(--text-muted))]">
          <time className="font-light tracking-wider uppercase">
            {date}
          </time>
          {author && (
            <span className="font-light">
              {author.name}
            </span>
          )}
        </div>
      </div>
    </article>
  );

  // slugがある場合はリンクでラップ
  if (slug) {
    const slugValue = typeof slug === 'object' && slug.current ? slug.current : slug;
    return (
      <Link href={`/blog/${slugValue}`} className="block">
        {content}
      </Link>
    );
  }

  // slugがない場合（デフォルトデータ）はそのまま表示
  return content;
};

export default BlogCard;