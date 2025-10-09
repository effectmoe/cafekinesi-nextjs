/**
 * 固有名詞変換辞書とテキスト修正機能
 * 音声認識結果を適切なテキストに変換
 */

import { CorrectionDictionary } from '@/types/voice-input.types';

/**
 * 固有名詞変換辞書
 * 音声認識で誤認識されやすい言葉を正しい表記に変換
 */
export const VOICE_CORRECTIONS: CorrectionDictionary = {
  // LLMO関連（過去の実装から継承）
  'エルエルエムオー': 'LLMO',
  'エル エル エム オー': 'LLMO',
  'える える えむ おー': 'LLMO',
  'エルエルモ': 'LLMO',
  'える える も': 'LLMO',

  // EFFECT関連（過去の実装から継承）
  'エフェクト': 'EFFECT',

  // Cafe Kinesi固有名詞
  'カフェキネシ': 'Cafe Kinesi',
  'かふぇきねし': 'Cafe Kinesi',
  'カフェ キネシ': 'Cafe Kinesi',
  'きねし': 'キネシ',
  'キネシオロジー': 'キネシオロジー',
  'きねしおろじー': 'キネシオロジー',

  // サービス・技術名
  'ノーション': 'Notion',
  'のーしょん': 'Notion',

  // 技術用語
  'エーピーアイ': 'API',
  'エー ピー アイ': 'API',
  'エスイーオー': 'SEO',
  'エス イー オー': 'SEO',
  'ディービー': 'DB',
  'ディー ビー': 'DB',

  // アロマ関連
  'アロマテラピー': 'アロマテラピー',
  'あろまてらぴー': 'アロマテラピー',
  'エッセンシャルオイル': 'エッセンシャルオイル',

  // 講座・コース関連
  'ピーチタッチ': 'ピーチタッチ',
  'ぴーちたっち': 'ピーチタッチ',
  'インストラクター': 'インストラクター',
  'いんすとらくたー': 'インストラクター',
};

/**
 * 重複文字を修正
 * @param {string} text - 対象テキスト
 * @returns {string} 修正後のテキスト
 */
function removeDuplicateCharacters(text: string): string {
  // LLL → LL, AAA → AA のような重複を修正
  return text.replace(/(.)\1{2,}/g, '$1$1');
}

/**
 * 固有名詞の変換を適用
 * @param {string} text - 対象テキスト
 * @param {CorrectionDictionary} dictionary - 変換辞書（デフォルト: VOICE_CORRECTIONS）
 * @returns {string} 変換後のテキスト
 */
function applyDictionaryCorrections(
  text: string,
  dictionary: CorrectionDictionary = VOICE_CORRECTIONS
): string {
  let result = text;

  // 辞書内の全パターンを適用
  Object.entries(dictionary).forEach(([incorrect, correct]) => {
    // 大文字小文字を区別しない正規表現で変換
    const regex = new RegExp(incorrect, 'gi');
    result = result.replace(regex, correct);
  });

  return result;
}

/**
 * テキスト全体の修正処理
 * @param {string} text - 対象テキスト
 * @param {object} options - オプション
 * @param {boolean} options.removeDuplicates - 重複文字を削除するか（デフォルト: true）
 * @param {CorrectionDictionary} options.customDictionary - カスタム辞書
 * @param {CorrectionDictionary} options.dynamicDictionary - 動的辞書（Sanityから取得）
 * @returns {string} 修正後のテキスト
 */
export function applyCorrections(
  text: string,
  options: {
    removeDuplicates?: boolean;
    customDictionary?: CorrectionDictionary;
    dynamicDictionary?: CorrectionDictionary;
  } = {}
): string {
  const {
    removeDuplicates = true,
    customDictionary,
    dynamicDictionary,
  } = options;

  let result = text;

  // 1. 重複文字の削除
  if (removeDuplicates) {
    result = removeDuplicateCharacters(result);
  }

  // 2. 動的辞書の適用（Sanityから取得したデータ）
  if (dynamicDictionary && Object.keys(dynamicDictionary).length > 0) {
    result = applyDictionaryCorrections(result, dynamicDictionary);
  }

  // 3. カスタム辞書がある場合は優先適用
  if (customDictionary) {
    result = applyDictionaryCorrections(result, customDictionary);
  }

  // 4. デフォルト辞書の適用
  result = applyDictionaryCorrections(result);

  return result;
}

/**
 * カスタム辞書を追加
 * @param {CorrectionDictionary} customDictionary - 追加する辞書
 * @returns {CorrectionDictionary} 統合された辞書
 */
export function mergeDictionaries(
  customDictionary: CorrectionDictionary
): CorrectionDictionary {
  return {
    ...VOICE_CORRECTIONS,
    ...customDictionary,
  };
}

/**
 * 辞書のエクスポート（デバッグ・管理用）
 * @returns {CorrectionDictionary} 現在の辞書
 */
export function getCorrectionDictionary(): CorrectionDictionary {
  return { ...VOICE_CORRECTIONS };
}

/**
 * 辞書のエントリー数を取得
 * @returns {number} エントリー数
 */
export function getDictionarySize(): number {
  return Object.keys(VOICE_CORRECTIONS).length;
}
