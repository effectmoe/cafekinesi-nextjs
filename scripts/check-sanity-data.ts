import { config } from 'dotenv';
import { publicClient } from '../lib/sanity.client';

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' });

async function checkSanityData() {
  console.log('🔍 Sanityデータ構造確認開始...\n');

  try {
    // インストラクターデータを取得
    console.log('📄 インストラクターデータを取得中...');
    const instructors = await publicClient.fetch('*[_type == "instructor"]');

    if (instructors && instructors.length > 0) {
      console.log(`✅ ${instructors.length}件のインストラクターが見つかりました\n`);

      instructors.forEach((instructor: any, index: number) => {
        console.log(`${index + 1}. インストラクター詳細:`);
        console.log(`   _id: ${instructor._id}`);
        console.log(`   _type: ${instructor._type}`);
        console.log(`   name: ${instructor.name || 'なし'}`);
        console.log(`   title: ${instructor.title || 'なし'}`);
        console.log(`   specialization: ${instructor.specialization || 'なし'}`);
        console.log(`   biography: ${instructor.biography || 'なし'}`);
        console.log(`   region: ${instructor.region || 'なし'}`);
        console.log(`   certifications: ${instructor.certifications || 'なし'}`);
        console.log(`   description: ${instructor.description || 'なし'}`);
        console.log(`   experience: ${instructor.experience || 'なし'}`);
        console.log(`   location: ${instructor.location || 'なし'}`);
        console.log(`   所有フィールド:`, Object.keys(instructor));
        console.log('');
      });
    } else {
      console.log('❌ インストラクターデータが見つかりませんでした');
    }

    // その他のタイプも確認
    const otherTypes = ['course', 'blogPost', 'homepage', 'aboutPage', 'schoolPage', 'instructorPage'];

    for (const type of otherTypes) {
      console.log(`📄 ${type} データを確認中...`);
      const items = await publicClient.fetch(`*[_type == "${type}"]`);

      if (items && items.length > 0) {
        console.log(`✅ ${type}: ${items.length}件`);
        // 最初の1件のフィールドを確認
        if (items[0]) {
          console.log(`   サンプルフィールド:`, Object.keys(items[0]));
          console.log(`   title/name: ${items[0].title || items[0].name || 'なし'}`);
        }
      } else {
        console.log(`⚠️ ${type}: データなし`);
      }
    }

  } catch (error) {
    console.error('❌ エラーが発生:', error);
  }
}

// 実行
checkSanityData();