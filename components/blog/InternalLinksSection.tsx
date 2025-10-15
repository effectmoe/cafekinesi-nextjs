'use client'

interface InternalLink {
  title: string
  url: string
  description?: string
  type: 'pillar' | 'cluster' | 'blog'
  _key?: string
}

interface InternalLinksSectionProps {
  links: InternalLink[]
}

export default function InternalLinksSection({ links }: InternalLinksSectionProps) {
  if (!links || links.length === 0) return null

  // リンクをタイプ別にグループ化
  const groupedLinks = links.reduce((acc, link) => {
    if (!acc[link.type]) {
      acc[link.type] = []
    }
    acc[link.type].push(link)
    return acc
  }, {} as Record<string, InternalLink[]>)

  const typeLabels: Record<string, string> = {
    pillar: 'ピラーページ',
    cluster: 'クラスターページ',
    blog: '関連記事'
  }

  const typeIcons: Record<string, string> = {
    pillar: '📚',
    cluster: '🔗',
    blog: '📝'
  }

  return (
    <section className="mb-12 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">🔗</span>
        関連コンテンツ
      </h2>

      <div className="space-y-6">
        {Object.entries(groupedLinks).map(([type, typeLinks]) => (
          <div key={type}>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <span>{typeIcons[type]}</span>
              {typeLabels[type]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {typeLinks.map((link, index) => (
                <a
                  key={link._key || index}
                  href={link.url}
                  className="group block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200"
                >
                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {link.title}
                  </h4>
                  {link.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {link.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center text-xs text-blue-600 font-medium">
                    <span>詳しく見る</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
