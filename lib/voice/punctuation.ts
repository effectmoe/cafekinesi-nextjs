/**
 * 句読点自動追加機能
 * 音声入力されたテキストに適切な句読点を追加
 */

import { QuestionPatterns } from '@/types/voice-input.types';

/**
 * 疑問詞リスト
 */
const QUESTION_WORDS: string[] = [
  'いつ',
  'どこ',
  'だれ',
  '誰',
  'なに',
  '何',
  'なぜ',
  '為何',
  'どう',
  'どの',
  'どれ',
  'どちら',
  'いくつ',
  'いくら',
  'どうして',
  'なんで',
  'どうやって',
  'どれくらい',
  'どのくらい',
];

/**
 * 疑問形語尾パターン
 */
const QUESTION_ENDINGS: RegExp[] = [
  /か$/,
  /ですか$/,
  /ますか$/,
  /でしょうか$/,
  /かな$/,
  /かしら$/,
  /だろうか$/,
  /でしょう$/,
  /ですかね$/,
  /かい$/,
  /のか$/,
  /の$/,  // 「〜の？」の形
];

/**
 * 疑問文かどうかを判定
 * @param {string} text - 判定対象のテキスト
 * @returns {boolean} 疑問文の場合true
 */
export function isProbablyQuestion(text: string): boolean {
  const trimmedText = text.trim();

  // 疑問詞が含まれているかチェック
  const hasQuestionWord = QUESTION_WORDS.some(word =>
    trimmedText.includes(word)
  );

  // 疑問形の語尾かチェック
  const hasQuestionEnding = QUESTION_ENDINGS.some(pattern =>
    pattern.test(trimmedText)
  );

  return hasQuestionWord || hasQuestionEnding;
}

/**
 * 句読点を自動追加
 * @param {string} text - 対象テキスト
 * @param {boolean} isVoiceInput - 音声入力かどうか
 * @returns {string} 句読点が追加されたテキスト
 */
export function addPunctuation(text: string, isVoiceInput: boolean = true): string {
  // 音声入力でない場合はスキップ
  if (!isVoiceInput) {
    return text;
  }

  const trimmedText = text.trim();

  // 既に句読点がある場合はスキップ
  if (/[。？！]$/.test(trimmedText)) {
    return trimmedText;
  }

  // 空文字列の場合はそのまま返す
  if (!trimmedText) {
    return trimmedText;
  }

  // 疑問文の判定
  if (isProbablyQuestion(trimmedText)) {
    return `${trimmedText}？`;
  } else {
    return `${trimmedText}。`;
  }
}

/**
 * 複数の文に対して句読点を追加
 * @param {string[]} sentences - 文の配列
 * @param {boolean} isVoiceInput - 音声入力かどうか
 * @returns {string[]} 句読点が追加された文の配列
 */
export function addPunctuationToMultiple(
  sentences: string[],
  isVoiceInput: boolean = true
): string[] {
  return sentences.map(sentence => addPunctuation(sentence, isVoiceInput));
}

/**
 * カスタムパターンで疑問文を判定
 * @param {string} text - 対象テキスト
 * @param {QuestionPatterns} customPatterns - カスタムパターン
 * @returns {boolean} 疑問文の場合true
 */
export function isProbablyQuestionWithCustomPatterns(
  text: string,
  customPatterns: QuestionPatterns
): boolean {
  const trimmedText = text.trim();

  // カスタム疑問詞チェック
  const hasCustomQuestionWord = customPatterns.words.some(word =>
    trimmedText.includes(word)
  );

  // カスタム語尾パターンチェック
  const hasCustomQuestionEnding = customPatterns.endings.some(pattern =>
    pattern.test(trimmedText)
  );

  // デフォルトパターンもチェック
  const hasDefaultPattern = isProbablyQuestion(trimmedText);

  return hasCustomQuestionWord || hasCustomQuestionEnding || hasDefaultPattern;
}

/**
 * 疑問詞と疑問形語尾のパターンを取得（デバッグ用）
 * @returns {QuestionPatterns} パターン
 */
export function getQuestionPatterns(): QuestionPatterns {
  return {
    words: [...QUESTION_WORDS],
    endings: [...QUESTION_ENDINGS],
  };
}

/**
 * テキスト内の文を分割し、それぞれに句読点を追加
 * @param {string} text - 対象テキスト
 * @param {boolean} isVoiceInput - 音声入力かどうか
 * @returns {string} 処理後のテキスト
 */
export function addPunctuationToText(text: string, isVoiceInput: boolean = true): string {
  if (!isVoiceInput) {
    return text;
  }

  // 改行で分割
  const lines = text.split('\n');

  // 各行に句読点を追加
  const processedLines = lines.map(line => {
    if (line.trim()) {
      return addPunctuation(line, isVoiceInput);
    }
    return line;
  });

  return processedLines.join('\n');
}
