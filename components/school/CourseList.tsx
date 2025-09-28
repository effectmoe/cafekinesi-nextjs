import Link from 'next/link'
import { Course } from '@/lib/types/course'

interface CourseListProps {
  courses: Course[]
  title?: string
}

export default function CourseList({ courses, title = '講座一覧' }: CourseListProps) {
  return (
    <div className="bg-[hsl(var(--hover))] rounded-lg p-6 mb-8">
      <h2 className="text-xs uppercase tracking-wider text-[hsl(var(--text-secondary))] mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {courses.map((course, index) => (
          <Link
            key={course._id || course.courseId}
            href={`#${course.courseId}`}
            className="flex items-center space-x-3 p-3 rounded-md hover:bg-[hsl(var(--background))] transition-colors"
          >
            <span className="text-xs text-[hsl(var(--text-muted))] w-6">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1">
              <span className="text-sm text-[hsl(var(--text-primary))]">
                {course.title}
              </span>
              {course.subtitle && (
                <span className="text-xs text-[hsl(var(--text-secondary))] ml-2">
                  - {course.subtitle}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}