import { loadingStyle, spinnerStyle } from './Loading.css.ts'

type LoadingProps = {
  label?: string
}

export function Loading({ label = '불러오는 중…' }: LoadingProps) {
  return (
    <div className={loadingStyle} role="status" aria-live="polite">
      <span className={spinnerStyle} aria-hidden />
      <span>{label}</span>
    </div>
  )
}
