'use client'

import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import SearchModal from "./SearchModal";
const logo = "/logo.jpeg";

interface NavigationItem {
  label: string
  link: string
  order: number
  isActive: boolean
}

interface HeaderIconConfig {
  show: boolean
  link: string
}

interface HeaderIcons {
  searchIcon?: HeaderIconConfig
  cartIcon?: HeaderIconConfig
}

interface HeaderProps {
  navigationItems?: NavigationItem[]
  headerIcons?: HeaderIcons
}

const Header = ({ navigationItems = [], headerIcons }: HeaderProps) => {
  // フォールバック用のデフォルトメニュー
  const defaultNavItems = [
    { label: "カフェキネシについて", link: "/#about-section", order: 1, isActive: true },
    { label: "スクール", link: "/school", order: 2, isActive: true },
    { label: "インストラクター", link: "/instructor", order: 3, isActive: true },
    { label: "ブログ", link: "/blog", order: 4, isActive: true },
    { label: "アロマ", link: "#aroma", order: 5, isActive: true },
    { label: "メンバー", link: "#", order: 6, isActive: true }
  ]

  const navItems = navigationItems.length > 0 ? navigationItems : defaultNavItems
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-100 relative z-50">
        <div className="max-w-screen-2xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 hover:opacity-90 transition-opacity focus:outline-none">
              <img
                src={logo}
                alt="Cafe Kinesi Logo"
                className="w-12 h-12 object-contain"
              />
              <div className="font-noto-serif text-lg font-medium text-[hsl(var(--text-primary))] tracking-wide">
                Cafe Kinesi
              </div>
            </Link>

            {/* Right side - Icons and Hamburger */}
            <div className="flex items-center gap-2 ml-auto">
              {/* 検索アイコン */}
              {headerIcons?.searchIcon?.show !== false && (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center justify-center w-9 h-9 hover:opacity-70 transition-opacity shrink-0"
                  aria-label="検索"
                >
                  <Search size={20} className="text-red-500 block" strokeWidth={1.5} />
                </button>
              )}

              {/* カートアイコン */}
              {headerIcons?.cartIcon?.show !== false && (
                headerIcons?.cartIcon?.link ? (
                  <Link
                    href={headerIcons.cartIcon.link}
                    className="flex items-center justify-center w-9 h-9 hover:opacity-70 transition-opacity shrink-0"
                    aria-label="カート"
                  >
                    <ShoppingCart size={20} className="text-gray-700 block" strokeWidth={1.5} />
                  </Link>
                ) : (
                  <button className="flex items-center justify-center w-9 h-9 hover:opacity-70 transition-opacity shrink-0" aria-label="カート">
                    <ShoppingCart size={20} className="text-gray-700 block" strokeWidth={1.5} />
                  </button>
                )
              )}

              {/* ハンバーガーメニュー */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center w-9 h-9 hover:opacity-70 transition-opacity shrink-0"
                aria-label="メニュー"
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="text-gray-700 block" strokeWidth={1.5} />
                ) : (
                  <Menu size={20} className="text-gray-700 block" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-40">
            <nav className="px-8 py-6 space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={`${item.label}-${index}`}
                  href={item.link}
                  className="block nav-text hover:opacity-70 transition-opacity cursor-pointer py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;