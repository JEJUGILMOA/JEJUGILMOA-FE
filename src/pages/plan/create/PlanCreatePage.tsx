import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { useCreatePlanMutation } from '@/features/plans/hooks'
import type { CompanionType, PlanDraft } from '@/features/plans/types'
import { StepProgress } from './components/StepProgress'
import { pageStyle, progressTrackStyle, skipLinkStyle, topBarStyle } from './PlanCreatePage.css.ts'
import { BudgetStep } from './steps/BudgetStep'
import { CompanionStep } from './steps/CompanionStep'
import { DatesStep } from './steps/DatesStep'
import { InterestsStep } from './steps/InterestsStep'
import { SummaryStep } from './steps/SummaryStep'
import { TransportStep } from './steps/TransportStep'
import { TravelersStep } from './steps/TravelersStep'

type WizardStepId = 'transport' | 'dates' | 'companion' | 'travelers' | 'budget' | 'interests' | 'summary'

const STEP_PROGRESS_INDEX: Record<Exclude<WizardStepId, 'summary'>, number> = {
  transport: 0,
  dates: 1,
  companion: 2,
  travelers: 3,
  budget: 4,
  interests: 5,
}
const TOTAL_PROGRESS_STEPS = 6

const initialDraft: PlanDraft = {
  transportMode: '비행기',
  arrivalTime: '09:00',
  departureTime: '18:00',
  startDate: null,
  endDate: null,
  companionType: null,
  travelerCount: 2,
  budgetTier: 'mid',
  interests: ['맛집 탐방', '자연/힐링'],
}

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

export function PlanCreatePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<WizardStepId>('transport')
  const [draft, setDraft] = useState<PlanDraft>(initialDraft)
  const createPlanMutation = useCreatePlanMutation()

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
        return
      case 'summary':
        setStep('interests')
    }
  }

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
        setStep('summary')
        return
      case 'summary':
    }
  }

  const handleReset = () => {
    setDraft(initialDraft)
    setStep('transport')
  }

  const handleComplete = () => {
    createPlanMutation.mutate(draft, {
      onSuccess: (plan) => {
        toast.success('여행 계획을 만들었어요')
        navigate(ROUTES.planWaypoints(plan.id))
      },
      onError: () => {
        toast.error('계획 생성에 실패했어요. 다시 시도해 주세요.')
      },
    })
  }

  return (
    <div>
      <PageHeader title="여행 계획 만들기" showBack onBack={goBack} />

      <div className={pageStyle}>
        {step !== 'summary' ? (
          <div className={topBarStyle}>
            <div className={progressTrackStyle}>
              <StepProgress total={TOTAL_PROGRESS_STEPS} activeIndex={STEP_PROGRESS_INDEX[step]} />
            </div>
            {step !== 'dates' ? (
              <button type="button" className={skipLinkStyle} onClick={goNext}>
                건너뛰기
              </button>
            ) : null}
          </div>
        ) : null}

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
          />
        ) : null}

        {step === 'summary' ? (
          <SummaryStep
            draft={draft}
            isSubmitting={createPlanMutation.isPending}
            onComplete={handleComplete}
            onReset={handleReset}
          />
        ) : null}
      </div>
    </div>
  )
}
