import { PortableText, PortableTextComponents } from '@portabletext/react'

interface InfoBoxComponentProps {
  value: {
    title?: string
    content: any[]
    type?: 'info' | 'warning' | 'success' | 'tip' | 'note'
  }
}

const boxStyles = {
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  warning: {
    container: 'bg-amber-50 border-amber-200',
    icon: 'text-amber-600',
    title: 'text-amber-900',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  },
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-600',
    title: 'text-green-900',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  tip: {
    container: 'bg-purple-50 border-purple-200',
    icon: 'text-purple-600',
    title: 'text-purple-900',
    iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  },
  note: {
    container: 'bg-gray-50 border-gray-200',
    icon: 'text-gray-600',
    title: 'text-gray-900',
    iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
  }
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  }
}

export default function InfoBoxComponent({ value }: InfoBoxComponentProps) {
  if (!value || !value.content) return null

  const boxType = value.type || 'info'
  const styles = boxStyles[boxType]

  return (
    <div className={`my-8 p-6 rounded-lg border-2 ${styles.container}`}>
      <div className="flex items-start gap-4">
        <svg className={`w-6 h-6 flex-shrink-0 mt-0.5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={styles.iconPath} />
        </svg>
        <div className="flex-1">
          {value.title && (
            <h3 className={`text-lg font-bold mb-3 ${styles.title}`}>
              {value.title}
            </h3>
          )}
          <div className="text-gray-700 leading-relaxed">
            <PortableText value={value.content} components={portableTextComponents} />
          </div>
        </div>
      </div>
    </div>
  )
}
