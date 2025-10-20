'use client';

import Link from 'next/link';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[hsl(35,25%,95%)] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        <Card className="p-8 md:p-12 bg-white rounded-3xl shadow-lg border border-border/30">
          {/* アイコン */}
          <div className="flex justify-center mb-6">
            <div className="bg-[hsl(35,22%,91%)] p-6 rounded-full">
              <WifiOff className="w-12 h-12 text-[hsl(35,45%,45%)]" strokeWidth={1.5} />
            </div>
          </div>

          {/* タイトル */}
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-center text-text-primary mb-4">
            オフラインです
          </h1>

          {/* メッセージ */}
          <p className="text-center text-text-secondary mb-8">
            インターネット接続が切断されています。<br />
            接続を確認してから、もう一度お試しください。
          </p>

          {/* アクションボタン */}
          <div className="space-y-4">
            {/* 再読み込みボタン */}
            <button
              onClick={() => window.location.reload()}
              className="w-full group p-4 bg-[hsl(180,15%,88%)] hover:shadow-lg transition-all duration-200 cursor-pointer border border-border/30 rounded-2xl hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-6 h-6 text-[hsl(35,45%,45%)] opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
              <span className="text-sm font-medium text-text-primary">
                ページを再読み込み
              </span>
            </button>

            {/* ホームに戻るボタン */}
            <Link href="/">
              <div className="w-full group p-4 bg-[hsl(260,15%,88%)] hover:shadow-lg transition-all duration-200 cursor-pointer border border-border/30 rounded-2xl hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3">
                <Home className="w-6 h-6 text-[hsl(35,45%,45%)] opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                <span className="text-sm font-medium text-text-primary">
                  ホームに戻る
                </span>
              </div>
            </Link>
          </div>

          {/* ヘルプテキスト */}
          <div className="mt-8 pt-6 border-t border-border/20">
            <h2 className="text-sm font-semibold text-text-primary mb-3">
              接続を確認するには：
            </h2>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-[hsl(35,45%,45%)] mt-0.5">•</span>
                <span>Wi-Fiまたはモバイルデータ通信がオンになっているか確認</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(35,45%,45%)] mt-0.5">•</span>
                <span>機内モードがオフになっているか確認</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[hsl(35,45%,45%)] mt-0.5">•</span>
                <span>ネットワーク設定を確認して、もう一度お試しください</span>
              </li>
            </ul>
          </div>

          {/* キャッシュ情報 */}
          <div className="mt-6 p-4 bg-[hsl(35,22%,91%)] rounded-xl">
            <p className="text-xs text-center text-text-secondary">
              💡 このページの一部のコンテンツは、以前に閲覧したページのキャッシュから表示されている場合があります。
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
