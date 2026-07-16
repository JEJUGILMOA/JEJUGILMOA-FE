import type { ReactNode } from 'react'
import { errorStyle, errorTitleStyle, errorDescriptionStyle } from './ErrorState.css.ts'
import { Button } from '@/components/ui/Button/Button'

type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
  action?: ReactNode
}

export function ErrorState({
  title = '문제가 발생했어요',
  description = '잠시 후 다시 시도해 주세요.',
  onRetry,
  action,
}: ErrorStateProps) {
  return (
    <div className={errorStyle} role="alert">
      <p className={errorTitleStyle}>{title}</p>
      <p className={errorDescriptionStyle}>{description}</p>
      {action}
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          다시 시도
        </Button>
      ) : null}
    </div>
  )
}
