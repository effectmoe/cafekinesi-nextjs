/**
 * WebView検出ユーティリティ
 * アプリ内ブラウザ（LINE、Twitter、Facebookなど）を検出
 */

/**
 * アプリ内ブラウザ（WebView）かどうかを判定
 * @returns {boolean} WebViewの場合true
 */
export function isWebView(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  // LINE内ブラウザ
  if (userAgent.includes('line/')) {
    return true;
  }

  // Twitter内ブラウザ
  if (userAgent.includes('twitter')) {
    return true;
  }

  // Facebook/Instagram内ブラウザ
  if (userAgent.includes('fban') || userAgent.includes('fbav') || userAgent.includes('instagram')) {
    return true;
  }

  // その他のWebView検出
  // Android WebView
  if (userAgent.includes('wv') || userAgent.includes('webview')) {
    return true;
  }

  // iOS WebView（standaloneモードを除く）
  const isIOS = /iphone|ipod|ipad/.test(userAgent);
  const isStandalone = window.navigator.standalone === true;
  const isSafari = userAgent.includes('safari') && !userAgent.includes('crios') && !userAgent.includes('fxios');

  if (isIOS && !isSafari && !isStandalone) {
    return true;
  }

  return false;
}

/**
 * ブラウザ名を取得
 * @returns {string} ブラウザ名
 */
export function getBrowserName(): string {
  if (typeof window === 'undefined') {
    return 'Unknown';
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  if (userAgent.includes('line/')) {
    return 'LINE';
  }

  if (userAgent.includes('twitter')) {
    return 'Twitter';
  }

  if (userAgent.includes('fban') || userAgent.includes('fbav')) {
    return 'Facebook';
  }

  if (userAgent.includes('instagram')) {
    return 'Instagram';
  }

  if (userAgent.includes('edg/')) {
    return 'Edge';
  }

  if (userAgent.includes('chrome/') && !userAgent.includes('edg/')) {
    return 'Chrome';
  }

  if (userAgent.includes('safari/') && !userAgent.includes('chrome/')) {
    return 'Safari';
  }

  if (userAgent.includes('firefox/')) {
    return 'Firefox';
  }

  if (userAgent.includes('opera/') || userAgent.includes('opr/')) {
    return 'Opera';
  }

  return 'Unknown';
}

/**
 * WebView使用時の推奨メッセージを取得
 * @returns {string} 推奨メッセージ
 */
export function getWebViewWarning(): string {
  const browserName = getBrowserName();

  if (browserName === 'LINE') {
    return 'LINEアプリ内ブラウザでは音声入力をご利用いただけません。右上のメニューから「ブラウザで開く」をタップしてください。';
  }

  if (browserName === 'Twitter') {
    return 'Twitterアプリ内ブラウザでは音声入力をご利用いただけません。URLをコピーしてChromeやSafariで開いてください。';
  }

  if (browserName === 'Facebook' || browserName === 'Instagram') {
    return 'アプリ内ブラウザでは音声入力をご利用いただけません。URLをコピーしてChromeやSafariで開いてください。';
  }

  return 'アプリ内ブラウザでは音声入力をご利用いただけません。ChromeやSafariなどのブラウザで開いてください。';
}
