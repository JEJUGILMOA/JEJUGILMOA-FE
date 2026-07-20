import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { toast as sonnerToast } from 'sonner'
import { cn, assertNever } from '@/utils/cn'
import {
  toastActionRecipe,
  toastActions,
  toastIcon,
  toastMessage,
  toastRoot,
} from './Toast.css.ts'

export type ToastType = 'success' | 'error' | 'info'

export type ToastAction = {
  /** 액션 버튼 라벨 */
  label: string
  /** 클릭 핸들러 (클릭 후 토스트도 닫힘) */
  onClick: () => void
  /** 버튼 톤. 기본값 default */
  tone?: 'default' | 'primary' | 'danger'
}

export type ToastProps = {
  /** 알림 종류 (아이콘·색) */
  type: ToastType
  /** 메시지 본문 */
  message: string
  /** 우측 액션 버튼들 */
  actions?: ToastAction[]
  className?: string
}

function ToastIcon({ type }: { type: ToastType }) {
  const iconProps = { size: 20, strokeWidth: 2, 'aria-hidden': true as const }

  switch (type) {
    case 'success':
      return <CheckCircle2 {...iconProps} />
    case 'error':
      return <XCircle {...iconProps} />
    case 'info':
      return <Info {...iconProps} />
    default:
      return assertNever(type)
  }
}

/**
 * 토스트 알림 UI. 보통 `toast` API를 통해 표시합니다.
 *
 * @example
 * <Toast type="success" message="저장되었습니다" actions={[{ label: '확인', onClick: close }]} />
 */
export function Toast({ type, message, actions, className }: ToastProps) {
  return (
    <div className={cn(toastRoot, className)} role="status">
      <span className={toastIcon({ type })}>
        <ToastIcon type={type} />
      </span>
      <p className={toastMessage}>{message}</p>
      {actions && actions.length > 0 ? (
        <div className={toastActions}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={toastActionRecipe({ tone: action.tone ?? 'default' })}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export type ShowToastOptions = {
  /** 알림 종류. 기본값 info */
  type?: ToastType
  /** 메시지 본문 */
  message: string
  /** 액션 버튼들 */
  actions?: ToastAction[]
  /** 표시 시간(ms). 미지정 시 sonner 기본값 */
  duration?: number
}

function showToast({ type = 'info', message, actions, duration }: ShowToastOptions) {
  return sonnerToast.custom(
    (id) => (
      <Toast
        type={type}
        message={message}
        actions={actions?.map((action) => ({
          ...action,
          onClick: () => {
            action.onClick()
            sonnerToast.dismiss(id)
          },
        }))}
      />
    ),
    { duration },
  )
}

/**
 * 앱 전역에서 쓰는 토스트 API (sonner + 커스텀 Toast UI).
 *
 * @example
 * toast.success('저장되었습니다')
 * toast.error('실패했습니다', { duration: 4000 })
 * toast.show({ type: 'info', message: '안내' })
 */
export const toast = {
  /** 옵션으로 토스트를 표시합니다. 반환값은 sonner toast id입니다. */
  show: showToast,
  /** 성공(success) 토스트를 표시합니다. */
  success: (message: string, options?: Omit<ShowToastOptions, 'type' | 'message'>) =>
    showToast({ ...options, type: 'success', message }),
  /** 오류(error) 토스트를 표시합니다. */
  error: (message: string, options?: Omit<ShowToastOptions, 'type' | 'message'>) =>
    showToast({ ...options, type: 'error', message }),
  /** 안내(info) 토스트를 표시합니다. */
  info: (message: string, options?: Omit<ShowToastOptions, 'type' | 'message'>) =>
    showToast({ ...options, type: 'info', message }),
  /** 토스트를 닫습니다. id 없이 호출하면 모두 닫힙니다. */
  dismiss: sonnerToast.dismiss,
}
