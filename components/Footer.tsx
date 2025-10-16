'use client'

import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        {/* フッターナビゲーション */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* カフェキネシについて */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">カフェキネシ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  カフェキネシについて
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  プロフィール
                </Link>
              </li>
            </ul>
          </div>

          {/* スクール・講座 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">スクール</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/school" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  講座一覧
                </Link>
              </li>
              <li>
                <Link href="/instructor" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  インストラクター
                </Link>
              </li>
            </ul>
          </div>

          {/* 情報 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">情報</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  ブログ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  よくある質問
                </Link>
              </li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">お問い合わせ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#chat" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  AIチャット
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Cafe Kinesi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;