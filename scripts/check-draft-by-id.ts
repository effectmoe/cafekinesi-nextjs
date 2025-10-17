import { config } from 'dotenv';
import { resolve } from 'path';
import { groq } from 'next-sanity';
import { previewClient } from '../lib/sanity.client';

config({ path: resolve(process.cwd(), '.env.local') });

async function checkDraftById() {
  const documentId = '648cec8e-2c1c-4e87-a8fe-803edfaaa8bd';

  console.log('🔍 ドラフト記事の確認中...\n');
  console.log('📋 Document ID:', documentId);
  console.log('🔑 API Token:', process.env.SANITY_API_TOKEN ? '設定済み' : '未設定');
  console.log('🔑 Public API Token:', process.env.NEXT_PUBLIC_SANITY_API_TOKEN ? '設定済み' : '未設定');
  console.log('');

  try {
    // 1. drafts.プレフィックス付きで検索
    console.log('【1. drafts.プレフィックス付きで検索】');
    const draftResult = await previewClient.fetch(groq`
      *[_id == "drafts.${documentId}"][0] {
        _id,
        _type,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt
      }
    `);

    if (draftResult) {
      console.log('✅ 見つかりました（ドラフト）');
      console.log('   ID:', draftResult._id);
      console.log('   タイプ:', draftResult._type);
      console.log('   タイトル:', draftResult.title);
      console.log('   スラッグ:', draftResult.slug);
      console.log('   公開日:', draftResult.publishedAt || '未設定');
      console.log('');
    } else {
      console.log('❌ 見つかりませんでした');
      console.log('');
    }

    // 2. プレフィックスなしで検索
    console.log('【2. プレフィックスなしで検索】');
    const publishedResult = await previewClient.fetch(groq`
      *[_id == "${documentId}"][0] {
        _id,
        _type,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt
      }
    `);

    if (publishedResult) {
      console.log('✅ 見つかりました（公開済み）');
      console.log('   ID:', publishedResult._id);
      console.log('   タイプ:', publishedResult._type);
      console.log('   タイトル:', publishedResult.title);
      console.log('   スラッグ:', publishedResult.slug);
      console.log('   公開日:', publishedResult.publishedAt || '未設定');
      console.log('');
    } else {
      console.log('❌ 見つかりませんでした');
      console.log('');
    }

    // 3. _idでマッチングを試みる（ワイルドカード）
    console.log('【3. IDマッチング（ワイルドカード）】');
    const wildcardResult = await previewClient.fetch(groq`
      *[_id match "*${documentId}*"][0...5] {
        _id,
        _type,
        title,
        "slug": slug.current
      }
    `);

    if (wildcardResult && wildcardResult.length > 0) {
      console.log(`✅ ${wildcardResult.length}件見つかりました`);
      wildcardResult.forEach((doc: any, index: number) => {
        console.log(`   ${index + 1}. ID: ${doc._id}`);
        console.log(`      タイトル: ${doc.title}`);
        console.log(`      スラッグ: ${doc.slug}`);
      });
      console.log('');
    } else {
      console.log('❌ 見つかりませんでした');
      console.log('');
    }

    // 4. 最近のブログ記事ドラフトを全て取得
    console.log('【4. 最近のブログ記事ドラフト（全件）】');
    const allDrafts = await previewClient.fetch(groq`
      *[_type == "blogPost"][0...10] | order(_updatedAt desc) {
        _id,
        title,
        "slug": slug.current,
        "isDraft": _id in path("drafts.*")
      }
    `);

    if (allDrafts && allDrafts.length > 0) {
      console.log(`✅ ${allDrafts.length}件のブログ記事が見つかりました`);
      allDrafts.forEach((doc: any, index: number) => {
        console.log(`   ${index + 1}. ${doc.isDraft ? '[ドラフト]' : '[公開済み]'} ${doc.title}`);
        console.log(`      ID: ${doc._id}`);
        console.log(`      スラッグ: ${doc.slug}`);
      });
    } else {
      console.log('❌ ブログ記事が見つかりませんでした');
    }

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkDraftById();
