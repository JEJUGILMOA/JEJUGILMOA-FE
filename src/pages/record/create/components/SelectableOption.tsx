import { optionDescriptionStyle, optionRecipe, optionTitleStyle } from './SelectableOption.css.ts'
import { cn } from '@/utils/cn'

export type SelectableOptionProps = {
  title: string
  description?: string
  selected: boolean
  onSelect: () => void
  className?: string
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
}: SelectableOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={cn(optionRecipe({ selected }), className)}
      onClick={onSelect}
    >
      <span className={optionTitleStyle}>{title}</span>
      {description ? <span className={optionDescriptionStyle}>{description}</span> : null}
    </button>
  )
}
