import { config } from 'dotenv';
import { resolve } from 'path';
import { groq } from 'next-sanity';
import { previewClient } from '../lib/sanity.client';

config({ path: resolve(process.cwd(), '.env.local') });

async function checkSpecificPost() {
  const documentId = '648cec8e-2c1c-4e87-a8fe-803edfaaa8bd';

  console.log('🔍 特定のブログ記事の詳細を確認中...\n');
  console.log('📋 Document ID:', documentId);
  console.log('');

  try {
    // ドラフトも含めて取得
    const post = await previewClient.fetch(groq`
      *[_id == "${documentId}" || _id == "drafts.${documentId}"][0] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        slug,
        excerpt,
        tldr,
        mainImage,
        content,
        publishedAt,
        author,
        category,
        tags,
        featured,
        "hasSlug": defined(slug.current),
        "slugValue": slug.current,
        "hasTitle": defined(title),
        "hasContent": defined(content),
        "contentLength": length(content),
        "hasMainImage": defined(mainImage),
        "hasPublishedAt": defined(publishedAt)
      }
    `);

    if (!post) {
      console.log('❌ 記事が見つかりませんでした');
      console.log('');
      console.log('💡 この記事は削除された可能性があります。');
      return;
    }

    console.log('✅ 記事が見つかりました\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('基本情報:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ID:', post._id);
    console.log('タイプ:', post._type);
    console.log('ドラフト:', post._id.startsWith('drafts.') ? 'はい' : 'いいえ');
    console.log('作成日:', post._createdAt);
    console.log('更新日:', post._updatedAt);
    console.log('');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('必須フィールドの状態:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('タイトル:', post.hasTitle ? `✅ "${post.title}"` : '❌ 未設定');
    console.log('スラッグ:', post.hasSlug ? `✅ "${post.slugValue}"` : '❌ 未設定 ← これが原因！');
    console.log('コンテンツ:', post.hasContent ? `✅ (${post.contentLength}ブロック)` : '❌ 未設定');
    console.log('メイン画像:', post.hasMainImage ? '✅ 設定済み' : '⚠️  未設定');
    console.log('公開日:', post.hasPublishedAt ? `✅ ${post.publishedAt}` : '⚠️  未設定');
    console.log('');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('オプションフィールド:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('抜粋:', post.excerpt ? `✅ "${post.excerpt.substring(0, 50)}..."` : '⚠️  未設定');
    console.log('要約:', post.tldr ? `✅ "${post.tldr.substring(0, 50)}..."` : '⚠️  未設定');
    console.log('カテゴリ:', post.category || '未設定');
    console.log('タグ:', post.tags?.length > 0 ? post.tags.join(', ') : '未設定');
    console.log('注目記事:', post.featured ? 'はい' : 'いいえ');
    console.log('著者:', post.author?.name || '未設定');
    console.log('');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('診断結果:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const issues: string[] = [];
    if (!post.hasSlug) {
      issues.push('🚨 スラッグが未設定です。これがプレビューエラーの主な原因です。');
    }
    if (!post.hasTitle) {
      issues.push('⚠️  タイトルが未設定です。');
    }
    if (!post.hasContent) {
      issues.push('⚠️  コンテンツが未設定です。');
    }

    if (issues.length > 0) {
      console.log('❌ 以下の問題が見つかりました:\n');
      issues.forEach(issue => console.log(issue));
      console.log('');
      console.log('🔧 解決方法:');
      console.log('1. Sanity Studioで記事を開く');
      console.log('2. スラッグフィールドに値を入力（例: "dental-health" など）');
      console.log('3. タイトルとコンテンツも入力');
      console.log('4. 保存してから再度プレビューを試す');
    } else {
      console.log('✅ 必須フィールドは全て設定されています。');
      console.log('');
      console.log('💡 プレビューURLは以下のようになるはずです:');
      console.log(`   /blog/${post.slugValue}?preview=true`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkSpecificPost();
