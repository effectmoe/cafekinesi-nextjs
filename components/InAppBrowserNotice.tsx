'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, AlertCircle } from 'lucide-react';

export default function InAppBrowserNotice() {
  const [showNotice, setShowNotice] = useState(false);
  const [browserName, setBrowserName] = useState('');
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // すでに閉じている場合はスキップ
    if (isDismissed) return;

    const userAgent = navigator.userAgent;

    // iOS判定
    const iOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // アプリ内ブラウザを検出
    let detectedBrowser = '';

    if (userAgent.includes('Line') || userAgent.includes('LINE')) {
      detectedBrowser = 'LINE';
    } else if (userAgent.includes('Instagram')) {
      detectedBrowser = 'Instagram';
    } else if (userAgent.includes('FBAN') || userAgent.includes('FBAV') || userAgent.includes('FB_IAB')) {
      detectedBrowser = 'Facebook';
    } else if (userAgent.includes('Messenger')) {
      detectedBrowser = 'Messenger';
    } else if (userAgent.includes('Twitter')) {
      detectedBrowser = 'Twitter';
    }

    if (detectedBrowser) {
      setBrowserName(detectedBrowser);
      setShowNotice(true);
    }
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowNotice(false);
  };

  if (!showNotice) {
    return null;
  }

  return (
    <>
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[100]" />

      {/* ポップアップ */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-[110] max-w-md mx-auto">
        <div className="p-6">
          {/* ヘッダー */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                ブラウザで開いてください
              </h3>
              <p className="text-sm text-gray-600">
                {browserName}内では一部の機能が制限されます
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="閉じる"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* メッセージ */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-700 leading-relaxed">
              より快適にご利用いただくため、<strong className="text-blue-700">
                {isIOS ? 'Safari' : 'Chrome'}などのブラウザ
              </strong>で開くことをおすすめします。
            </p>
          </div>

          {/* 手順 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm">
              ブラウザで開く方法：
            </h4>

            {/* iOS用の手順 */}
            {isIOS && (
              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <span className="text-gray-700">
                    画面下部の <strong>共有ボタン</strong>（
                    <svg className="inline w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                    </svg>
                    ）をタップ
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <span className="text-gray-700">
                    <strong>「Safariで開く」</strong>を選択
                  </span>
                </li>
              </ol>
            )}

            {/* Android用の手順 */}
            {!isIOS && browserName === 'LINE' && (
              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <span className="text-gray-700">
                    画面右下の <strong>︙</strong>（3点メニュー）をタップ
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <span className="text-gray-700">
                    <strong>「他のアプリで開く」</strong>または<strong>「ブラウザで開く」</strong>を選択
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <span className="text-gray-700">
                    <strong>「Chrome」</strong>を選択
                  </span>
                </li>
              </ol>
            )}

            {!isIOS && browserName !== 'LINE' && (
              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <span className="text-gray-700">
                    画面右上の <strong>︙</strong>（メニュー）をタップ
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <span className="text-gray-700">
                    <strong>「ブラウザで開く」</strong>または<strong>「Chromeで開く」</strong>を選択
                  </span>
                </li>
              </ol>
            )}
          </div>

          {/* 閉じるボタン */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              このまま続ける
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              了解
            </button>
          </div>

          {/* 補足 */}
          <p className="mt-4 text-xs text-center text-gray-500">
            ブラウザで開くと、アプリとしてインストールも可能です
          </p>
        </div>
      </div>
    </>
  );
}
