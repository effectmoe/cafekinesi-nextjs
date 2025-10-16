// FAQ型定義

export interface FAQ {
  _id: string
  question: string
  answer: string
  category: string
  order: number
}

// カテゴリー名のマッピング（英語キー → 日本語表示名）
export const CATEGORY_LABELS: Record<string, string> = {
  kinesi: 'キネシオロジーについて',
  beginner: '初心者向け',
  course: '講座について',
  price: '料金・支払い',
  cancel: 'キャンセル・変更',
  instructor: 'インストラクターについて',
  session: 'セッションについて',
  booking: '予約・申込について',
  venue: '会場・アクセスについて',
  other: 'その他',
}
