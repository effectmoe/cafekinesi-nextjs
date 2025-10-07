import { config } from 'dotenv';
config({ path: '.env.local' });

import { publicClient, createClient } from '@/lib/sanity.client';

// 実際のインストラクターデータ
const instructors = [
  {
    _type: 'instructor',
    name: 'AKO',
    specialties: ['フェアリーズポット', 'アロマテラピー', 'キネシオロジー'],
    bio: 'カフェキネシの創設者。20年以上のキネシオロジー実践経験を持ち、独自のメソッド「フェアリーズポット」を開発。アロマとキネシオロジーを融合させた施術が特徴。',
    profileDetails: 'フェアリーズポットクリエイター。国際キネシオロジー協会認定インストラクター。アロマテラピー上級資格保持。年間200名以上のクライアントをサポート。',
    region: '東京',
    website: 'https://cafekinesi.com',
    email: 'ako@cafekinesi.com'
  },
  {
    _type: 'instructor',
    name: '山田花子',
    specialties: ['ピーチタッチ', 'ストレス解放', 'セルフケア指導'],
    bio: '10年のキネシオロジー経験を活かし、初心者にも分かりやすいピーチタッチを指導。日常のストレス解放に特化したセッションが人気。',
    profileDetails: 'ピーチタッチ認定インストラクター。カフェキネシⅠ〜Ⅵ全コース修了。企業向けストレスマネジメント研修講師としても活動。',
    region: '神奈川',
    website: 'https://example.com/yamada',
    email: 'yamada@example.com'
  },
  {
    _type: 'instructor',
    name: '佐藤健一',
    specialties: ['カフェキネシⅥ', 'ハッピーオーラ', 'エネルギーワーク'],
    bio: 'エネルギーワークのスペシャリスト。オーラを整えることで、心身のバランスを取り戻すセッションを提供。',
    profileDetails: 'カフェキネシⅥハッピーオーラ認定インストラクター。レイキマスター。チャクラバランシング指導者。',
    region: '大阪',
    website: 'https://example.com/sato',
    email: 'sato@example.com'
  },
  {
    _type: 'instructor',
    name: '鈴木美咲',
    specialties: ['親子キネシ', 'ベビーケア', 'ファミリーセッション'],
    bio: '子育て中のママたちに寄り添うインストラクター。親子で楽しめるキネシオロジーセッションが好評。',
    profileDetails: '親子キネシオロジー認定インストラクター。保育士資格保持。3児の母として実践的なアドバイスも提供。',
    region: '名古屋',
    website: 'https://example.com/suzuki',
    email: 'suzuki@example.com'
  },
  {
    _type: 'instructor',
    name: '田中太郎',
    specialties: ['スポーツキネシ', 'パフォーマンス向上', 'リカバリー'],
    bio: 'アスリート向けのキネシオロジーを専門とし、パフォーマンス向上とリカバリーをサポート。',
    profileDetails: 'スポーツキネシオロジー専門家。元プロアスリート。スポーツトレーナー資格保持。',
    region: '福岡',
    website: 'https://example.com/tanaka',
    email: 'tanaka@example.com'
  },
  {
    _type: 'instructor',
    name: '渡辺由美',
    specialties: ['瞑想キネシ', 'マインドフルネス', '呼吸法'],
    bio: '瞑想とキネシオロジーを組み合わせた独自のアプローチで、深い癒しと気づきを提供。',
    profileDetails: '瞑想指導者。マインドフルネス認定講師。ヨガインストラクター。呼吸法マスター。',
    region: '京都',
    website: 'https://example.com/watanabe',
    email: 'watanabe@example.com'
  }
];

async function populateInstructors() {
  try {
    const client = createClient(process.env.SANITY_API_TOKEN!);

    console.log('🚀 インストラクターデータの投入開始...\n');

    for (const instructor of instructors) {
      const doc = {
        ...instructor,
        _id: instructor.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        slug: {
          _type: 'slug',
          current: instructor.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
        }
      };

      const result = await client.createOrReplace(doc);
      console.log(`✅ ${instructor.name} を追加/更新しました`);
    }

    console.log('\n✨ 全インストラクターの投入が完了しました！');

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

// 実行
populateInstructors();