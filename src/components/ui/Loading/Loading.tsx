import { loadingStyle, spinnerStyle } from './Loading.css.ts'

type LoadingProps = {
  /** 안내 문구. 기본값 "불러오는 중…" */
  label?: string
}

/**
 * 로딩 스피너와 안내 문구.
 *
 * @example
 * <Loading label="불러오는 중…" />
 */
export function Loading({ label = '불러오는 중…' }: LoadingProps) {
  return (
    <div className={loadingStyle} role="status" aria-live="polite">
      <span className={spinnerStyle} aria-hidden />
      <span>{label}</span>
    </div>
  )
}
