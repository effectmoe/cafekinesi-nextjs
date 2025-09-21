'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { VisualEditingProvider } from './VisualEditing'
import { AccessibilityProvider } from './AccessibilityProvider'
import { PerformanceOptimizer } from './PerformanceOptimizer'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { DevContrastChecker } from './ContrastChecker'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider enableDevAudit={process.env.NODE_ENV === 'development'}>
        <PerformanceOptimizer>
          <VisualEditingProvider>
            {children}
            <Toaster />
            <Sonner />
            {process.env.NODE_ENV === 'development' && <DevContrastChecker />}
          </VisualEditingProvider>
        </PerformanceOptimizer>
      </AccessibilityProvider>
    </QueryClientProvider>
  )
}