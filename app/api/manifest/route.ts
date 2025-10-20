import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

// PWA設定を取得するGROQクエリ
const PWA_SETTINGS_QUERY = `*[_type == "pwaSettings"][0]{
  basicSettings,
  designSettings,
  icons,
  shortcuts,
  advancedSettings
}`;

export async function GET() {
  try {
    // Sanityからデータ取得
    const pwaSettings = await client.fetch(PWA_SETTINGS_QUERY);

    // デフォルト設定（Sanityにデータがない場合）
    const defaultSettings = {
      name: 'カフェキネシ',
      short_name: 'カフェキネシ',
      description:
        'カフェキネシオロジーは、誰でも気軽に学べるヒーリング技術です。キネシオロジーの基礎から応用まで、段階的に学べる講座を全国で開講中。',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#8B7355',
      categories: ['education', 'lifestyle', 'health'],
      lang: 'ja',
      dir: 'ltr',
      scope: '/',
    };

    // 基本設定
    const basicSettings = pwaSettings?.basicSettings || {};
    const designSettings = pwaSettings?.designSettings || {};
    const advancedSettings = pwaSettings?.advancedSettings || {};

    // アイコン設定
    const icons: Array<{
      src: string;
      sizes: string;
      type: string;
      purpose?: string;
    }> = [];

    // Sanityからアイコン画像を取得
    const icon192 = pwaSettings?.icons?.icon192;
    const icon512 = pwaSettings?.icons?.icon512;

    if (icon192) {
      const icon192Url = urlFor(icon192).width(192).height(192).url();
      icons.push({
        src: icon192Url,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      });
    } else {
      // デフォルトアイコン
      icons.push({
        src: '/pwa-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      });
    }

    if (icon512) {
      const icon512Url = urlFor(icon512).width(512).height(512).url();
      icons.push({
        src: icon512Url,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      });
      // maskable用にも追加
      icons.push({
        src: icon512Url,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      });
    } else {
      // デフォルトアイコン
      icons.push({
        src: '/pwa-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      });
      icons.push({
        src: '/pwa-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      });
    }

    // ショートカット設定
    const shortcuts =
      pwaSettings?.shortcuts?.map((shortcut: any) => ({
        name: shortcut.name,
        short_name: shortcut.shortName || shortcut.name,
        description: shortcut.description || '',
        url: shortcut.url,
        icons: [
          {
            src: '/pwa-icon-192.png',
            sizes: '192x192',
          },
        ],
      })) || [];

    // manifest.jsonを生成
    const manifest = {
      name: basicSettings.name || defaultSettings.name,
      short_name: basicSettings.shortName || defaultSettings.short_name,
      description: basicSettings.description || defaultSettings.description,
      start_url: basicSettings.startUrl || defaultSettings.start_url,
      display: designSettings.displayMode || defaultSettings.display,
      background_color: designSettings.backgroundColor || defaultSettings.background_color,
      theme_color: designSettings.themeColor || defaultSettings.theme_color,
      icons,
      shortcuts: shortcuts.length > 0 ? shortcuts : undefined,
      categories: advancedSettings.categories || defaultSettings.categories,
      lang: advancedSettings.lang || defaultSettings.lang,
      dir: advancedSettings.dir || defaultSettings.dir,
      scope: advancedSettings.scope || defaultSettings.scope,
    };

    // manifest.jsonとして返す
    return new NextResponse(JSON.stringify(manifest, null, 2), {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1時間キャッシュ
      },
    });
  } catch (error) {
    console.error('Error generating manifest:', error);

    // エラー時はデフォルトのmanifest.jsonを返す
    const fallbackManifest = {
      name: 'カフェキネシ',
      short_name: 'カフェキネシ',
      description:
        'カフェキネシオロジーは、誰でも気軽に学べるヒーリング技術です。キネシオロジーの基礎から応用まで、段階的に学べる講座を全国で開講中。',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#8B7355',
      icons: [
        {
          src: '/pwa-icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
      categories: ['education', 'lifestyle', 'health'],
      lang: 'ja',
      dir: 'ltr',
      scope: '/',
    };

    return new NextResponse(JSON.stringify(fallbackManifest, null, 2), {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=60', // エラー時は1分キャッシュ
      },
    });
  }
}
