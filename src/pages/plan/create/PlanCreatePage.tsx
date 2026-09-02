import { addDays, differenceInCalendarDays, format, parse } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Loading } from '@/components/ui/Loading/Loading'
import { Modal } from '@/components/ui/Modal/Modal'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { usePlanQuery } from '@/features/plans/hooks'
import { suggestPlanTitle, toTravelPlan } from '@/features/plans/api'
import { NEW_PLAN_ID, planDraftStore } from '@/features/plans/planDraftStore'
import type { CompanionType, DayItinerary, PlanDraft, TravelPlan } from '@/features/plans/types'
import { StepProgress } from './components/StepProgress'
import { pageShellStyle, pageStyle, progressTrackStyle, topBarStyle } from './PlanCreatePage.css.ts'
import { CompanionStep } from './steps/CompanionStep'
import { DatesStep } from './steps/DatesStep'
import { InterestsStep } from './steps/InterestsStep'
import { TitleStep } from './steps/TitleStep'
import { TravelersStep } from './steps/TravelersStep'

type WizardStepId = 'dates' | 'companion' | 'travelers' | 'interests' | 'title'

const STEP_PROGRESS_INDEX: Record<WizardStepId, number> = {
  dates: 0,
  companion: 1,
  travelers: 2,
  interests: 3,
  title: 4,
}
const TOTAL_PROGRESS_STEPS = 5

const DATE_FORMAT = 'yyyy.MM.dd'

function hasDayContent(day: DayItinerary | undefined): boolean {
  if (!day) return false
  return Boolean(day.departure) || day.waypoints.length > 0
}

