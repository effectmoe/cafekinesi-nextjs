// イベント用の型定義
export interface Event {
  _id: string
  title: string
  titleEn?: string
  slug: {
    current: string
  }
  description?: any[] // Portable Text
  descriptionEn?: any[]
  startDate: string
  endDate: string
  location?: string
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
  registrationUrl?: string
  capacity?: number
  currentParticipants?: number
  fee?: number
  status: 'open' | 'full' | 'closed' | 'cancelled'
  category?: 'course' | 'session' | 'information' | 'workshop' | 'other'
  instructor?: {
    _id: string
    name: string
    slug: {
      current: string
    }
  }
  tags?: string[]
  useForAI?: boolean
  aiSearchText?: string
}

// カレンダー表示用の簡略版
export interface EventSummary {
  _id: string
  title: string
  startDate: string
  endDate: string
  status: string
  category?: string
  availableSeats?: number
}

// イベントフィルター用
export interface EventFilter {
  startDate?: string
  endDate?: string
  status?: string[]
  category?: string[]
  hasAvailableSeats?: boolean
}
