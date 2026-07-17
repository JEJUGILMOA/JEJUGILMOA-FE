import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button/Button'

describe('Button', () => {
  it('renders label and handles click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>탐색하기</Button>)

    await user.click(screen.getByRole('button', { name: '탐색하기' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button isLoading>저장</Button>)

    expect(screen.getByRole('button', { name: '처리 중…' })).toBeDisabled()
  })
})