/** 실제로 장소가 배정된 Day 중 가장 늦은 번호. 아무 Day에도 아직 아무것도 안 담았으면 0. */
function getLastPlannedDay(itinerary: Record<number, DayItinerary>): number {
  return Object.entries(itinerary).reduce(
    (max, [dayKey, day]) => (hasDayContent(day) && Number(dayKey) > max ? Number(dayKey) : max),
    0,
  )
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

// 모든 단계는 건너뛰어도 계획 생성이 실패하지 않도록 처음부터 유효한 기본값을 채워 둔다.
const DEFAULT_COMPANION_TYPE: CompanionType = 'solo'
const initialDraft: PlanDraft = {
  startDate: format(new Date(), DATE_FORMAT),
  endDate: format(addDays(new Date(), 1), DATE_FORMAT),
  companionType: DEFAULT_COMPANION_TYPE,
  travelerCount: defaultTravelerCount(DEFAULT_COMPANION_TYPE),
  interests: ['FOOD', 'NATURE'],
  title: '',
}

export function PlanCreatePage() {
  const navigate = useNavigate()
  const { planId } = useParams<{ planId?: string }>()
  const isEditMode = Boolean(planId)

  const [step, setStep] = useState<WizardStepId>('dates')
  const [draft, setDraft] = useState<PlanDraft>(initialDraft)
  const [showDateShrinkWarning, setShowDateShrinkWarning] = useState(false)

  const { data: existingPlan, isLoading: isExistingPlanLoading } = usePlanQuery(planId ?? '')
  const hasSyncedEditDraftRef = useRef(false)
  // 저장된 계획은 이미 그 날짜 기준으로 Day별 일정이 짜여 있어서, 날짜를 바꾸면
  // 일부 Day의 일정이 조용히 갈 곳을 잃는다 — 그래서 날짜만 수정 자체를 막는다.
  const isDateEditLocked = isEditMode && Boolean(existingPlan) && existingPlan?.status !== 'draft'
  // draft는 날짜를 계속 바꿀 수 있지만, 이미 일정을 짜둔 상태에서 날짜를 줄이면
  // 저장된 계획과 같은 문제가 생긴다 — 막지는 않되 줄이기 직전에 한 번 경고한다.
  const lastPlannedDay =
    isEditMode && existingPlan?.status === 'draft' ? getLastPlannedDay(existingPlan.itinerary) : 0

  useEffect(() => {
    if (!isEditMode || !existingPlan || hasSyncedEditDraftRef.current) return
    setDraft({
      startDate: existingPlan.startDate,
      endDate: existingPlan.endDate,
      companionType: existingPlan.companionType,
      travelerCount: existingPlan.travelerCount,
      interests: existingPlan.interests,
      title: existingPlan.title,
    })
    hasSyncedEditDraftRef.current = true
  }, [isEditMode, existingPlan])

  const goBack = () => {
    switch (step) {
      case 'dates':
        navigate(-1)
        return
      case 'companion':
        setStep('dates')
        return
      case 'travelers':
        setStep('companion')
        return
      case 'interests':
        setStep(draft.companionType === 'solo' ? 'companion' : 'travelers')
        return
      case 'title':
        setStep('interests')
    }
  }

  // v2는 STEP1~5를 전부 로컬(planDraftStore)에서만 편집하고, STEP6 "계획 저장하기"에서
  // 딱 한 번 서버로 보낸다. 그래서 여기선 서버 호출 없이 draft를 스토어에 채워 넣기만 한다.
  const handleComplete = () => {
    if (isEditMode && planId && existingPlan) {
      const updated: TravelPlan = {
        ...existingPlan,
        startDate: draft.startDate ?? existingPlan.startDate,
        endDate: draft.endDate ?? existingPlan.endDate,
        companionType: draft.companionType ?? existingPlan.companionType,
        travelerCount: draft.travelerCount,
        interests: draft.interests,
        title: draft.title.trim() || existingPlan.title,
      }
      planDraftStore.getState().setDraft(updated)
      toast.success('여행 정보를 수정했어요')
      // 완료된 수정 화면(/plan/:id/edit)도 히스토리에서 대체해 뒤로가기 시
      // 다시 마운트되지 않고 그 이전(미리보기 전 화면)으로 나가게 한다.
      navigate(ROUTES.planPreview(planId), { replace: true })
      return
    }

    const newPlan: TravelPlan = { ...toTravelPlan(draft), id: NEW_PLAN_ID }
    planDraftStore.getState().setDraft(newPlan)
    toast.success('여행 계획을 만들었어요')
    // 완료된 마법사(/plan/new)는 히스토리에서 대체한다 — 뒤로가기를 눌렀을 때
    // 이미 끝난 마법사가 처음부터 다시 마운트되는 대신, 그 이전 화면(계획 목록)으로 나가게 한다.
    navigate(ROUTES.planItinerary(NEW_PLAN_ID), { replace: true })
  }

  // 제목 입력이 마지막 단계라, 여기서 다음으로 넘어가면 바로 계획을 완성한다.
  const goNext = () => {
    switch (step) {
      case 'dates': {
        if (lastPlannedDay > 0 && draft.startDate && draft.endDate) {
          const start = parse(draft.startDate, DATE_FORMAT, new Date())
          const end = parse(draft.endDate, DATE_FORMAT, new Date())
          const newDayCount = Math.max(differenceInCalendarDays(end, start) + 1, 1)
          if (newDayCount < lastPlannedDay) {
            setShowDateShrinkWarning(true)
            return
          }
        }
        setStep('companion')
        return
      }
      case 'companion':
        setStep(draft.companionType === 'solo' ? 'interests' : 'travelers')
        return
      case 'travelers':
        setStep('interests')
        return
      case 'interests':
        setStep('title')
        return
      case 'title':
        handleComplete()
    }
  }

  if (isEditMode && (isExistingPlanLoading || !existingPlan)) {
    return (
      <div className={pageShellStyle}>
        <PageHeader title="여행 정보 수정" showBack onBack={() => navigate(-1)} />
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  return (
    <div className={pageShellStyle}>
      <PageHeader
        title={isEditMode ? '여행 정보 수정' : '여행 계획 만들기'}
        showBack
        onBack={goBack}
        actions={[{ id: 'skip', label: '건너뛰기', tone: 'muted', onPress: goNext }]}
      />

      <div className={pageStyle}>
        <div className={topBarStyle}>
          <div className={progressTrackStyle}>
            <StepProgress total={TOTAL_PROGRESS_STEPS} activeIndex={STEP_PROGRESS_INDEX[step]} />
          </div>
        </div>

        {step === 'dates' ? (
          <DatesStep
            startDate={draft.startDate}
            endDate={draft.endDate}
            onChange={(startDate, endDate) => setDraft((prev) => ({ ...prev, startDate, endDate }))}
            onNext={goNext}
            readOnly={isDateEditLocked}
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

        {step === 'title' ? (
          <TitleStep
            title={draft.title}
            onChange={(title) => setDraft((prev) => ({ ...prev, title }))}
            onNext={goNext}
            suggestedTitle={suggestPlanTitle(draft.startDate, draft.endDate)}
            isSubmitting={false}
          />
        ) : null}
      </div>

      <Modal
        open={showDateShrinkWarning}
        title="날짜를 줄이면 일정이 사라져요"
        description={`이미 ${lastPlannedDay}일차까지 일정을 짜두셨어요. 날짜를 줄이면 그 이후 Day의 일정은 더 이상 볼 수 없어요.`}
        onClose={() => setShowDateShrinkWarning(false)}
        actions={[
          { label: '취소', variant: 'ghost', onClick: () => setShowDateShrinkWarning(false) },
          {
            label: '그대로 진행',
            variant: 'danger',
            onClick: () => {
              setShowDateShrinkWarning(false)
              setStep('companion')
            },
          },
        ]}
      />
    </div>
  )
}
