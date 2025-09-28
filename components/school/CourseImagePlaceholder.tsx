export default function CourseImagePlaceholder({
  title,
  subtitle,
  className = ""
}: {
  title: string
  subtitle: string
  className?: string
}) {
  return (
    <div className={`w-[280px] h-[180px] flex items-center justify-center bg-gray-100 ${className}`}>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  )
}