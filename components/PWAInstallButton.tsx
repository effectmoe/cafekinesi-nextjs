'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // iOS判定
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // モバイル判定（スマートフォン・タブレット）
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);

    // すでにインストール済みか確認
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Android/Chrome: beforeinstallprompt イベントをキャプチャ
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // インストール完了時
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // iOS: 手順モーダルを表示
      setShowIOSModal(true);
    } else if (deferredPrompt) {
      // Android/Chrome: ネイティブプロンプトを表示
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('PWA installed');
      }

      setDeferredPrompt(null);
    } else {
      // Android/Chromeだが、beforeinstallpromptが発火していない場合
      setShowAndroidModal(true);
    }
  };

  // インストール済みの場合は非表示
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* インストールボタン */}
      <button
        onClick={handleInstallClick}
        className="w-full flex items-center gap-3 py-3 px-4 text-left hover:bg-gray-50 transition-colors rounded-lg"
      >
        <Download size={20} className="text-gray-700 flex-shrink-0" />
        <span className="nav-text">アプリをインストール</span>
      </button>

      {/* iOS インストール手順モーダル */}
      {showIOSModal && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
            onClick={() => setShowIOSModal(false)}
          />

          {/* モーダル */}
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-[70] max-w-md mx-auto">
            <div className="p-6">
              {/* ヘッダー */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  アプリをインストール
                </h3>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="閉じる"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* 手順 */}
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  カフェキネシをホーム画面に追加して、アプリのように使用できます：
                </p>

                <ol className="space-y-3 pl-1">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      1
                    </span>
                    <span>
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
                    <span>
                      <strong>「ホーム画面に追加」</strong>を選択
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      3
                    </span>
                    <span>
                      右上の<strong>「追加」</strong>をタップ
                    </span>
                  </li>
                </ol>
              </div>

              {/* 閉じるボタン */}
              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                閉じる
              </button>
            </div>
          </div>
        </>
      )}

      {/* Android インストール手順モーダル */}
      {showAndroidModal && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
            onClick={() => setShowAndroidModal(false)}
          />

          {/* モーダル */}
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-[70] max-w-md mx-auto">
            <div className="p-6">
              {/* ヘッダー */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  アプリをインストール
                </h3>
                <button
                  onClick={() => setShowAndroidModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="閉じる"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* 手順 */}
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  カフェキネシを{isMobile ? 'ホーム画面に追加' : 'インストール'}して、アプリのように使用できます：
                </p>

                {isMobile ? (
                  // モバイル用の手順
                  <ol className="space-y-3 pl-1">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        1
                      </span>
                      <span>
                        画面右上の <strong>︙</strong>（3点メニュー）をタップ
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        2
                      </span>
                      <span>
                        <strong>「アプリをインストール」</strong>または<strong>「ホーム画面に追加」</strong>を選択
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </span>
                      <span>
                        <strong>「インストール」</strong>または<strong>「追加」</strong>をタップ
                      </span>
                    </li>
                  </ol>
                ) : (
                  // PC用の手順
                  <ol className="space-y-3 pl-1">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        1
                      </span>
                      <span>
                        画面右上の <strong>︙</strong>（3点メニュー）をクリック
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        2
                      </span>
                      <span>
                        <strong>「キャスト、保存、共有」</strong>にマウスオーバー
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </span>
                      <span>
                        <strong>「カフェキネシをインストール...」</strong>をクリック
                      </span>
                    </li>
                  </ol>
                )}
              </div>

              {/* 閉じるボタン */}
              <button
                onClick={() => setShowAndroidModal(false)}
                className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                閉じる
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
