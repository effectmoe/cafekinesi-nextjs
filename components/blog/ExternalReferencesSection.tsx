'use client'

interface ExternalReference {
  title: string
  url: string
  publisher?: string
  date?: string
  _key?: string
}

interface ExternalReferencesSectionProps {
  references: ExternalReference[]
}

export default function ExternalReferencesSection({ references }: ExternalReferencesSectionProps) {
  if (!references || references.length === 0) return null

  return (
    <section className="mb-12 p-6 sm:p-8 bg-amber-50 rounded-lg border border-amber-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">📖</span>
        参考文献・外部リンク
      </h2>

      <div className="space-y-3">
        {references.map((ref, index) => (
          <div
            key={ref._key || index}
            className="flex items-start gap-3 p-4 bg-white rounded-lg border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all duration-200"
          >
            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-700 rounded-full text-xs font-bold mt-0.5">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="font-semibold text-gray-900 hover:text-amber-700 transition-colors inline-flex items-center gap-2 group"
              >
                <span>{ref.title}</span>
                <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              {(ref.publisher || ref.date) && (
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  {ref.publisher && <span>{ref.publisher}</span>}
                  {ref.publisher && ref.date && <span>•</span>}
                  {ref.date && (
                    <time dateTime={ref.date}>
                      {new Date(ref.date).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  )}
                </div>
              )}
              <div className="mt-1 text-xs text-gray-500 truncate">
                {ref.url}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-600 flex items-start gap-2">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>外部リンクは新しいタブで開きます。リンク先のコンテンツは当サイトの管理外です。</span>
      </div>
    </section>
  )
}
