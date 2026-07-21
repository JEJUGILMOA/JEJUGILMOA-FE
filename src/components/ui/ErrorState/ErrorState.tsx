import type { ReactNode } from 'react'
import { errorStyle, errorTitleStyle, errorDescriptionStyle } from './ErrorState.css.ts'
import { Button } from '@/components/ui/Button/Button'

type ErrorStateProps = {
  /** 제목. 기본값 "문제가 발생했어요" */
  title?: string
  /** 보조 설명. 기본값 "잠시 후 다시 시도해 주세요." */
  description?: string
  /** 있으면 "다시 시도" 버튼 표시 */
  onRetry?: () => void
  /** 커스텀 액션 슬롯 (`onRetry` 버튼보다 위) */
  action?: ReactNode
}

/**
 * 오류 발생 시 안내와 재시도 액션을 보여주는 상태.
 *
 * @example
 * <ErrorState onRetry={refetch} />
 */
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
