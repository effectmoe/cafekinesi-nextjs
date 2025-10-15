interface ComparisonItem {
  label: string
  before: string
  after: string
}

interface ComparisonTableComponentProps {
  value: {
    title?: string
    items: ComparisonItem[]
  }
}

export default function ComparisonTableComponent({ value }: ComparisonTableComponentProps) {
  if (!value || !value.items || value.items.length === 0) return null

  return (
    <div className="my-8">
      {value.title && (
        <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
      )}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/3">
                  項目
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wider w-1/3 bg-red-50">
                  改善前
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider w-1/3 bg-green-50">
                  改善後
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {value.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {item.label}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 bg-red-50/30">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{item.before}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 bg-green-50/30">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item.after}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
