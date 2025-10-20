export default {
  name: 'pwaSettings',
  type: 'document',
  title: 'PWA設定',
  icon: () => '📱',
  description: '📍 使用箇所: PWA（Progressive Web App）設定 | ステータス: ✅ 最新 | アプリのインストール設定を管理（シングルトン）',
  __experimental_actions: ['update', 'publish'], // create, deleteを無効化（シングルトン）
  fields: [
    // ========== 基本設定 ==========
    {
      name: 'basicSettings',
      type: 'object',
      title: '基本設定',
      description: 'アプリの基本的な情報を設定します',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'name',
          type: 'string',
          title: 'アプリ名（フル）',
          description: 'アプリの正式名称（例: カフェキネシ）',
          initialValue: 'カフェキネシ',
          validation: (Rule: any) => Rule.required().max(50),
        },
        {
          name: 'shortName',
          type: 'string',
          title: 'アプリ名（短縮）',
          description: 'ホーム画面に表示される短い名前（12文字以内推奨）',
          initialValue: 'カフェキネシ',
          validation: (Rule: any) => Rule.required().max(12),
        },
        {
          name: 'description',
          type: 'text',
          title: '説明文',
          description: 'アプリの説明（インストール時に表示される場合があります）',
          rows: 3,
          initialValue: 'カフェキネシオロジーは、誰でも気軽に学べるヒーリング技術です。キネシオロジーの基礎から応用まで、段階的に学べる講座を全国で開講中。',
          validation: (Rule: any) => Rule.max(300),
        },
        {
          name: 'startUrl',
          type: 'string',
          title: '起動URL',
          description: 'アプリを開いたときに最初に表示されるページ',
          initialValue: '/',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },

    // ========== デザイン設定 ==========
    {
      name: 'designSettings',
      type: 'object',
      title: 'デザイン設定',
      description: 'アプリの見た目を設定します',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'themeColor',
          type: 'string',
          title: 'テーマカラー',
          description: 'アプリバーやタブの色（例: #8B7355）',
          initialValue: '#8B7355',
          validation: (Rule: any) =>
            Rule.required().custom((value: string) => {
              if (!/^#[0-9A-F]{6}$/i.test(value)) {
                return 'HEX形式で入力してください（例: #8B7355）';
              }
              return true;
            }),
        },
        {
          name: 'backgroundColor',
          type: 'string',
          title: '背景色',
          description: 'スプラッシュスクリーンの背景色（例: #ffffff）',
          initialValue: '#ffffff',
          validation: (Rule: any) =>
            Rule.required().custom((value: string) => {
              if (!/^#[0-9A-F]{6}$/i.test(value)) {
                return 'HEX形式で入力してください（例: #ffffff）';
              }
              return true;
            }),
        },
        {
          name: 'displayMode',
          type: 'string',
          title: '表示モード',
          description: 'アプリの表示方法を選択',
          options: {
            list: [
              { title: 'スタンドアロン（推奨）- アプリのように表示', value: 'standalone' },
              { title: 'フルスクリーン - 全画面表示', value: 'fullscreen' },
              { title: 'ミニマルUI - 最小限のブラウザUI', value: 'minimal-ui' },
              { title: 'ブラウザ - 通常のブラウザ表示', value: 'browser' },
            ],
          },
          initialValue: 'standalone',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },

    // ========== アイコン設定 ==========
    {
      name: 'icons',
      type: 'object',
      title: 'アイコン設定',
      description: 'アプリアイコンを設定します（192x192px、512x512px推奨）',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'icon192',
          type: 'image',
          title: 'アイコン 192x192',
          description: '通常サイズのアイコン（192x192px）',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'icon512',
          type: 'image',
          title: 'アイコン 512x512',
          description: '高解像度アイコン（512x512px）',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'appleIcon',
          type: 'image',
          title: 'Apple Touch Icon',
          description: 'iOS用アイコン（180x180px）',
          options: {
            hotspot: true,
          },
        },
      ],
    },

    // ========== ショートカット設定 ==========
    {
      name: 'shortcuts',
      type: 'array',
      title: 'アプリショートカット',
      description: 'アプリアイコンを長押しした時に表示されるショートカット（最大4個推奨）',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'ショートカット名',
              description: '例: イベント一覧',
              validation: (Rule: any) => Rule.required().max(30),
            },
            {
              name: 'shortName',
              type: 'string',
              title: '短縮名',
              description: '短い名前（例: イベント）',
              validation: (Rule: any) => Rule.max(12),
            },
            {
              name: 'description',
              type: 'text',
              title: '説明',
              description: 'このショートカットの説明',
              rows: 2,
              validation: (Rule: any) => Rule.max(100),
            },
            {
              name: 'url',
              type: 'string',
              title: 'URL',
              description: 'ショートカットをタップした時に開くページ（例: /calendar）',
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'url',
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.max(4),
    },

    // ========== 高度な設定 ==========
    {
      name: 'advancedSettings',
      type: 'object',
      title: '高度な設定',
      description: 'カテゴリや言語などの詳細設定',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'categories',
          type: 'array',
          title: 'カテゴリ',
          description: 'アプリのカテゴリを選択（検索やフィルタリングに使用）',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: '教育 (Education)', value: 'education' },
              { title: 'ライフスタイル (Lifestyle)', value: 'lifestyle' },
              { title: '健康・フィットネス (Health)', value: 'health' },
              { title: 'ウェルネス (Wellness)', value: 'wellness' },
              { title: 'ビジネス (Business)', value: 'business' },
              { title: 'エンターテインメント (Entertainment)', value: 'entertainment' },
            ],
          },
          initialValue: ['education', 'lifestyle', 'health'],
        },
        {
          name: 'lang',
          type: 'string',
          title: '言語',
          description: 'アプリの主要言語',
          options: {
            list: [
              { title: '日本語', value: 'ja' },
              { title: '英語', value: 'en' },
              { title: '中国語（簡体字）', value: 'zh-CN' },
              { title: '韓国語', value: 'ko' },
            ],
          },
          initialValue: 'ja',
        },
        {
          name: 'dir',
          type: 'string',
          title: '文字方向',
          description: 'テキストの読む方向',
          options: {
            list: [
              { title: '左から右 (LTR)', value: 'ltr' },
              { title: '右から左 (RTL)', value: 'rtl' },
              { title: '自動', value: 'auto' },
            ],
          },
          initialValue: 'ltr',
        },
        {
          name: 'scope',
          type: 'string',
          title: 'スコープ',
          description: 'PWAとして扱うURLの範囲（通常は"/"）',
          initialValue: '/',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'basicSettings.name',
      subtitle: 'basicSettings.description',
    },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return {
        title: title || 'PWA設定',
        subtitle: subtitle ? `${subtitle.substring(0, 60)}...` : '設定を編集してください',
      };
    },
  },
};
