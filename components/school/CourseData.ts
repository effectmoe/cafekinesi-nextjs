import { Course } from '@/lib/types/course'

export const defaultCoursesData: Omit<Course, '_id'>[] = [
  {
    courseId: 'kinesi1',
    title: 'カフェキネシⅠ',
    subtitle: '基礎セラピー講座',
    description: 'どこでも癒やせるセラピストになれるカフェキネシオロジーの第一歩。どなたでも身近なストレスを取ることができる実習中心の講座です。',
    features: [
      'ひとつのストレスの解消までが約10秒',
      'インストラクター認定講座では12時間でインストラクターになれます',
      'キネシオロジーとアロマの融合を学習'
    ],
    image: {
      asset: {
        url: '/images/school/kinesi1.webp'
      },
      alt: 'カフェキネシⅠ ハンドアウト'
    },
    backgroundClass: 'album-beige',
    recommendations: [],
    effects: [],
    order: 1,
    isActive: true
  },
  {
    courseId: 'peach-touch',
    title: 'カフェキネシⅡ',
    subtitle: 'ピーチタッチ',
    description: '誰でもどこでも自分でストレスが取れる、キネシアロマを使った世界最速のキネシセラピーです。',
    features: [
      'セラピストでなくても大丈夫',
      '必要なのはあなたの愛と出なとの手',
      '「カフェキネシ」のアロマを使いセルフケア'
    ],
    image: {
      asset: {
        url: '/images/school/peach-touch.webp'
      },
      alt: 'カフェキネシⅡ ピーチタッチ ハンドアウト'
    },
    backgroundClass: 'album-blue-gray',
    recommendations: [],
    effects: [],
    order: 2,
    isActive: true
  },
  {
    courseId: 'chakra-kinesi',
    title: 'カフェキネシⅢ',
    subtitle: 'チャクラキネシ',
    description: '毎日がなんとなく充実感がない、傷つくのが怖くて前に進めない、自分の気持ちの表現ができない。あなたのチャクラは元気ですか？',
    features: [
      'チャクラのバランスを整える',
      '本来の自分を取り戻す',
      'エネルギーの流れを活性化'
    ],
    image: {
      asset: {
        url: '/images/school/chakra.webp'
      },
      alt: 'カフェキネシⅢ チャクラキネシ ハンドアウト'
    },
    backgroundClass: 'album-purple',
    recommendations: [],
    effects: [],
    order: 3,
    isActive: true
  },
  {
    courseId: 'help',
    title: 'カフェキネシⅣ',
    subtitle: 'ＨＥＬＰ',
    description: 'チャクラキネシの応用コースです。心の中にある感情のわだかまりを解放し、より深い癒しを実現します。',
    features: [
      'チャクラキネシによるセルフケア',
      '子供の成長をサポート',
      '自分や家族の心の浄化'
    ],
    image: {
      asset: {
        url: '/images/school/help.webp'
      },
      alt: 'カフェキネシⅣ HELP インストラクターコース'
    },
    backgroundClass: 'album-teal',
    recommendations: [],
    effects: [],
    order: 4,
    isActive: true
  },
  {
    courseId: 'tao',
    title: 'カフェキネシⅤ',
    subtitle: 'ＴＡＯ　道',
    description: '東洋の叡智「道」の思想とキネシオロジーを融合させた深遠なセラピー技術を学びます。',
    features: [
      '陰陽五行の理論を実践',
      'エネルギーバランスの調整',
      '東洋医学的アプローチ'
    ],
    image: {
      asset: {
        url: '/images/school/tao.webp'
      },
      alt: 'TAO 道 Cafe Kinesi V'
    },
    backgroundClass: 'album-light-gray',
    recommendations: [],
    effects: [],
    order: 5,
    isActive: true
  },
  {
    courseId: 'happy-aura',
    title: 'カフェキネシⅥ',
    subtitle: 'ハッピーオーラ',
    description: '誰でも、どこでも出来るアロマキネシオロジーセラピー',
    features: [
      'オーラを整えるテクニック',
      'アロマを使った幸せ体質づくり',
      'インストラクター資格取得可能'
    ],
    image: {
      asset: {
        url: '/images/school/happy-aura.webp'
      },
      alt: 'カフェキネシⅥ ハッピーオーラインストラクターコース'
    },
    backgroundClass: 'album-beige',
    recommendations: [],
    effects: [],
    order: 6,
    isActive: true
  }
]