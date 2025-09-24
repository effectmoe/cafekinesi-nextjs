'use client'

import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
const logo = "/logo.jpeg";

const Header = () => {
  const navItems = ["カフェキネシについて", "スクール", "インストラクター", "ブログ", "アロマ", "メンバー"];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <div className="flex items-center gap-4">
              <button className="p-1 hover:opacity-70 transition-opacity">
                <Search size={18} className="text-gray-700" />
              </button>
              <button className="p-1 hover:opacity-70 transition-opacity">
                <ShoppingCart size={18} className="text-gray-700" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="text-gray-700" />
                ) : (
                  <Menu size={24} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-40">
            <nav className="px-8 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block nav-text hover:opacity-70 transition-opacity cursor-pointer py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
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
    </>
  );
};

export default Header;