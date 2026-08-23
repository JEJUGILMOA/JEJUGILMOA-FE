import { descStyle, labelStyle, listStyle, radioRecipe, rowRecipe } from './BudgetOptionRow.css.ts'

export type BudgetOption = {
  key: string
  label: string
  description: string
}

export type BudgetOptionListProps = {
  options: BudgetOption[]
  selectedKey: string
  onSelect: (key: string) => void
}

/** STEP 01-5: 예산대 선택 라디오 리스트 */
export function BudgetOptionList({ options, selectedKey, onSelect }: BudgetOptionListProps) {
  return (
    <div className={listStyle} role="radiogroup" aria-label="예산대">
      {options.map((option) => {
        const selected = option.key === selectedKey
        return (
          <button
            key={option.key}
            type="button"
            role="radio"
            aria-checked={selected}
            className={rowRecipe({ selected })}
            onClick={() => onSelect(option.key)}
          >
            <span>
              <span className={labelStyle}>{option.label}</span>
              <div className={descStyle}>{option.description}</div>
            </span>
            <span className={radioRecipe({ selected })} aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
