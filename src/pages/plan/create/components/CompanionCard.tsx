import { badgeRecipe, cardRecipe, descStyle, gridStyle, labelStyle } from './CompanionCard.css.ts'

export type CompanionOption = {
  key: string
  label: string
  description: string
}

export type CompanionCardGridProps = {
  options: CompanionOption[]
  selectedKey: string | null
  onSelect: (key: string) => void
}

/** STEP 01-3: 동행 유형 선택 카드 그리드 (마지막 항목은 전체 너비) */
export function CompanionCardGrid({ options, selectedKey, onSelect }: CompanionCardGridProps) {
  return (
    <div className={gridStyle} role="radiogroup" aria-label="동행 유형">
      {options.map((option, index) => {
        const selected = option.key === selectedKey
        return (
          <button
            key={option.key}
            type="button"
            role="radio"
            aria-checked={selected}
            className={cardRecipe({ selected, fullWidth: index === options.length - 1 })}
            onClick={() => onSelect(option.key)}
          >
            <span className={badgeRecipe({ selected })} aria-hidden>
              {option.label.slice(0, 1)}
            </span>
            <span className={labelStyle}>{option.label}</span>
            <span className={descStyle}>{option.description}</span>
          </button>
        )
      })}
    </div>
  )
}
