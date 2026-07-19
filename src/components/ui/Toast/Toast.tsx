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
  label: string
  onClick: () => void
  tone?: 'default' | 'primary' | 'danger'
}

export type ToastProps = {
  type: ToastType
  message: string
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
  type?: ToastType
  message: string
  actions?: ToastAction[]
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

/** 앱 전역에서 쓰는 토스트 API (sonner + 커스텀 Toast UI) */
export const toast = {
  show: showToast,
  success: (message: string, options?: Omit<ShowToastOptions, 'type' | 'message'>) =>
    showToast({ ...options, type: 'success', message }),
  error: (message: string, options?: Omit<ShowToastOptions, 'type' | 'message'>) =>
    showToast({ ...options, type: 'error', message }),
  info: (message: string, options?: Omit<ShowToastOptions, 'type' | 'message'>) =>
    showToast({ ...options, type: 'info', message }),
  dismiss: sonnerToast.dismiss,
}
