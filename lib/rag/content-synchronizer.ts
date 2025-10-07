import { publicClient } from '@/lib/sanity.client';
import { VercelVectorStore } from '@/lib/vector/vercel-vector-store';

export class ContentSynchronizer {
  private vectorStore: VercelVectorStore;

  constructor() {
    this.vectorStore = new VercelVectorStore();
  }

  async initialize() {
    await this.vectorStore.initialize();
  }

  // Sanityコンテンツ同期
  async syncSanityContent() {
    console.log('🔄 Sanityコンテンツ同期開始...');

    const contentTypes = [
      { type: 'shopInfo', query: '*[_type == "shopInfo"]' },
      { type: 'menuItem', query: '*[_type == "menuItem"]' },
      { type: 'blogPost', query: '*[_type == "blogPost"]' },
      { type: 'event', query: '*[_type == "event"]' },
      { type: 'news', query: '*[_type == "news"]' },
      { type: 'course', query: '*[_type == "course"]' },
      { type: 'instructor', query: '*[_type == "instructor"]' },
      { type: 'faq', query: '*[_type == "faq"]' },
      { type: 'page', query: '*[_type == "page"]' },
      { type: 'homepage', query: '*[_type == "homepage"]' },
      { type: 'aboutPage', query: '*[_type == "aboutPage"]' },
      { type: 'schoolPage', query: '*[_type == "schoolPage"]' },
      { type: 'instructorPage', query: '*[_type == "instructorPage"]' }
    ];

    for (const contentType of contentTypes) {
      try {
        console.log(`📄 ${contentType.type} を同期中...`);
        const items = await publicClient.fetch(contentType.query);

        if (items && items.length > 0) {
          const documents = items.map((item: any) => ({
            content: this.formatContent(item, contentType.type),
            metadata: {
              id: item._id,
              type: contentType.type,
              title: item.title || item.name || item.question,
              slug: item.slug?.current,
              updatedAt: item._updatedAt
            },
            source: 'sanity'
          }));

          await this.vectorStore.addDocuments(documents);
          console.log(`✅ ${contentType.type}: ${documents.length}件追加`);
        } else {
          console.log(`⚠️ ${contentType.type}: データなし`);
        }
      } catch (error) {
        console.error(`❌ ${contentType.type} 同期エラー:`, error);
      }
    }

    console.log('✅ Sanity同期完了');
  }

  // コンテンツフォーマット
  private formatContent(item: any, type: string): string {
    switch (type) {
      case 'shopInfo':
        return `カフェ情報: ${item.name || ''}
          説明: ${item.description || ''}
          営業時間: ${item.hours || ''}
          場所: ${item.location || ''}
          住所: ${item.address || ''}
          電話: ${item.phone || ''}`;

      case 'menuItem':
        return `メニュー: ${item.name || ''}
          カテゴリ: ${item.category || ''}
          価格: ¥${item.price || ''}
          説明: ${item.description || ''}
          材料: ${item.ingredients || ''}`;

      case 'blogPost':
        return `ブログ: ${item.title || ''}
          概要: ${item.excerpt || ''}
          内容: ${this.extractTextFromPortableText(item.content) || ''}
          カテゴリ: ${item.category?.title || ''}`;

      case 'event':
        return `イベント: ${item.title || ''}
          説明: ${item.description || ''}
          日時: ${item.date || ''}
          場所: ${item.location || ''}
          料金: ${item.price || ''}`;

      case 'news':
        return `ニュース: ${item.title || ''}
          内容: ${item.content || ''}
          日付: ${item.publishedAt || ''}`;

      case 'course':
        return `コース: ${item.title || ''}
          説明: ${item.description || ''}
          期間: ${item.duration || ''}
          料金: ${item.price || ''}
          レベル: ${item.level || ''}`;

      case 'instructor':
        return `インストラクター: ${item.name || ''}
          専門分野: ${item.specialization || ''}
          経歴: ${item.biography || ''}
          地域: ${item.region || ''}
          資格: ${item.certifications || ''}`;

      case 'faq':
        return `FAQ: ${item.question || ''}
          回答: ${item.answer || ''}
          カテゴリ: ${item.category || ''}`;

      case 'page':
        return `ページ: ${item.title || ''}
          内容: ${this.extractTextFromPortableText(item.content) || ''}
          概要: ${item.description || ''}`;

      case 'homepage':
        return `ホームページ: ${item.title || ''}
          ヒーロー: ${item.hero?.title || ''} ${item.hero?.subtitle || ''}
          概要: ${item.description || ''}`;

      case 'aboutPage':
        return `アバウトページ: ${item.title || ''}
          内容: ${this.extractTextFromPortableText(item.content) || ''}
          ミッション: ${item.mission || ''}`;

      case 'schoolPage':
        return `スクールページ: ${item.title || ''}
          説明: ${item.description || ''}
          特徴: ${item.features?.map((f: any) => f.title).join(', ') || ''}`;

      case 'instructorPage':
        return `インストラクターページ: ${item.title || ''}
          説明: ${item.description || ''}
          内容: ${this.extractTextFromPortableText(item.content) || ''}`;

      default:
        return JSON.stringify(item);
    }
  }

  // PortableTextからテキストを抽出
  private extractTextFromPortableText(content: any[]): string {
    if (!Array.isArray(content)) return '';

    return content
      .filter((block: any) => block._type === 'block')
      .map((block: any) => {
        return block.children
          ?.map((child: any) => child.text)
          .join('') || '';
      })
      .join('\n');
  }
}