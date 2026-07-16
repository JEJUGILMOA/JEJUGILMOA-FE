import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button/Button'
import { lightTheme } from '@/styles/theme.css.ts'

describe('Button', () => {
  it('renders label and handles click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <div className={lightTheme}>
        <Button onClick={onClick}>탐색하기</Button>
      </div>,
    )

    await user.click(screen.getByRole('button', { name: '탐색하기' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(
      <div className={lightTheme}>
        <Button isLoading>저장</Button>
      </div>,
    )

    expect(screen.getByRole('button', { name: '처리 중…' })).toBeDisabled()
  })
})
