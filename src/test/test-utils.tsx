import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { lightTheme } from '@/styles/theme.css.ts'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

export function renderWithProviders(
  ui: ReactElement,
  options?: { route?: string },
) {
  const queryClient = createTestQueryClient()
  const route = options?.route ?? '/'

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <div className={lightTheme}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </QueryClientProvider>
      </div>
    )
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper }),
  }
}
