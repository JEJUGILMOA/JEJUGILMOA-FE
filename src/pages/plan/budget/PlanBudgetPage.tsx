import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { TextField } from '@/components/ui/TextField/TextField'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { usePlanQuery, useUpdatePlanBudgetMutation } from '@/features/plans/hooks'
import type { PlanBudgetRequest } from '@/features/plans/types'
import {
  descriptionStyle,
  formStyle,
  headerBlockStyle,
  pageStyle,
  perPersonStyle,
  titleStyle,
  totalCardRowStyle,
  totalCardStyle,
  totalLabelStyle,
  totalValueStyle,
} from './PlanBudgetPage.css.ts'

type BudgetField = keyof PlanBudgetRequest

const BUDGET_CATEGORIES: { key: BudgetField; label: string }[] = [
  { key: 'budgetTransportation', label: '교통비' },
  { key: 'budgetAccommodation', label: '숙박' },
  { key: 'budgetFood', label: '식비' },
  { key: 'budgetEtc', label: '기타(입장료 등)' },
]

const EMPTY_AMOUNTS: Record<BudgetField, string> = {
  budgetTransportation: '',
  budgetAccommodation: '',
  budgetFood: '',
  budgetEtc: '',
}

/** 입력값은 API와 동일하게 만원 단위로 다룬다. 아래 총 예산 카드에서만 원 단위로 바꿔 보여준다. */
const WON_PER_MANWON = 10_000

export function PlanBudgetPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: plan, isPending } = usePlanQuery(planId)
  const updateBudgetMutation = useUpdatePlanBudgetMutation()

  // 미리보기의 연필 아이콘으로 들어왔으면 버튼 라벨을 "다음"이 아니라 "저장하기"로 보여준다.
  const fromPreview = Boolean((location.state as { fromPreview?: boolean } | null)?.fromPreview)

  const [amounts, setAmounts] = useState<Record<BudgetField, string>>(EMPTY_AMOUNTS)
  const [syncedPlanId, setSyncedPlanId] = useState<string | null>(null)

  // plan이 로드되면 렌더 중에 한 번 동기화한다 (effect + setState 대신 React가 권장하는
  // "props 변경에 따른 state 조정" 패턴 — 불필요한 추가 렌더링 사이클을 피한다).
  if (plan && plan.id !== syncedPlanId) {
    setSyncedPlanId(plan.id)
    setAmounts({
      budgetTransportation:
        plan.budgetTransportation !== null ? String(plan.budgetTransportation) : '',
      budgetAccommodation:
        plan.budgetAccommodation !== null ? String(plan.budgetAccommodation) : '',
      budgetFood: plan.budgetFood !== null ? String(plan.budgetFood) : '',
      budgetEtc: plan.budgetEtc !== null ? String(plan.budgetEtc) : '',
    })
  }

  const goBack = () => navigate(-1)

  const handleAmountChange = (field: BudgetField, value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '')
    setAmounts((prev) => ({ ...prev, [field]: digitsOnly }))
  }

  const totalManwon = BUDGET_CATEGORIES.reduce((sum, { key }) => sum + (Number(amounts[key]) || 0), 0)
  const total = totalManwon * WON_PER_MANWON

  const handleSkip = () => {
    navigate(ROUTES.planPreview(planId))
  }

  const handleNext = () => {
    const budget: PlanBudgetRequest = {
      budgetTransportation: amounts.budgetTransportation ? Number(amounts.budgetTransportation) : null,
      budgetAccommodation: amounts.budgetAccommodation ? Number(amounts.budgetAccommodation) : null,
      budgetFood: amounts.budgetFood ? Number(amounts.budgetFood) : null,
      budgetEtc: amounts.budgetEtc ? Number(amounts.budgetEtc) : null,
    }

    updateBudgetMutation.mutate(
      { planId, budget },
      {
        onSuccess: () => {
          toast.success('예산을 저장했어요')
          navigate(ROUTES.planPreview(planId))
        },
        onError: () => {
          toast.error('예산 저장에 실패했어요. 다시 시도해 주세요.')
        },
      },
    )
  }

  return (
    <div>
      <PageHeader
        title="예산 입력"
        showBack
        onBack={goBack}
        actions={[{ id: 'skip', label: '건너뛰기', tone: 'muted', onPress: handleSkip }]}
      />

      {isPending ? (
        <Loading label="여행 계획을 불러오는 중…" />
      ) : !plan ? (
        <p className={descriptionStyle}>계획을 불러오지 못했어요.</p>
      ) : (
        <div className={pageStyle}>
          <div className={headerBlockStyle}>
            <h2 className={titleStyle}>이번 여행의 예산을 계획해보세요</h2>
            <p className={descriptionStyle}>선택 항목이에요. 나중에 다시 입력할 수 있어요.</p>
          </div>

          <div className={formStyle}>
            {BUDGET_CATEGORIES.map(({ key, label }) => (
              <TextField
                key={key}
                label={label}
                type="number"
                value={amounts[key]}
                onChange={(value) => handleAmountChange(key, value)}
                placeholder="0"
                suffix="만원"
              />
            ))}
          </div>

          <div className={totalCardStyle}>
            <div className={totalCardRowStyle}>
              <span className={totalLabelStyle}>총 예산</span>
              <span className={totalValueStyle}>{total.toLocaleString()}원</span>
            </div>
            {plan.travelerCount > 1 ? (
              <span className={perPersonStyle}>
                1인당 약 {Math.round(total / plan.travelerCount).toLocaleString()}원
              </span>
            ) : null}
          </div>

          <Button
            fullWidth
            size="lg"
            isLoading={updateBudgetMutation.isPending}
            onClick={handleNext}
          >
            {fromPreview ? '저장하기' : '다음'}
          </Button>
        </div>
      )}
    </div>
  )
}
