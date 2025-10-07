import { createClient } from '@sanity/client';
import { config } from 'dotenv';

// .env.localファイルを読み込み
config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2024-01-06'
});

// インストラクターの詳細情報を更新
const instructorUpdates = [
  {
    name: 'フェアリーズポット AKO',
    updates: {
      bio: 'カフェキネシの認定インストラクターとして、北海道を拠点に活動しています。優しく丁寧な指導で、初心者から上級者まで幅広くサポートします。',
      specialties: ['キネシオロジー基礎', '個人セッション', 'グループワーク'],
      profileDetails: '10年以上の指導経験を持ち、延べ500人以上のクライアントをサポートしてきました。心と体のバランスを整えることを大切にしています。'
    }
  },
  {
    name: '煌めきの箱庭',
    updates: {
      bio: 'エネルギーワークとキネシオロジーを組み合わせた独自のメソッドで、クライアントの潜在能力を引き出します。',
      specialties: ['エネルギーヒーリング', 'チャクラバランシング', '瞑想指導'],
      profileDetails: '北海道の自然豊かな環境で、心身の調和を大切にしたセッションを提供しています。オンラインセッションも対応可能です。'
    }
  },
  {
    name: 'セッションルーム LuLu Harmonia（ルル・ハルモニーア）',
    updates: {
      bio: '音と振動を取り入れた独自のキネシオロジーセッションを提供。心地よい空間で深いリラクゼーションを体験できます。',
      specialties: ['サウンドヒーリング', 'ボディワーク', 'ストレス解放'],
      profileDetails: '完全予約制のプライベートサロンで、一人ひとりに合わせたオーダーメイドのセッションを提供しています。'
    }
  },
  {
    name: 'Wisteria Guérison《ウィステリア・グリソン》',
    updates: {
      bio: 'フランス式のキネシオロジーと日本の伝統的な手技を融合させた、独自のヒーリングメソッドを確立。',
      specialties: ['フレンチキネシオロジー', 'レイキヒーリング', '感情解放テクニック'],
      profileDetails: '国際的な資格を複数保有し、日本とヨーロッパでの豊富な臨床経験を活かした質の高いセッションを提供しています。',
      website: 'https://wisteria-guerison.com'
    }
  },
  {
    name: 'HSK Kinesiology',
    updates: {
      bio: 'アメリカ最先端のキネシオロジー技術とカイロプラクティックを組み合わせた、統合的なアプローチを提供しています。',
      specialties: ['スポーツキネシオロジー', '姿勢矯正', 'パフォーマンス向上'],
      profileDetails: 'プロアスリートから一般の方まで、幅広いクライアントの身体機能向上をサポート。科学的根拠に基づいた施術を行います。',
      email: 'info@hsk-kinesiology.com',
      website: 'https://hsk-kinesiology.com'
    }
  },
  {
    name: 'Harmony Light',
    updates: {
      bio: 'ヨーロッパの伝統的なヒーリング技術とモダンなキネシオロジーを融合させた、ホリスティックなアプローチを提供。',
      specialties: ['ホリスティックヒーリング', 'アロマセラピー', 'クリスタルヒーリング'],
      profileDetails: 'ヨーロッパ各地で学んだ様々なヒーリング技術を統合し、心身魂のバランスを整えるセッションを提供しています。',
      website: 'https://harmony-light.eu'
    }
  }
];

async function updateInstructorContent() {
  console.log('🚀 インストラクター情報更新開始...\n');

  try {
    // 既存のインストラクターを取得
    const instructors = await client.fetch('*[_type == "instructor"]');
    console.log(`📄 ${instructors.length}件のインストラクターを取得\n`);

    for (const instructor of instructors) {
      // 更新データを検索
      const updateData = instructorUpdates.find(u => u.name === instructor.name);

      if (updateData) {
        console.log(`📝 ${instructor.name} を更新中...`);

        try {
          await client
            .patch(instructor._id)
            .set(updateData.updates)
            .commit();

          console.log(`✅ ${instructor.name} 更新完了`);
        } catch (error: any) {
          console.error(`❌ ${instructor.name} 更新エラー:`, error.message);
        }
      } else {
        console.log(`⚠️ ${instructor.name} の更新データなし`);
      }
    }

    console.log('\n✅ インストラクター情報更新完了！');

    // 更新結果を確認
    console.log('\n📊 更新後の確認:');
    const updatedInstructors = await client.fetch('*[_type == "instructor"]');

    for (const instructor of updatedInstructors) {
      console.log(`\n${instructor.name}:`);
      console.log(`  bio: ${instructor.bio ? '✓' : '✗'}`);
      console.log(`  specialties: ${instructor.specialties ? '✓' : '✗'}`);
      console.log(`  profileDetails: ${instructor.profileDetails ? '✓' : '✗'}`);
    }

  } catch (error) {
    console.error('❌ エラーが発生:', error);
    process.exit(1);
  }
}

// 実行
updateInstructorContent();