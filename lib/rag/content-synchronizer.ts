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
      { type: 'event', query: '*[_type == "event" && useForAI == true]' },
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
          // 空のコンテンツをフィルタリング
          const validDocuments = items
            .filter((item: any) => this.isValidContent(item, contentType.type))
            .map((item: any) => ({
              content: this.formatContent(item, contentType.type),
              metadata: {
                id: item._id,
                type: contentType.type,
                title: item.title || item.name || item.question,
                slug: item.slug?.current,
                updatedAt: item._updatedAt
              },
              source: 'sanity'
            }))
            .filter((doc: any) => doc.content && doc.content.trim().length > 50); // 内容が十分あることを確認

          if (validDocuments.length > 0) {
            await this.vectorStore.addDocuments(validDocuments);
            console.log(`✅ ${contentType.type}: ${validDocuments.length}件追加（${items.length - validDocuments.length}件スキップ）`);
          } else {
            console.log(`⚠️ ${contentType.type}: 有効なデータなし（${items.length}件すべてスキップ）`);
          }
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
        const startDate = item.startDate ? new Date(item.startDate).toLocaleString('ja-JP') : '';
        const endDate = item.endDate ? new Date(item.endDate).toLocaleString('ja-JP') : '';
        const statusText = {
          'open': '受付中',
          'full': '満席',
          'closed': '終了',
          'cancelled': 'キャンセル'
        }[item.status] || item.status;
        const categoryText = {
          'course': '講座',
          'session': 'セッション',
          'information': '説明会',
          'workshop': 'ワークショップ',
          'other': 'その他'
        }[item.category] || item.category;

        return `イベント: ${item.title || ''}
          カテゴリ: ${categoryText || ''}
          ステータス: ${statusText || ''}
          開始日時: ${startDate}
          終了日時: ${endDate}
          開催場所: ${item.location || ''}
          参加費: ${item.fee ? `¥${item.fee}` : '無料'}
          定員: ${item.capacity ? `${item.capacity}名` : '制限なし'}
          現在の参加者: ${item.currentParticipants || 0}名
          説明: ${this.extractTextFromPortableText(item.description) || ''}
          タグ: ${item.tags?.join(', ') || ''}
          申込みURL: ${item.registrationUrl || ''}`;

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
          専門分野: ${item.specialties?.join(', ') || ''}
          経歴: ${item.bio || ''}
          地域: ${item.region || ''}
          詳細: ${item.profileDetails || ''}
          ウェブサイト: ${item.website || ''}
          メール: ${item.email || ''}`;

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

  // コンテンツの有効性チェック（空データのフィルタリング）
  private isValidContent(item: any, type: string): boolean {
    if (!item) return false;

    switch (type) {
      case 'instructor':
        // インストラクターは最低限名前と、専門分野か経歴のどちらかが必要
        const hasName = item.name && item.name.trim().length > 0;
        const hasSpecialties = item.specialties && item.specialties.length > 0 &&
                              item.specialties.some((s: string) => s && s.trim().length > 0);
        const hasBio = item.bio && item.bio.trim().length > 10;
        const hasProfileDetails = item.profileDetails && item.profileDetails.trim().length > 10;

        // 名前があり、かつ何らかの詳細情報がある場合のみ有効
        return hasName && (hasSpecialties || hasBio || hasProfileDetails);

      case 'faq':
        // FAQは質問と回答の両方が必要
        return item.question && item.question.trim().length > 0 &&
               item.answer && item.answer.trim().length > 0;

      case 'menuItem':
        // メニューアイテムは名前と価格が必要
        return item.name && item.name.trim().length > 0 &&
               item.price !== undefined && item.price !== null;

      case 'blogPost':
      case 'news':
      case 'event':
        // これらはタイトルと何らかの内容が必要
        return item.title && item.title.trim().length > 0 &&
               (item.content || item.description || item.excerpt);

      case 'course':
        // コースはタイトルと説明が必要
        return item.title && item.title.trim().length > 0 &&
               item.description && item.description.trim().length > 0;

      case 'shopInfo':
        // ショップ情報は名前が必要
        return item.name && item.name.trim().length > 0;

      default:
        // その他のコンテンツタイプは、タイトルか名前があれば有効
        return (item.title && item.title.trim().length > 0) ||
               (item.name && item.name.trim().length > 0);
    }
  }
}