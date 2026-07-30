import { Button } from '@/components/ui/Button/Button'
import type { BudgetTier } from '@/features/plans/types'
import { BudgetOptionList, type BudgetOption } from '../components/BudgetOptionRow'
import { stepDescriptionStyle, stepHeaderStyle, stepTitleStyle } from '../PlanCreatePage.css.ts'

const BUDGET_OPTIONS: (BudgetOption & { key: BudgetTier })[] = [
  { key: 'low', label: '~30만원', description: '알뜰하게 즐기는 여행' },
  { key: 'mid', label: '30~60만원', description: '적당하게 즐기는 여행' },
  { key: 'high', label: '60~100만원', description: '여유롭게 즐기는 여행' },
  { key: 'premium', label: '100만원~', description: '프리미엄 여행' },
]

export type BudgetStepProps = {
  budgetTier: BudgetTier
  onChange: (budgetTier: BudgetTier) => void
  onNext: () => void
}

/** STEP 01-5: 예산대 선택 */
export function BudgetStep({ budgetTier, onChange, onNext }: BudgetStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>여행 예산은 어느 정도인가요?</h2>
        <p className={stepDescriptionStyle}>1인 기준 예상 경비를 선택해주세요.</p>
      </div>

      <BudgetOptionList
        options={BUDGET_OPTIONS}
        selectedKey={budgetTier}
        onSelect={(key) => onChange(key as BudgetTier)}
      />

      <Button fullWidth size="lg" onClick={onNext}>
        다음
      </Button>
    </>
  )
}
