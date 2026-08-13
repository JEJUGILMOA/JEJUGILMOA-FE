import { addDays, format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { useCreatePlanMutation, usePlanQuery, useUpdatePlanInfoMutation } from '@/features/plans/hooks'
import type { CompanionType, PlanDraft } from '@/features/plans/types'
import { StepProgress } from './components/StepProgress'
import { pageStyle, progressTrackStyle, skipLinkStyle, topBarStyle } from './PlanCreatePage.css.ts'
import { BudgetStep } from './steps/BudgetStep'
import { CompanionStep } from './steps/CompanionStep'
import { DatesStep } from './steps/DatesStep'
import { InterestsStep } from './steps/InterestsStep'
import { TransportStep } from './steps/TransportStep'
import { TravelersStep } from './steps/TravelersStep'

type WizardStepId = 'transport' | 'dates' | 'companion' | 'travelers' | 'budget' | 'interests'

const STEP_PROGRESS_INDEX: Record<WizardStepId, number> = {
  transport: 0,
  dates: 1,
  companion: 2,
  travelers: 3,
  budget: 4,
  interests: 5,
}
const TOTAL_PROGRESS_STEPS = 6

const DATE_FORMAT = 'yyyy.MM.dd'

function defaultTravelerCount(companionType: CompanionType): number {
  switch (companionType) {
    case 'couple':
      return 2
    case 'family':
      return 4
    case 'friends':
      return 3
    case 'colleague':
      return 4
    case 'solo':
      return 1
  }
}

// 모든 단계는 건너뛰어도 계획 생성이 실패하지 않도록 처음부터 유효한 기본값을 채워 둔다.
const DEFAULT_COMPANION_TYPE: CompanionType = 'solo'
const initialDraft: PlanDraft = {
  transportMode: '비행기',
  arrivalTime: '09:00',
  departureTime: '18:00',
  startDate: format(new Date(), DATE_FORMAT),
  endDate: format(addDays(new Date(), 1), DATE_FORMAT),
  companionType: DEFAULT_COMPANION_TYPE,
  travelerCount: defaultTravelerCount(DEFAULT_COMPANION_TYPE),
  budgetTier: 'mid',
  interests: ['맛집 탐방', '자연/힐링'],
}

export function PlanCreatePage() {
  const navigate = useNavigate()
  const { planId } = useParams<{ planId?: string }>()
  const isEditMode = Boolean(planId)

  const [step, setStep] = useState<WizardStepId>('transport')
  const [draft, setDraft] = useState<PlanDraft>(initialDraft)
  const createPlanMutation = useCreatePlanMutation()
  const updatePlanInfoMutation = useUpdatePlanInfoMutation()

  const { data: existingPlan, isLoading: isExistingPlanLoading } = usePlanQuery(planId ?? '')
  const hasSyncedEditDraftRef = useRef(false)

  useEffect(() => {
    if (!isEditMode || !existingPlan || hasSyncedEditDraftRef.current) return
    setDraft({
      transportMode: existingPlan.transportMode,
      arrivalTime: existingPlan.arrivalTime,
      departureTime: existingPlan.departureTime,
      startDate: existingPlan.startDate,
      endDate: existingPlan.endDate,
      companionType: existingPlan.companionType,
      travelerCount: existingPlan.travelerCount,
      budgetTier: existingPlan.budgetTier,
      interests: existingPlan.interests,
    })
    hasSyncedEditDraftRef.current = true
  }, [isEditMode, existingPlan])

  const goBack = () => {
    switch (step) {
      case 'transport':
        navigate(-1)
        return
      case 'dates':
        setStep('transport')
        return
      case 'companion':
        setStep('dates')
        return
      case 'travelers':
        setStep('companion')
        return
      case 'budget':
        setStep(draft.companionType === 'solo' ? 'companion' : 'travelers')
        return
      case 'interests':
        setStep('budget')
    }
  }

  const handleComplete = () => {
    if (isEditMode && planId) {
      updatePlanInfoMutation.mutate(
        { planId, draft },
        {
          onSuccess: () => {
            toast.success('여행 정보를 수정했어요')
            // 완료된 수정 화면(/plan/:id/edit)도 히스토리에서 대체해 뒤로가기 시
            // 다시 마운트되지 않고 그 이전(미리보기 전 화면)으로 나가게 한다.
            navigate(ROUTES.planPreview(planId), { replace: true })
          },
          onError: () => {
            toast.error('여행 정보 수정에 실패했어요. 다시 시도해 주세요.')
          },
        },
      )
      return
    }

    createPlanMutation.mutate(draft, {
      onSuccess: (plan) => {
        toast.success('여행 계획을 만들었어요')
        // 완료된 마법사(/plan/new)는 히스토리에서 대체한다 — 뒤로가기를 눌렀을 때
        // 이미 끝난 마법사가 처음부터 다시 마운트되는 대신, 그 이전 화면(계획 목록)으로 나가게 한다.
        navigate(ROUTES.planWaypoints(plan.id), { replace: true })
      },
      onError: () => {
        toast.error('계획 생성에 실패했어요. 다시 시도해 주세요.')
      },
    })
  }

  // 관심사가 마지막 입력 항목이라, 여기서 다음으로 넘어가면 바로 계획을 완성한다
  // (중간 확인 화면 없이).
  const goNext = () => {
    switch (step) {
      case 'transport':
        setStep('dates')
        return
      case 'dates':
        setStep('companion')
        return
      case 'companion':
        setStep(draft.companionType === 'solo' ? 'budget' : 'travelers')
        return
      case 'travelers':
        setStep('budget')
        return
      case 'budget':
        setStep('interests')
        return
      case 'interests':
        handleComplete()
    }
  }

  if (isEditMode && (isExistingPlanLoading || !existingPlan)) {
    return (
      <div>
        <PageHeader title="여행 정보 수정" showBack onBack={() => navigate(-1)} />
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={isEditMode ? '여행 정보 수정' : '여행 계획 만들기'}
        showBack
        onBack={goBack}
        rightSlot={
          <button type="button" className={skipLinkStyle} onClick={goNext}>
            건너뛰기
          </button>
        }
      />

      <div className={pageStyle}>
        <div className={topBarStyle}>
          <div className={progressTrackStyle}>
            <StepProgress total={TOTAL_PROGRESS_STEPS} activeIndex={STEP_PROGRESS_INDEX[step]} />
          </div>
        </div>

        {step === 'transport' ? (
          <TransportStep
            transportMode={draft.transportMode}
            arrivalTime={draft.arrivalTime}
            departureTime={draft.departureTime}
            onChangeTransportMode={(transportMode) => setDraft((prev) => ({ ...prev, transportMode }))}
            onChangeArrivalTime={(arrivalTime) => setDraft((prev) => ({ ...prev, arrivalTime }))}
            onChangeDepartureTime={(departureTime) => setDraft((prev) => ({ ...prev, departureTime }))}
            onNext={goNext}
          />
        ) : null}

        {step === 'dates' ? (
          <DatesStep
            startDate={draft.startDate}
            endDate={draft.endDate}
            onChange={(startDate, endDate) => setDraft((prev) => ({ ...prev, startDate, endDate }))}
            onNext={goNext}
          />
        ) : null}

        {step === 'companion' ? (
          <CompanionStep
            companionType={draft.companionType}
            onChange={(companionType) =>
              setDraft((prev) => ({
                ...prev,
                companionType,
                travelerCount: defaultTravelerCount(companionType),
              }))
            }
            onNext={goNext}
          />
        ) : null}

        {step === 'travelers' ? (
          <TravelersStep
            travelerCount={draft.travelerCount}
            onChange={(travelerCount) => setDraft((prev) => ({ ...prev, travelerCount }))}
            onNext={goNext}
          />
        ) : null}

        {step === 'budget' ? (
          <BudgetStep
            budgetTier={draft.budgetTier}
            onChange={(budgetTier) => setDraft((prev) => ({ ...prev, budgetTier }))}
            onNext={goNext}
          />
        ) : null}

        {step === 'interests' ? (
          <InterestsStep
            interests={draft.interests}
            onToggle={(theme) =>
              setDraft((prev) => ({
                ...prev,
                interests: prev.interests.includes(theme)
                  ? prev.interests.filter((item) => item !== theme)
                  : [...prev.interests, theme],
              }))
            }
            onNext={goNext}
            isSubmitting={isEditMode ? updatePlanInfoMutation.isPending : createPlanMutation.isPending}
          />
        ) : null}
      </div>
    </div>
  )
}
