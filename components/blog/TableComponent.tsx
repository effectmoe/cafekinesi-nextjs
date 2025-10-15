interface TableComponentProps {
  value: {
    caption?: string
    rows: {
      _key: string
      cells: string[]
    }[]
  }
}

export default function TableComponent({ value }: TableComponentProps) {
  if (!value || !value.rows || value.rows.length === 0) return null

  const hasHeader = value.rows.length > 0
  const headerRow = hasHeader ? value.rows[0] : null
  const bodyRows = hasHeader ? value.rows.slice(1) : value.rows

  return (
    <div className="my-8 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      {value.caption && (
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-700">{value.caption}</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {headerRow && (
            <thead className="bg-gray-50">
              <tr>
                {headerRow.cells.map((cell, index) => (
                  <th
                    key={`header-${index}`}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="bg-white divide-y divide-gray-200">
            {bodyRows.map((row, rowIndex) => (
              <tr key={row._key || rowIndex} className="hover:bg-gray-50 transition-colors">
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`cell-${rowIndex}-${cellIndex}`}
                    className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
