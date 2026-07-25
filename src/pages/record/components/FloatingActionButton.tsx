import { Plus } from 'lucide-react'
import { fabStyle } from './FloatingActionButton.css.ts'

export type FloatingActionButtonProps = {
  onClick: () => void
  'aria-label': string
}

/** 화면 우하단에 고정되는 원형 액션 버튼 (STEP 05 기록 생성 진입점) */
export function FloatingActionButton({ onClick, 'aria-label': ariaLabel }: FloatingActionButtonProps) {
  return (
    <button type="button" className={fabStyle} onClick={onClick} aria-label={ariaLabel}>
      <Plus size={24} aria-hidden />
    </button>
  )
}
