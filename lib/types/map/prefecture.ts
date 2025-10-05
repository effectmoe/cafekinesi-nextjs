// Prefecture type definitions for Japan map

export interface Prefecture {
  id: string
  name: string
  nameEn: string
  region: string
  coordinates: [number, number] // [longitude, latitude]
  instructorCount?: number
}

export interface PrefectureInfo {
  [key: string]: {
    name: string
    nameEn: string
    region: string
    coordinates: [number, number]
  }
}

export type RegionType =
  | '北海道'
  | '東北'
  | '関東'
  | '中部'
  | '近畿'
  | '中国'
  | '四国'
  | '九州・沖縄'
