import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'sonner'
import { queryClient } from '@/api/queryClient'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { lightTheme } from '@/styles/theme.css.ts'

type AppProvidersProps = {
  children: ReactNode
}

function AppErrorFallback({ resetErrorBoundary }: { resetErrorBoundary: () => void }) {
  return (
    <ErrorState
      title="앱을 표시할 수 없어요"
      description="예기치 못한 오류가 발생했습니다."
      onRetry={resetErrorBoundary}
    />
  )
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <div className={lightTheme}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary FallbackComponent={AppErrorFallback}>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ErrorBoundary>
      </QueryClientProvider>
    </div>
  )
}
