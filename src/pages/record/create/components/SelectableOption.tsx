import { optionDescriptionStyle, optionRecipe, optionTitleStyle } from './SelectableOption.css.ts'
import { cn } from '@/utils/cn'

export type SelectableOptionProps = {
  title: string
  description?: string
  selected: boolean
  onSelect: () => void
  className?: string
  /** true면 선택 불가 (예: 반영 중인 요청이 있을 때 연타 방지) */
  disabled?: boolean
}

/**
 * 단일 선택 카드형 옵션. 여행 선택·공개 범위 선택 등 라디오 성격의 목록에 사용.
 */
export function SelectableOption({
  title,
  description,
  selected,
  onSelect,
  className,
  disabled = false,
}: SelectableOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      className={cn(optionRecipe({ selected }), className)}
      onClick={onSelect}
    >
      <span className={optionTitleStyle}>{title}</span>
      {description ? <span className={optionDescriptionStyle}>{description}</span> : null}
    </button>
  )
}
