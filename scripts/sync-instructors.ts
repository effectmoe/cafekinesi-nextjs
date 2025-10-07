#!/usr/bin/env npx tsx

import { config } from 'dotenv';
import { publicClient } from '../lib/sanity.client';
import { VercelVectorStore } from '../lib/vector/vercel-vector-store';

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' });

async function syncInstructors() {
  console.log('🚀 インストラクターデータ同期開始...');

  try {
    // 1. Sanityから全インストラクターを取得
    console.log('📊 Sanityからインストラクターデータを取得中...');
    const instructors = await publicClient.fetch(`
      *[_type == "instructor"] {
        _id,
        _type,
        _updatedAt,
        name,
        location,
        specialties,
        experience,
        description,
        slug,
        image,
        socialLinks,
        courses[]-> {
          _id,
          title
        }
      }
    `);

    console.log(`✅ ${instructors.length}名のインストラクターを取得`);

    if (instructors.length === 0) {
      console.log('⚠️ インストラクターが見つかりません');
      return;
    }

    // インストラクター名を表示
    console.log('インストラクター一覧:');
    instructors.forEach((instructor: any) => {
      console.log(`  - ${instructor.name || 'Unknown'} (${instructor.location || 'Location unknown'})`);
    });

    // 2. ベクトルストア初期化
    console.log('\n🔧 ベクトルストアを初期化中...');
    const vectorStore = new VercelVectorStore();
    await vectorStore.initialize();

    // 3. インストラクターごとにドキュメントを作成
    console.log('\n📝 ドキュメントを作成中...');
    const documents = instructors.map((instructor: any) => {
      // 詳細なテキスト表現を作成
      const specialtiesText = instructor.specialties?.join(', ') || '';
      const coursesText = instructor.courses?.map((c: any) => c.title).join(', ') || '';

      const content = `
インストラクター: ${instructor.name || 'Unknown'}
専門分野: ${specialtiesText || '情報なし'}
経歴: ${instructor.experience || '情報なし'}
活動地域: ${instructor.location || '情報なし'}
担当コース: ${coursesText || '情報なし'}
紹介: ${instructor.description || ''}

このインストラクターは${instructor.location || ''}で活動しており、${specialtiesText}を専門としています。
${instructor.experience ? `${instructor.experience}の経験があります。` : ''}
${coursesText ? `${coursesText}などのコースを担当しています。` : ''}
`.trim();

      return {
        content,
        metadata: {
          id: instructor._id,
          type: 'instructor',
          name: instructor.name,
          location: instructor.location,
          specialties: instructor.specialties,
          slug: instructor.slug?.current || instructor.name?.toLowerCase().replace(/\s+/g, '-'),
          updatedAt: instructor._updatedAt
        },
        source: 'sanity-instructor-sync'
      };
    });

    // 4. ベクトルストアに追加
    console.log('\n🎯 ベクトルストアに追加中...');
    await vectorStore.addDocuments(documents);

    console.log('\n✨ 同期完了！');
    console.log(`合計 ${documents.length} 件のインストラクターデータを同期しました`);

  } catch (error) {
    console.error('❌ エラー:', error);
    process.exit(1);
  }
}

// 実行
syncInstructors();