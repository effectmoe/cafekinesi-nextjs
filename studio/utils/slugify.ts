import * as wanakana from 'wanakana'

// 意味的な変換マップ（漢字・カタカナ語 → 英語）
const semanticMappings: { [key: string]: string } = {
  // 漢字複合語
  '呼吸法': 'breathing-method',
  'ストレス解放': 'stress-relief',
  '日常': 'daily',
  '心と身体': 'mind-body',
  '整える': 'balance',
  '新しい朝': 'new-morning',
  '住まいづくり': 'home-design',
  '内側から美しく': 'inner-beauty',
  '庭づくり': 'garden-making',
  '由来': 'natural',
  // カタカナ語（意味変換したいもの）
  'マインドフルネス': 'mindfulness',
  'アロマテラピー': 'aromatherapy',
  'スキンケア': 'skincare',
  'マッサージ': 'massage',
  'ヨガ': 'yoga',
  // 単漢字・短い語
  '呼吸': 'breathing',
  '瞑想': 'meditation',
  '癒し': 'healing',
  '健康': 'healthy',
  '自然': 'nature',
  '調和': 'harmony',
  '美': 'beauty',
  '心': 'mind',
  '朝': 'morning',
  '庭': 'garden',
  '時間': 'time',
  '空間': 'space',
  '習慣': 'routine',
  '食事': 'eating',
  '技法': 'techniques',
  '機能': 'function',
  '記事': 'post',
  'テスト': 'test',
  // インストラクター用
  '先生': 'sensei',
  'インストラクター': 'instructor',
}

/**
 * 日本語対応のスラッグ生成関数
 * @param input - 変換元の文字列（日本語可）
 * @param fallbackPrefix - 空文字列時のフォールバックプレフィックス（デフォルト: 'item'）
 * @returns URL用スラッグ
 */
export function japaneseSlugify(input: string, fallbackPrefix: string = 'item'): string {
  if (!input) return ''

  let processed = input

  // 1. 意味的な変換を適用（長い文字列を優先するためキーをソート）
  const sortedKeys = Object.keys(semanticMappings).sort((a, b) => b.length - a.length)
  for (const key of sortedKeys) {
    processed = processed.replace(new RegExp(key, 'g'), semanticMappings[key])
  }

  // 2. wanakanaでひらがな・カタカナをローマ字に変換
  processed = wanakana.toRomaji(processed)

  // 3. クリーニングとフォーマット
  const slug = processed
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // 半角英数字、スペース、ハイフン以外を削除
    .replace(/\s+/g, '-')      // スペースをハイフンに
    .replace(/-+/g, '-')       // 連続するハイフンを統合
    .replace(/^-|-$/g, '')     // 前後のハイフン削除

  return slug || `${fallbackPrefix}-${Date.now()}`
}

/**
 * ブログ記事用スラッグ生成（フォールバック: 'post'）
 */
export function blogSlugify(input: string): string {
  return japaneseSlugify(input, 'post')
}

/**
 * インストラクター用スラッグ生成（フォールバック: 'instructor'）
 */
export function instructorSlugify(input: string): string {
  return japaneseSlugify(input, 'instructor')
}
