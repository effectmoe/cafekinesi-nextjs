'use client';

import { useEffect } from 'react';

/**
 * Service Workerを完全に登録解除するコンポーネント
 * 古いPWA実装（@ducanh2912/next-pwa）の残骸を削除
 */
export default function UnregisterServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // すべてのService Workerを取得して登録解除
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log('Service Worker unregistered successfully:', registration.scope);
            }
          });
        }
      });

      // キャッシュも削除
      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
            console.log('Cache deleted:', cacheName);
          });
        });
      }
    }
  }, []);

  return null; // UIは表示しない
}
