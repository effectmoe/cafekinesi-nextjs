import { blogSlugify } from '../../utils/slugify'

export default {
  name: 'blogPost',
  title: 'ブログ記事',
  type: 'document',
  icon: () => '📝',
  description: '📍 使用箇所: /blog, /blog/[slug] | ステータス: ✅ 使用中 | ブログ記事の管理',
  groups: [
    {
      name: 'basic',
      title: '基本情報',
    },
    {
      name: 'media',
      title: 'メディア',
    },
    {
      name: 'content',
      title: 'コンテンツ',
    },
    {
      name: 'navigation',
      title: 'ナビゲーション',
    },
    {
      name: 'layout',
      title: 'レイアウト',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'ai',
      title: 'AI設定',
    },
  ],
  fields: [
    // 並び替え用フィールド
    defineField({
      name: 'orderRank',
      title: '並び順',
      type: 'string',
      hidden: true,
    }),
    // === レイアウト設定 ===
    {
      name: 'contentOrder',
      title: 'コンテンツ表示順序',
      type: 'array',
      group: 'layout',
      description: 'ページ上でのコンテンツの表示順序を設定（ドラッグで並び替え可能）',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: 'タイトル', value: 'title'},
              {title: 'スラッグ', value: 'slug'},
              {title: '注目記事バッジ', value: 'featured'},
              {title: 'メタ情報（更新日時・読了時間）', value: 'metaInfo'},
              {title: '公開日時', value: 'publishedAt'},
              {title: 'カテゴリー', value: 'category'},
              {title: '著者情報', value: 'author'},
              {title: '抜粋', value: 'excerpt'},
              {title: 'タグ', value: 'tags'},
              {title: 'ソーシャルシェアボタン', value: 'socialShare'},
              {title: 'メイン画像', value: 'mainImage'},
              {title: 'ギャラリー画像', value: 'gallery'},
              {title: '追加画像', value: 'additionalImages'},
              {title: 'OGP画像', value: 'ogImage'},
              {title: 'TL;DR（要約）', value: 'tldr'},
              {title: '目次', value: 'toc'},
              {title: '本文', value: 'content'},
              {title: '内部リンク', value: 'internalLinks'},
              {title: '重要ポイント', value: 'keyPoint'},
              {title: '外部リンク・参考文献', value: 'externalReferences'},
              {title: 'まとめ', value: 'summary'},
              {title: 'FAQ', value: 'faq'},
              {title: '関連記事', value: 'related'},
              {title: '前後の記事ナビゲーション', value: 'prevNext'}
            ]
          }
        }
      ],
      initialValue: ['title', 'slug', 'featured', 'publishedAt', 'category', 'author', 'excerpt', 'tags', 'socialShare', 'mainImage', 'gallery', 'additionalImages', 'ogImage', 'tldr', 'toc', 'content', 'keyPoint', 'summary', 'faq', 'related', 'prevNext']
    },

    // === 基本情報（必須項目） ===
    {
      name: 'title',
      title: 'タイトル',
      type: 'string',
      group: 'basic',
      description: '🔴 必須',
      placeholder: '【必須】記事のタイトルを入力',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      group: 'basic',
      description: '🔴 必須 | 記事のURL用の識別子です。タイトルから自動生成されます。',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: blogSlugify,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: '著者',
      type: 'reference',
      group: 'basic',
      to: [{type: 'author'}],
    },
    {
      name: 'publishedAt',
      title: '公開日時',
      type: 'datetime',
      group: 'basic',
      description: '🔴 必須 | 記事が公開される日時を設定します。未来の日時を設定すると予約投稿になります。',
      validation: (Rule: any) => Rule.required(),
      initialValue: () => new Date().toISOString(),
      options: {
        dateFormat: 'YYYY年MM月DD日',
        timeFormat: 'HH:mm',
        timeStep: 15,
        calendarTodayLabel: '今日',
      },
    },
    {
      name: 'category',
      title: 'カテゴリー',
      type: 'string',
      group: 'basic',
      description: '🔴 必須',
      options: {
        list: [
          {title: 'ウェルネス', value: 'wellness'},
          {title: '食と健康', value: 'food_health'},
          {title: 'ライフスタイル', value: 'lifestyle'},
          {title: 'メディテーション', value: 'meditation'},
          {title: 'ヨガ', value: 'yoga'},
          {title: 'アロマテラピー', value: 'aromatherapy'},
          {title: 'スキンケア', value: 'skincare'},
          {title: '自然', value: 'nature'},
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tags',
      title: 'タグ',
      type: 'array',
      group: 'basic',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'excerpt',
      title: '抜粋',
      type: 'text',
      group: 'basic',
      rows: 3,
      description: '🔴 必須 | 記事一覧・SNSシェア用の短い説明文（トップページやSNSでの表示に使用）',
      placeholder: '【必須】記事の要約を200文字以内で入力',
      validation: (Rule: any) => Rule.required().max(200),
    },
    {
      name: 'featured',
      title: '注目記事',
      type: 'boolean',
      group: 'basic',
      description: 'トップページで目立つように表示する',
      initialValue: false,
    },

    // === 画像・メディア ===
    {
      name: 'mainImage',
      title: 'メイン画像',
      type: 'image',
      group: 'media',
      description: '🔴 必須',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'gallery',
      title: 'ギャラリー画像',
      type: 'array',
      group: 'media',
      description: '複数の画像を追加できます（スライドショー表示用）',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            metadata: ['blurhash', 'lqip', 'palette', 'dimensions'],
          },
          fields: [
            {
              name: 'caption',
              title: 'キャプション',
              type: 'string',
              description: '画像の説明（オプション）',
            },
            {
              name: 'alt',
              title: '代替テキスト',
              type: 'string',
              description: 'SEOとアクセシビリティのための説明',
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    },
    {
      name: 'additionalImages',
      title: '追加画像（シンプル）',
      type: 'array',
      group: 'media',
      description: 'シンプルに画像を追加（説明不要の場合）',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'ogImage',
      title: 'OGP画像',
      type: 'image',
      group: 'media',
      description: 'SNSシェア時に表示される画像（1200x630px推奨）',
      options: {
        hotspot: false,
        accept: 'image/png,image/jpeg,image/webp',
      },
    },

    // === コンテンツ ===
    {
      name: 'content',
      title: '本文',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            {title: '通常', value: 'normal'},
            {title: '見出し2', value: 'h2'},
            {title: '見出し3', value: 'h3'},
            {title: '見出し4', value: 'h4'},
            {title: '引用', value: 'blockquote'},
          ],
          lists: [
            {title: '箇条書き', value: 'bullet'},
            {title: '番号付きリスト', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: '太字', value: 'strong'},
              {title: '斜体', value: 'em'},
              {title: '下線', value: 'underline'},
              {title: 'マーカー', value: 'highlight'},
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          type: 'table',
        },
        {
          type: 'infoBox',
        },
        {
          type: 'comparisonTable',
        },
      ],
    },
    {
      name: 'tldr',
      title: 'TL;DR（要約）',
      type: 'text',
      group: 'content',
      rows: 3,
      description: '記事内容の3行まとめ（忙しい読者向けに記事詳細ページの冒頭に表示）',
      validation: (Rule: any) => Rule.max(300),
    },
    {
      name: 'keyPoint',
      title: '重要なポイント',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'title',
          title: 'タイトル',
          type: 'string',
          initialValue: '重要なポイント',
        },
        {
          name: 'content',
          title: '内容',
          type: 'text',
          rows: 3,
          description: '記事の重要ポイントを強調して説明',
        },
      ],
    },
    {
      name: 'summary',
      title: 'まとめ',
      type: 'text',
      group: 'content',
      rows: 4,
      description: '記事の締めくくりとなるまとめの文章',
    },
    {
      name: 'faq',
      title: 'FAQ（よくある質問）',
      type: 'array',
      group: 'content',
      description: 'この記事に関するよくある質問と回答',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: '質問',
              type: 'string',
              validation: (Rule: any) => Rule.required().min(1).max(200),
            },
            {
              name: 'answer',
              title: '回答',
              type: 'text',
              rows: 3,
              validation: (Rule: any) => Rule.required().min(1).max(1000),
            },
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer'
            }
          }
        }
      ]
    },

    // === 関連性・ナビゲーション ===
    {
      name: 'internalLinks',
      title: '内部リンク',
      type: 'array',
      group: 'navigation',
      of: [{type: 'internalLink'}],
      description: 'ピラーページやクラスターページへのリンク（LLMO/SEO最適化）',
      validation: (Rule: any) => Rule.max(6).warning('内部リンクは最大6個までを推奨します'),
    },
    {
      name: 'externalReferences',
      title: '外部リンク・参考文献',
      type: 'array',
      group: 'navigation',
      of: [{type: 'externalReference'}],
      description: '記事の信頼性を高める外部リンク（LLMO/SEO最適化）',
      validation: (Rule: any) => Rule.max(10).warning('外部リンクは最大10個までを推奨します'),
    },
    {
      name: 'relatedArticles',
      title: '関連記事',
      type: 'array',
      group: 'navigation',
      of: [
        {
          type: 'reference',
          to: [{type: 'blogPost'}],
        },
      ],
      description: 'この記事と関連する記事を選択（3-5記事推奨）',
      validation: (Rule: any) => Rule.max(5).warning('関連記事は最大5記事までを推奨します'),
    },

    // === SEO設定 ===
    {
      name: 'seo',
      title: 'SEO設定',
      type: 'seo',  // seo.tsオブジェクトを参照
      group: 'seo',
    },

    // === AI設定 ===
    {
      name: 'useForAI',
      title: 'AI学習に使用',
      type: 'boolean',
      group: 'ai',
      initialValue: true,
      description: 'AIチャットボットでこのブログ記事を参照可能にする（デフォルト: ON）',
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare(selection: any) {
      const {title, author, media, date} = selection;
      const dateFormatted = date ? new Date(date).toLocaleDateString('ja-JP') : '未公開';
      return {
        title,
        subtitle: `${dateFormatted} ${author ? `・${author}` : ''}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: '公開日（新しい順）',
      name: 'publishedDateDesc',
      by: [
        {field: 'publishedAt', direction: 'desc'}
      ]
    }
  ],
}