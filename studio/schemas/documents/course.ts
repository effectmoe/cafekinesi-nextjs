import { defineType, defineField } from 'sanity'
import { BookOpen } from 'lucide-react'
import { createClient } from '@sanity/client'

// バリデーション用のクライアント
const validationClient = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false
})

export default defineType({
  name: 'course',
  title: '講座',
  type: 'document',
  icon: BookOpen,
  description: '📍 講座カード（/school）と講座詳細ページ（/school/[courseId]）の両方に表示されるコンテンツを管理します',
  groups: [
    {
      name: 'ai',
      title: 'AI最適化',
      default: false,
    },
    {
      name: 'basic',
      title: '基本情報',
    },
    {
      name: 'details',
      title: '詳細情報',
    },
    {
      name: 'content',
      title: 'コンテンツ',
    },
    {
      name: 'pricing',
      title: '料金・時間',
    },
    {
      name: 'media',
      title: 'メディア',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'sidebar',
      title: 'サイドバー設定',
    },
    {
      name: 'cta',
      title: 'CTA設定',
    },
  ],
  fields: [
    // ========== AI最適化フィールド ==========
    defineField({
      name: 'useForAI',
      title: 'AI学習に使用',
      type: 'boolean',
      group: 'ai',
      initialValue: true,
      description: 'AIチャットボットでこの講座情報を参照可能にする（デフォルト: ON）',
    }),
    defineField({
      name: 'aiSearchKeywords',
      title: 'AI検索キーワード',
      description: 'AIチャットで検索されるキーワード（例：「カフェキネシ」「基礎講座」「初心者向け」）',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'ai',
    }),
    defineField({
      name: 'aiQuickAnswer',
      title: 'AIクイック回答',
      description: 'この講座について聞かれたときのAI回答（100文字以内）',
      type: 'text',
      group: 'ai',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'conversationalQueries',
      title: '想定される質問',
      description: 'AIチャットで聞かれそうな質問（「どんな講座？」「誰向け？」など）',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'ai',
    }),
    defineField({
      name: 'topicClusters',
      title: 'トピッククラスター',
      description: 'この講座が属するトピック（セマンティック検索用）',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'ai',
    }),
    defineField({
      name: 'intentType',
      title: '検索意図',
      type: 'string',
      group: 'ai',
      options: {
        list: [
          { title: '情報収集', value: 'informational' },
          { title: '申込・購入', value: 'transactional' },
          { title: '講座検索', value: 'navigational' },
          { title: '比較検討', value: 'commercial' }
        ]
      },
      initialValue: 'informational',
    }),

    // ========== 既存フィールド ==========
    defineField({
      name: 'courseId',
      title: '講座ID',
      type: 'string',
      description: '🔴 必須 | ⚠️ 重要: URLに使用される一意の識別子（例：kinesi1, peach-touch）。英数字とハイフンのみ使用可能。日本語は使用できません。',
      placeholder: '【必須】例：kinesi1, peach-touch',
      validation: (Rule) => Rule.required().custom(async (value, context) => {
        if (!value) return true

        // 英数字とハイフンのみ許可（日本語禁止）
        const validPattern = /^[a-zA-Z0-9-]+$/
        if (!validPattern.test(value)) {
          return '❌ 講座IDには英数字とハイフン（-）のみ使用できます。日本語は使用できません。\n\n例: peach-touch, kinesi1, chakra-kinesi'
        }

        const { document } = context as any
        const currentId = document._id.replace(/^drafts\./, '')

        // 同じcourseIdを持つ他の講座を検索
        const query = `*[_type == "course" && courseId == $courseId && !(_id in [$currentId, $draftId])]{
          _id,
          title,
          subtitle
        }`

        const duplicates = await validationClient.fetch(query, {
          courseId: value,
          currentId,
          draftId: `drafts.${currentId}`
        })

        if (duplicates && duplicates.length > 0) {
          const conflictCourse = duplicates[0]
          return `❌ このcourseIDは既に使用されています: 「${conflictCourse.title}」（${conflictCourse.subtitle}）\n\n別のcourseIDを使用してください。`
        }

        return true
      }),
      group: 'basic',
    }),
    defineField({
      name: 'title',
      title: '講座名',
      type: 'string',
      description: '🔴 必須 | 📍 表示箇所: 講座カード + 講座詳細ページのタイトル + ブラウザタブ',
      placeholder: '【必須】例：カフェキネシⅠ',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'subtitle',
      title: 'サブタイトル',
      type: 'string',
      description: '🔴 必須 | 📍 表示箇所: 講座カードの説明文 + 講座詳細ページのサブタイトル',
      placeholder: '【必須】例：基礎セラピー講座',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'description',
      title: '講座説明',
      type: 'text',
      rows: 3,
      description: '🔴 必須 | 📍 表示箇所: 講座詳細ページのメタデータ（検索結果に表示）',
      placeholder: '【必須】講座の説明を入力してください',
      validation: (Rule) => Rule.required(),
      group: 'basic',
    }),
    defineField({
      name: 'features',
      title: '講座の特徴',
      type: 'array',
      of: [{ type: 'string' }],
      description: '🔴 必須（最低3つ） | 講座の主な特徴をリスト形式で入力',
      validation: (Rule) => Rule.required().min(3),
      group: 'basic',
    }),
    defineField({
      name: 'image',
      title: '講座画像',
      type: 'image',
      description: '📍 表示箇所: 講座カードの左側 + 講座詳細ページのヘッダー',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: '代替テキスト',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      group: 'media',
    }),
    defineField({
      name: 'backgroundClass',
      title: 'カラーテーマ',
      type: 'string',
      options: {
        list: [
          { title: 'ベージュ', value: 'album-beige' },
          { title: 'ブルーグレー', value: 'album-blue-gray' },
          { title: 'ライトグレー', value: 'album-light-gray' },
          { title: 'パープル', value: 'album-purple' },
          { title: 'ティール', value: 'album-teal' },
          { title: 'ピンク', value: 'album-pink' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required().error('カラーテーマを選択してください'),
      description: '🔴 必須 | 講座カードの背景色を設定します',
      group: 'basic',
    }),
    defineField({
      name: 'recommendations',
      title: 'こんな方におすすめ',
      type: 'array',
      of: [{ type: 'string' }],
      description: '受講を推奨する対象者',
      group: 'details',
    }),
    defineField({
      name: 'effects',
      title: '受講後の効果',
      type: 'array',
      of: [{ type: 'string' }],
      description: '受講後に期待できる効果',
      group: 'details',
    }),
    defineField({
      name: 'order',
      title: 'レベル番号',
      type: 'number',
      description: '🔴 必須 | 📍 表示箇所: 講座カードの「レベル X」バッジ + 並び順の制御',
      placeholder: '【必須】数字を入力（例：1, 2, 3...）',
      validation: (Rule) => Rule.required().min(0).custom(async (value, context) => {
        if (value === undefined || value === null) return true

        const { document } = context as any
        const currentId = document._id.replace(/^drafts\./, '')

        // 同じorder番号を持つ他の講座を検索
        const query = `*[_type == "course" && order == $order && !(_id in [$currentId, $draftId])]{
          _id,
          title,
          subtitle,
          order
        }`

        const duplicates = await validationClient.fetch(query, {
          order: value,
          currentId,
          draftId: `drafts.${currentId}`
        })

        if (duplicates && duplicates.length > 0) {
          const conflictCourse = duplicates[0]
          return `❌ この表示順序は既に使用されています: 【${conflictCourse.order}】「${conflictCourse.title}」（${conflictCourse.subtitle}）\n\n別のorder番号を使用してください。\n💡 ヒント: 既存の講座と重複しない番号を選んでください。`
        }

        return true
      }),
      group: 'basic',
    }),
    defineField({
      name: 'courseType',
      title: '講座タイプ',
      type: 'string',
      options: {
        list: [
          { title: '主要講座', value: 'main' },
          { title: '補助講座', value: 'auxiliary' },
        ],
        layout: 'radio',
      },
      initialValue: 'main',
      validation: (Rule) => Rule.required(),
      description: '🔴 必須 | この講座が主要講座か補助講座かを選択してください',
      group: 'basic',
    }),
    defineField({
      name: 'parentCourse',
      title: '親講座',
      type: 'reference',
      to: [{ type: 'course' }],
      description: '補助講座の場合、親となる主要講座を選択してください',
      group: 'basic',
      options: {
        filter: 'courseType == "main"',
        disableNew: true,
      },
      hidden: ({ document }) => document?.courseType !== 'auxiliary',
      validation: (Rule) => Rule.custom((current, context) => {
        const courseType = (context.document as any)?.courseType
        if (courseType === 'auxiliary' && !current) {
          return '補助講座の場合、親講座を選択してください'
        }
        if (current?._ref === (context.document as any)?._id) {
          return '自分自身を親講座に設定できません'
        }
        return true
      }),
    }),
    defineField({
      name: 'childCourseGuidance',
      title: '📢 子講座（発展コース）の設定について',
      type: 'string',
      readOnly: true,
      initialValue: '⚠️ 子講座はこの画面からは追加できません。子講座となる各講座の編集画面で、この講座を「親講座」として選択してください。',
      description: 'この講座の下に表示される「発展コース」は、子講座側の「親講座」設定で紐付けられます。',
      group: 'basic',
      hidden: ({ document }) => document?.courseType === 'auxiliary',
    }),
    defineField({
      name: 'isActive',
      title: '公開状態',
      type: 'boolean',
      initialValue: true,
      description: 'チェックを外すと非公開になります',
      group: 'basic',
    }),
    defineField({
      name: 'lastUpdated',
      title: '最終更新日',
      type: 'datetime',
      description: 'ページに表示される最終更新日（手動で設定可能。未設定の場合は自動更新日が使用されます）',
      group: 'basic',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
    }),
    defineField({
      name: 'price',
      title: '受講料',
      type: 'object',
      description: '📍 表示箇所: 講座カードの価格表示 + 講座詳細ページ',
      fields: [
        defineField({
          name: 'amount',
          title: '金額',
          type: 'number',
        }),
        defineField({
          name: 'unit',
          title: '単位',
          type: 'string',
          initialValue: '円',
        }),
        defineField({
          name: 'note',
          title: '備考',
          type: 'string',
          description: '例：税込、教材費込み',
        }),
      ],
      group: 'pricing',
    }),
    defineField({
      name: 'duration',
      title: '講座時間',
      type: 'object',
      description: '📍 表示箇所: 講座カードの時間表示 + 講座詳細ページ',
      fields: [
        defineField({
          name: 'hours',
          title: '時間数',
          type: 'number',
        }),
        defineField({
          name: 'sessions',
          title: '回数',
          type: 'number',
        }),
        defineField({
          name: 'note',
          title: '備考',
          type: 'string',
          description: '例：全6回、1回3時間',
        }),
      ],
      group: 'pricing',
    }),
    defineField({
      name: 'prerequisites',
      title: '受講条件',
      type: 'text',
      description: '受講に必要な前提条件がある場合に記入',
      group: 'details',
    }),
    defineField({
      name: 'applicationLink',
      title: '申込リンク',
      type: 'url',
      description: '外部の申込フォームがある場合のURL',
      group: 'details',
    }),
    // 講座詳細ページ用フィールド
    defineField({
      name: 'tableOfContents',
      title: '目次',
      type: 'array',
      of: [{ type: 'string' }],
      description: '詳細ページの目次項目',
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: '詳細セクション',
      type: 'array',
      of: [
        defineField({
          name: 'section',
          title: 'セクション',
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'セクションID',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'セクションタイトル',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'セクション内容',
              type: 'text',
              rows: 5,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              content: 'content',
            },
            prepare(selection) {
              const { title, content } = selection
              return {
                title: title,
                subtitle: content ? content.substring(0, 100) + '...' : '',
              }
            },
          },
        }),
      ],
      description: '詳細ページで表示するセクション',
      group: 'content',
    }),
    defineField({
      name: 'gallery',
      title: 'ギャラリー',
      type: 'array',
      of: [
        defineField({
          name: 'image',
          title: '画像',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: '代替テキスト',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
      description: '詳細ページで表示する追加画像',
      group: 'media',
    }),
    defineField({
      name: 'instructorInfo',
      title: 'インストラクター情報',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'インストラクター名',
          type: 'string',
        }),
        defineField({
          name: 'bio',
          title: '経歴・紹介',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'image',
          title: 'プロフィール画像',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: '代替テキスト',
              type: 'string',
            }),
          ],
        }),
        defineField({
          name: 'profileUrl',
          title: 'プロフィールページURL',
          type: 'url',
        }),
      ],
      description: '詳細ページで表示するインストラクター情報',
      group: 'details',
    }),
    defineField({
      name: 'relatedCourses',
      title: '関連講座',
      type: 'array',
      of: [
        defineField({
          name: 'relatedCourse',
          title: '関連講座',
          type: 'reference',
          to: [{ type: 'course' }],
        }),
      ],
      description: '詳細ページで推奨する関連講座',
      group: 'details',
    }),

    // ========== クラスターページ用フィールド ==========
    defineField({
      name: 'isClusterPage',
      title: 'クラスターページ',
      type: 'boolean',
      initialValue: false,
      description: 'このページをクラスターページ（SEO最適化された詳細ページ）として扱う場合にチェック',
      group: 'seo',
    }),
    defineField({
      name: 'faq',
      title: 'よくある質問（FAQ）',
      type: 'array',
      of: [
        defineField({
          name: 'faqItem',
          title: 'FAQ項目',
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: '質問',
              type: 'string',
              description: 'よくある質問（例：「この講座は初心者でも受講できますか？」）',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: '回答',
              type: 'text',
              rows: 4,
              description: '質問に対する詳しい回答',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
            prepare(selection) {
              const { title, subtitle } = selection
              return {
                title: title,
                subtitle: subtitle ? subtitle.substring(0, 100) + '...' : '',
              }
            },
          },
        }),
      ],
      description: 'クラスターページ用のFAQセクション（5-10個推奨）。SEOとLLMO最適化に重要。',
      group: 'content',
      validation: (Rule) => Rule.custom((value, context) => {
        const isClusterPage = (context.document as any)?.isClusterPage
        if (isClusterPage && (!value || value.length < 3)) {
          return 'クラスターページの場合、最低3つのFAQを設定してください（5-10個推奨）'
        }
        return true
      }),
    }),
    defineField({
      name: 'seo',
      title: 'SEO設定',
      type: 'seo',
      group: 'seo',
    }),
    // CTAボックス設定（講座カードの「この講座について」ボックス）
    defineField({
      name: 'ctaBox',
      title: 'CTAボックス設定',
      type: 'object',
      group: 'cta',
      description: '講座一覧ページのカードに表示される「この講座について」ボックスの設定',
      fields: [
        defineField({
          name: 'title',
          title: 'タイトル',
          type: 'string',
          initialValue: 'この講座について',
        }),
        defineField({
          name: 'subtitle',
          title: 'サブタイトル',
          type: 'string',
          initialValue: '詳細情報やお申込みはこちら',
        }),
        defineField({
          name: 'primaryButtonText',
          title: 'メインボタンテキスト',
          type: 'string',
          initialValue: '詳細を見る',
        }),
        defineField({
          name: 'primaryButtonLink',
          title: 'メインボタンリンク',
          type: 'string',
          description: '空欄の場合は /school/{courseId} へリンク',
        }),
        defineField({
          name: 'secondaryButtonText',
          title: 'サブボタンテキスト',
          type: 'string',
          initialValue: '講座詳細・お申込み →',
        }),
        defineField({
          name: 'secondaryButtonLink',
          title: 'サブボタンリンク',
          type: 'string',
          description: '外部申込フォームなどへのリンク',
        }),
      ],
    }),
    // サイドバー設定
    defineField({
      name: 'sidebar',
      title: 'サイドバー設定',
      type: 'object',
      group: 'sidebar',
      fields: [
        defineField({
          name: 'showContactButton',
          title: 'お問い合わせボタンを表示',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'contactButtonText',
          title: 'お問い合わせボタンテキスト',
          type: 'string',
          initialValue: 'お問い合わせ・お申し込み',
        }),
        defineField({
          name: 'contactButtonLink',
          title: 'お問い合わせボタンリンク',
          type: 'string',
          initialValue: '/contact',
        }),
        defineField({
          name: 'socialMedia',
          title: 'ソーシャルメディア設定',
          type: 'object',
          description: 'Facebook、Instagram、YouTubeの埋め込みURLを設定します',
          fields: [
            defineField({
              name: 'facebookUrl',
              title: 'FacebookページURL',
              type: 'url',
              description: '例: https://www.facebook.com/cafekinesi/',
              placeholder: 'https://www.facebook.com/cafekinesi/',
            }),
            defineField({
              name: 'instagramPostUrl',
              title: 'Instagram投稿URL',
              type: 'url',
              description: '埋め込みたい投稿のURL（例: https://www.instagram.com/p/DP3vzmOD-ZK/）',
              placeholder: 'https://www.instagram.com/p/DP3vzmOD-ZK/',
            }),
            defineField({
              name: 'youtubeVideoUrl',
              title: 'YouTube動画URL',
              type: 'url',
              description: '埋め込みたい動画のURL（例: https://www.youtube.com/watch?v=6HjtOD8NzYY）',
              placeholder: 'https://www.youtube.com/watch?v=6HjtOD8NzYY',
            }),
          ],
        }),
        defineField({
          name: 'customSections',
          title: 'カスタムセクション',
          type: 'array',
          of: [
            defineField({
              name: 'customSection',
              title: 'セクション',
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'セクションタイトル',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'items',
                  title: 'アイテム',
                  type: 'array',
                  of: [
                    defineField({
                      name: 'item',
                      title: 'アイテム',
                      type: 'object',
                      fields: [
                        defineField({
                          name: 'text',
                          title: 'テキスト',
                          type: 'string',
                          validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                          name: 'link',
                          title: 'リンク',
                          type: 'string',
                        }),
                      ],
                      preview: {
                        select: {
                          title: 'text',
                          subtitle: 'link',
                        },
                      },
                    }),
                  ],
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  items: 'items',
                },
                prepare(selection) {
                  const { title, items } = selection
                  return {
                    title: title,
                    subtitle: items ? `${items.length}個のアイテム` : '0個のアイテム',
                  }
                },
              },
            }),
          ],
          description: 'サイドバーに表示するカスタムセクション（カテゴリー、Facebookなど）',
        }),
      ],
    }),

    // ========== Schema.org自動生成フィールド（読み取り専用） ==========
    defineField({
      name: 'structuredData',
      title: '構造化データ（自動生成）',
      type: 'object',
      group: 'seo',
      readOnly: true,
      description: 'Webhook経由で自動生成されるSchema.org JSON-LD',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'schemaOrgType',
          title: 'Schema.orgタイプ',
          type: 'string',
          readOnly: true,
        }),
        defineField({
          name: 'jsonLd',
          title: 'JSON-LD',
          type: 'text',
          rows: 10,
          readOnly: true,
        }),
        defineField({
          name: 'generatedAt',
          title: '生成日時',
          type: 'datetime',
          readOnly: true,
        }),
      ],
    }),

    // ========== AI埋め込み用コンテンツ（自動生成） ==========
    defineField({
      name: 'aiEmbeddingContent',
      title: 'AI埋め込み用コンテンツ（自動生成）',
      type: 'text',
      group: 'ai',
      rows: 5,
      readOnly: true,
      description: 'ベクトルDBに保存されるテキスト（自動生成）',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
      order: 'order',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, subtitle, media, order, isActive } = selection
      return {
        title: `${order}. ${title}`,
        subtitle: `${subtitle} ${!isActive ? '(非公開)' : ''}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: '表示順序',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: '最終更新日（新しい順）',
      name: 'lastUpdatedDesc',
      by: [
        { field: 'lastUpdated', direction: 'desc' },
        { field: '_updatedAt', direction: 'desc' },
      ],
    },
    {
      title: '最終更新日（古い順）',
      name: 'lastUpdatedAsc',
      by: [
        { field: 'lastUpdated', direction: 'asc' },
        { field: '_updatedAt', direction: 'asc' },
      ],
    },
  ],
})