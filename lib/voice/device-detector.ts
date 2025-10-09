/**
 * デバイス判定ユーティリティ
 * ユーザーエージェントからデバイスタイプを判定し、最適な音声認識設定を返す
 */

import { DeviceType, SpeechRecognitionConfig } from '@/types/voice-input.types';

/**
 * 現在のデバイスタイプを判定
 * @returns {DeviceType} デバイスタイプ ('android' | 'ios' | 'pc')
 */
export function detectDevice(): DeviceType {
  // SSR対応: サーバーサイドではデフォルトで'pc'を返す
  if (typeof window === 'undefined') {
    return 'pc';
  }

  const ua = navigator.userAgent;

  // Android判定
  if (/Android/i.test(ua)) {
    return 'android';
  }

  // iOS判定 (iPhone, iPad, iPod)
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return 'ios';
  }

  // その他はPC扱い
  return 'pc';
}

/**
 * ブラウザタイプを判定
 * @returns {string} ブラウザ名
 */
export function detectBrowser(): string {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const ua = navigator.userAgent;

  if (/Edg/i.test(ua)) return 'edge';
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'chrome';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'safari';
  if (/Firefox/i.test(ua)) return 'firefox';

  return 'unknown';
}

/**
 * デバイスタイプに応じた音声認識設定を取得
 * @param {DeviceType} deviceType - デバイスタイプ
 * @param {string} language - 認識言語（デフォルト: 'ja-JP'）
 * @returns {SpeechRecognitionConfig} 音声認識設定
 */
export function getSpeechRecognitionConfig(
  deviceType: DeviceType,
  language: string = 'ja-JP'
): SpeechRecognitionConfig {
  const baseConfig: SpeechRecognitionConfig = {
    lang: language,
    interimResults: true,
    continuous: true,
    maxAlternatives: 1,
  };

  switch (deviceType) {
    case 'android':
      // Android: 短い発話向け設定
      return {
        ...baseConfig,
        continuous: false,     // 一度の発話で終了
        maxAlternatives: 1,    // 候補数を制限
      };

    case 'ios':
      // iOS: Safari最適化
      return {
        ...baseConfig,
        continuous: true,      // 継続的認識
        maxAlternatives: 1,    // 候補数を制限（パフォーマンス）
      };

    case 'pc':
      // PC: 高性能設定
      return {
        ...baseConfig,
        continuous: true,      // 継続的認識
        maxAlternatives: 3,    // 複数候補表示
      };

    default:
      return baseConfig;
  }
}

/**
 * Web Speech APIのサポート状況を確認
 * @returns {boolean} サポートされているかどうか
 */
export function checkWebSpeechSupport(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return !!(
    window.SpeechRecognition ||
    window.webkitSpeechRecognition
  );
}

/**
 * 推奨ブラウザかどうかを判定
 * @param {DeviceType} deviceType - デバイスタイプ
 * @param {string} browser - ブラウザ名
 * @returns {boolean} 推奨ブラウザかどうか
 */
export function isRecommendedBrowser(deviceType: DeviceType, browser: string): boolean {
  switch (deviceType) {
    case 'android':
      // AndroidではChrome/Edgeを推奨
      return browser === 'chrome' || browser === 'edge';

    case 'ios':
      // iOSではSafariのみサポート
      return browser === 'safari';

    case 'pc':
      // PCではChrome/Edge/Safariを推奨
      return ['chrome', 'edge', 'safari'].includes(browser);

    default:
      return false;
  }
}

/**
 * デバイス情報を取得（デバッグ用）
 * @returns {object} デバイス情報
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'pc',
      browser: 'unknown',
      userAgent: '',
      isSupported: false,
      isRecommended: false,
    };
  }

  const deviceType = detectDevice();
  const browser = detectBrowser();

  return {
    deviceType,
    browser,
    userAgent: navigator.userAgent,
    isSupported: checkWebSpeechSupport(),
    isRecommended: isRecommendedBrowser(deviceType, browser),
  };
}
