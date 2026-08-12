import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { TextField } from '@/components/ui/TextField/TextField'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { MOCK_PLACES } from '@/data/mockExplore'
import { usePlanQuery, useUpdatePlanBudgetMutation } from '@/features/plans/hooks'
import type { BudgetCategory, BudgetTier } from '@/features/plans/types'
import {
  descriptionStyle,
  feeHintStyle,
  formStyle,
  headerBlockStyle,
  pageStyle,
  perPersonStyle,
  skipButtonStyle,
  suggestionHintStyle,
  titleStyle,
  totalCardRowStyle,
  totalCardStyle,
  totalLabelStyle,
  totalValueStyle,
} from './PlanBudgetPage.css.ts'

const BUDGET_CATEGORIES: { key: BudgetCategory; label: string }[] = [
  { key: 'transport', label: '교통비' },
  { key: 'lodging', label: '숙박' },
  { key: 'food', label: '식비' },
  { key: 'etc', label: '기타(입장료 등)' },
]

const EMPTY_AMOUNTS: Record<BudgetCategory, string> = {
  transport: '',
  lodging: '',
  food: '',
  etc: '',
}

/** 입력 편의를 위해 카테고리 입력값은 만원 단위 문자열로 다루고, 저장 시에만 원 단위로 변환한다. */
const WON_PER_MANWON = 10_000

/** STEP 01-5 예산대 선택의 "1인 기준 예상 경비" 대표값 (원) */
const BUDGET_TIER_AMOUNT: Record<BudgetTier, number> = {
  low: 300_000,
  mid: 450_000,
  high: 800_000,
  premium: 1_000_000,
}

/**
 * STEP 01-5에서 고른 예산대 × 인원수로 참고용 총액만 계산한다.
 * 교통비/숙박/식비/기타 배분은 사람마다 크게 달라서 임의로 나누지 않고,
 * 총액만 참고 정보로 보여주고 카테고리별 입력은 사용자가 직접 채우게 한다.
 */
function computeSuggestedTotal(budgetTier: BudgetTier, travelerCount: number): number {
  return BUDGET_TIER_AMOUNT[budgetTier] * travelerCount
}

export function PlanBudgetPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { data: plan, isLoading } = usePlanQuery(planId)
  const updateBudgetMutation = useUpdatePlanBudgetMutation()

  const [amounts, setAmounts] = useState<Record<BudgetCategory, string>>(EMPTY_AMOUNTS)
  const [syncedPlanId, setSyncedPlanId] = useState<string | null>(null)

  // plan이 로드되면 렌더 중에 한 번 동기화한다 (effect + setState 대신 React가 권장하는
  // "props 변경에 따른 state 조정" 패턴 — 불필요한 추가 렌더링 사이클을 피한다).
  if (plan && plan.id !== syncedPlanId) {
    setSyncedPlanId(plan.id)
    setAmounts(
      plan.budgetDetail
        ? {
            transport: String(Math.round(plan.budgetDetail.transport / WON_PER_MANWON)),
            lodging: String(Math.round(plan.budgetDetail.lodging / WON_PER_MANWON)),
            food: String(Math.round(plan.budgetDetail.food / WON_PER_MANWON)),
            etc: String(Math.round(plan.budgetDetail.etc / WON_PER_MANWON)),
          }
        : EMPTY_AMOUNTS,
    )
  }

  const suggestedTotal =
    plan && !plan.budgetDetail ? computeSuggestedTotal(plan.budgetTier, plan.travelerCount) : null

  const paidPlaces = (plan?.waypointPlaceIds ?? []).reduce<{ title: string; fee: string }[]>(
    (list, placeId) => {
      const place = MOCK_PLACES.find((item) => item.id === placeId)
      if (place?.fee && place.fee !== '무료') {
        list.push({ title: place.title, fee: place.fee })
      }
      return list
    },
    [],
  )

  const goBack = () => navigate(-1)

  const handleAmountChange = (category: BudgetCategory, value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '')
    setAmounts((prev) => ({ ...prev, [category]: digitsOnly }))
  }

  const total =
    BUDGET_CATEGORIES.reduce((sum, { key }) => sum + (Number(amounts[key]) || 0), 0) *
    WON_PER_MANWON

  const handleSkip = () => {
    navigate(ROUTES.planPreview(planId))
  }

  const handleNext = () => {
    const budgetDetail: Record<BudgetCategory, number> = {
      transport: (Number(amounts.transport) || 0) * WON_PER_MANWON,
      lodging: (Number(amounts.lodging) || 0) * WON_PER_MANWON,
      food: (Number(amounts.food) || 0) * WON_PER_MANWON,
      etc: (Number(amounts.etc) || 0) * WON_PER_MANWON,
    }

    updateBudgetMutation.mutate(
      { planId, budgetDetail },
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
        rightSlot={
          <button type="button" className={skipButtonStyle} onClick={handleSkip}>
            건너뛰기
          </button>
        }
      />

      {isLoading || !plan ? (
        <Loading label="여행 계획을 불러오는 중…" />
      ) : (
        <div className={pageStyle}>
          <div className={headerBlockStyle}>
            <h2 className={titleStyle}>이번 여행의 예산을 계획해보세요</h2>
            <p className={descriptionStyle}>선택 항목이에요. 나중에 다시 입력할 수 있어요.</p>
            {suggestedTotal !== null ? (
              <p className={suggestionHintStyle}>
                선택하신 예산대는 1인 기준 약 {BUDGET_TIER_AMOUNT[plan.budgetTier].toLocaleString()}
                원이에요. 인원수({plan.travelerCount}명)를 반영한 총 예산은 약{' '}
                {suggestedTotal.toLocaleString()}원이에요. 카테고리별로 자유롭게 나눠 입력해 주세요.
              </p>
            ) : null}
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
            {paidPlaces.length > 0 ? (
              <p className={feeHintStyle}>
                선택하신 장소 중 입장료가 있는 곳:{' '}
                {paidPlaces.map((place) => `${place.title}(${place.fee})`).join(', ')} — 기타 항목에
                반영해보세요.
              </p>
            ) : null}
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
            다음
          </Button>
        </div>
      )}
    </div>
  )
}
