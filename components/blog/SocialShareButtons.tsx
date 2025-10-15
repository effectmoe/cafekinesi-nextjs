'use client'

import { useState } from 'react'

interface SocialShareButtonsProps {
  url: string
  title: string
  description?: string
}

export default function SocialShareButtons({ url, title, description }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    line: `https://line.me/R/msg/text/?${encodedTitle}%0A${encodedUrl}`,
    hatena: `https://b.hatena.ne.jp/add?mode=confirm&url=${encodedUrl}&title=${encodedTitle}`,
    pocket: `https://getpocket.com/edit?url=${encodedUrl}&title=${encodedTitle}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="mb-8">
      <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">
        この記事をシェア
      </div>

      <div className="flex flex-wrap items-start gap-2 sm:gap-3">
        {/* Twitter */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 sm:gap-1.5 group"
          aria-label="Twitterでシェア"
        >
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#1DA1F2] text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">Twitter</span>
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 sm:gap-1.5 group"
          aria-label="Facebookでシェア"
        >
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#1877F2] text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">Facebook</span>
        </a>

        {/* LINE */}
        <a
          href={shareLinks.line}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 sm:gap-1.5 group"
          aria-label="LINEでシェア"
        >
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#00B900] text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">LINE</span>
        </a>

        {/* はてなブックマーク */}
        <a
          href={shareLinks.hatena}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 sm:gap-1.5 group"
          aria-label="はてなブックマークに追加"
        >
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#00A4DE] text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.47 0C22.42 0 24 1.58 24 3.53v16.94c0 1.95-1.58 3.53-3.53 3.53H3.53C1.58 24 0 22.42 0 20.47V3.53C0 1.58 1.58 0 3.53 0h16.94zM8.42 5.45c-.37 0-.67.3-.67.67v5.45H6.68v-5.45c0-.37-.3-.67-.67-.67-.37 0-.67.3-.67.67v6.13c0 .37.3.67.67.67h2.4c.37 0 .67-.3.67-.67V6.13c0-.37-.3-.68-.67-.68zm9.98 7.67c0-1.06-.86-1.92-1.92-1.92s-1.92.86-1.92 1.92c0 1.06.86 1.92 1.92 1.92s1.92-.86 1.92-1.92z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">はてな</span>
        </a>

        {/* Pocket */}
        <a
          href={shareLinks.pocket}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 sm:gap-1.5 group"
          aria-label="Pocketに保存"
        >
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#EF3F56] text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.813 10c0-.44-.36-.8-.8-.8H5.987c-.44 0-.8.36-.8.8 0 .185.063.355.17.49l5.826 6.428a1.195 1.195 0 001.67 0l5.826-6.428a.792.792 0 00.134-.49zm5.135-7.25v7.5c0 5.047-3.954 9.207-8.935 9.575a10.005 10.005 0 01-9.97-9.575v-7.5c0-1.146.958-2.13 2.13-2.13h14.645c1.145 0 2.13.984 2.13 2.13z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">Pocket</span>
        </a>

        {/* URLコピー */}
        <button
          onClick={copyToClipboard}
          className="flex flex-col items-center gap-1 sm:gap-1.5 group"
          aria-label="URLをコピー"
        >
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
            {copied ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
            {copied ? "コピー済み" : "URLコピー"}
          </span>
        </button>
      </div>
    </div>
  )
}
