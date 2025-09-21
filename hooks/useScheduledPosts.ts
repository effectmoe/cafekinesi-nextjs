import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { client, previewClient } from '@/lib/sanity.client';
import { isPreviewMode } from '@/api/preview';

interface UseScheduledPostsOptions {
  includeScheduled?: boolean; // 予約投稿を含むかどうか
  refetchInterval?: number;   // 自動更新間隔（ミリ秒）
  category?: string;          // カテゴリーフィルター
  limit?: number;             // 取得件数
}

// 公開済み記事のみ取得するクエリ
const getPublishedPostsQuery = (category?: string, limit?: number) => `
  *[_type == "blogPost" && publishedAt <= now() ${category ? `&& category == "${category}"` : ''}]
  | order(publishedAt desc)
  [0...${limit || 10}] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    tldr,
    mainImage,
    publishedAt,
    category,
    tags,
    featured,
    "author": author->{
      name,
      image
    }
  }
`;

// すべての記事を取得するクエリ（プレビューモード用）
const getAllPostsQuery = (category?: string, limit?: number) => `
  *[_type == "blogPost" ${category ? `&& category == "${category}"` : ''}]
  | order(publishedAt desc)
  [0...${limit || 10}] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    tldr,
    mainImage,
    publishedAt,
    category,
    tags,
    featured,
    "author": author->{
      name,
      image
    },
    // 予約投稿かどうかのフラグを追加
    "isScheduled": publishedAt > now()
  }
`;

// 予約投稿の記事を取得するカスタムHook
export function useScheduledPosts(options: UseScheduledPostsOptions = {}) {
  const {
    includeScheduled = false,
    refetchInterval = 60000, // デフォルト1分
    category,
    limit = 10
  } = options;

  const [currentTime, setCurrentTime] = useState(new Date());
  const isPreview = isPreviewMode();

  // 1分ごとに現在時刻を更新（予約投稿のチェック用）
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      console.log('🕒 予約投稿チェック:', new Date().toLocaleString('ja-JP'));
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval]);

  // React Queryを使用したデータフェッチング
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['scheduledPosts', { category, limit, includeScheduled, isPreview, currentTime }],
    queryFn: async () => {
      const activeClient = isPreview ? previewClient : client;
      const query = (isPreview || includeScheduled)
        ? getAllPostsQuery(category, limit)
        : getPublishedPostsQuery(category, limit);

      const posts = await activeClient.fetch(query);

      // デバッグ用ログ
      if (isPreview || includeScheduled) {
        const scheduled = posts.filter((p: any) => p.isScheduled);
        if (scheduled.length > 0) {
          console.log('📅 予約投稿記事:', scheduled.length, '件');
          scheduled.forEach((post: any) => {
            const publishDate = new Date(post.publishedAt);
            const now = new Date();
            const diff = publishDate.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (diff > 0) {
              console.log(`  - "${post.title}": ${hours}時間${minutes}分後に公開`);
            }
          });
        }
      }

      return posts;
    },
    refetchInterval: refetchInterval, // 定期的に自動更新
    refetchOnWindowFocus: true,       // ウィンドウフォーカス時に更新
    staleTime: 30000,                 // 30秒間はキャッシュを使用
  });

  // 公開日時のフォーマット用ヘルパー関数
  const formatPublishDate = (date: string) => {
    const publishDate = new Date(date);
    const now = new Date();
    const diff = publishDate.getTime() - now.getTime();

    // 過去の日付
    if (diff < 0) {
      const absDiff = Math.abs(diff);
      const hours = Math.floor(absDiff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (days > 7) {
        return publishDate.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        });
      } else if (days > 0) {
        return `${days}日前`;
      } else if (hours > 0) {
        return `${hours}時間前`;
      } else {
        return '先ほど';
      }
    }

    // 未来の日付（予約投稿）
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}日後に公開`;
    } else if (hours > 0) {
      return `${hours}時間後に公開`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}分後に公開`;
    }
  };

  // 予約投稿の状態を判定するヘルパー関数
  const getPostStatus = (publishedAt: string) => {
    const publishDate = new Date(publishedAt);
    const now = new Date();

    if (publishDate > now) {
      return 'scheduled'; // 予約投稿
    } else {
      return 'published'; // 公開済み
    }
  };

  return {
    posts: data || [],
    loading: isLoading,
    error,
    refetch,
    formatPublishDate,
    getPostStatus,
    currentTime // デバッグ用
  };
}