/**
 * 音声入力システムの型定義
 * Web Speech API と カスタムフックで使用
 */

// デバイスタイプ
export type DeviceType = 'android' | 'ios' | 'pc';

// 音声認識の状態
export interface VoiceInputState {
  isRecording: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  error: VoiceInputError | null;
}

// エラータイプ
export type VoiceInputError =
  | 'not-allowed'      // マイク権限が拒否された
  | 'no-speech'        // 音声が検出されない
  | 'aborted'          // 認識が中断された
  | 'audio-capture'    // マイクアクセス失敗
  | 'network'          // ネットワークエラー
  | 'service-not-allowed' // サービス利用不可
  | 'not-supported'    // ブラウザが非対応
  | 'unknown';         // 不明なエラー

// Web Speech API の型定義（TypeScript標準にない場合の補完）
export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

// グローバルなWeb Speech API型定義
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  // SpeechRecognition is already defined in lib.dom.d.ts
  // Just augment Window interface
}

// 音声入力オプション
export interface VoiceInputOptions {
  onResult: (text: string) => void;
  onError?: (error: VoiceInputError) => void;
  onStart?: () => void;
  onEnd?: () => void;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  autoCorrect?: boolean;      // 固有名詞変換を有効にするか
  autoPunctuation?: boolean;  // 句読点自動追加を有効にするか
}

// デバイス別音声認識設定
export interface SpeechRecognitionConfig {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
}

// 固有名詞変換の辞書型
export type CorrectionDictionary = Record<string, string>;

// 疑問文判定用のパターン
export interface QuestionPatterns {
  words: string[];
  endings: RegExp[];
}
