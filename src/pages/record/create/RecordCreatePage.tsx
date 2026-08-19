import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { useCompletedTripsQuery, useCreateRecordMutation } from '@/features/records/hooks'
import type { PlaceMemo, RecordDraft } from '@/features/records/types'
import { DetailsStep } from './steps/DetailsStep'
import { PhotosStep } from './steps/PhotosStep'
import { TripSelectStep } from './steps/TripSelectStep'
import { VisibilityStep } from './steps/VisibilityStep'
import { pageStyle, stepIndicatorStyle } from './RecordCreatePage.css.ts'

const TOTAL_STEPS = 4

function buildInitialDraft(preselectedTripId: string | null, preselectedTripTitle: string | null): RecordDraft {
  return {
    tripId: preselectedTripId,
    title: preselectedTripTitle ?? '',
    summary: '',
    placeMemos: {},
    extraPhotos: [],
    coverPhoto: null,
    visibility: 'public',
  }
}

export function RecordCreatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  // STEP 09 '이 계획으로 새 기록 남기기'에서 넘어온 경우 여행이 미리 선택된 채 STEP 02부터 시작한다.
  // 제목도 함께 넘겨받아 이 페이지의 여행 목록 로딩을 기다리지 않고 바로 채운다.
  const preselectedState = location.state as { tripId?: string; tripTitle?: string } | null
  const preselectedTripId = preselectedState?.tripId ?? null
  const preselectedTripTitle = preselectedState?.tripTitle ?? null

  const [step, setStep] = useState(preselectedTripId ? 2 : 1)
  const [draft, setDraft] = useState<RecordDraft>(() =>
    buildInitialDraft(preselectedTripId, preselectedTripTitle),
  )

  const { data: trips = [], isLoading: isTripsLoading } = useCompletedTripsQuery()
  const createRecordMutation = useCreateRecordMutation()

  const selectedTrip = trips.find((trip) => trip.id === draft.tripId) ?? null

  const goBack = () => {
    if (step === 1) {
      navigate(-1)
      return
    }
    setStep((prev) => prev - 1)
  }

  const goNext = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS))

  const handleSelectTrip = (tripId: string) => {
    const trip = trips.find((item) => item.id === tripId)
    setDraft((prev) => ({
      ...prev,
      tripId,
      title: prev.title || trip?.title || '',
    }))
  }

  const handleSaveMemo = (placeId: string, memo: PlaceMemo) => {
    setDraft((prev) => ({
      ...prev,
      placeMemos: { ...prev.placeMemos, [placeId]: memo },
    }))
  }

  const handleComplete = () => {
    createRecordMutation.mutate(draft, {
      onSuccess: () => {
        toast.success('기록을 남겼어요')
        navigate(ROUTES.record)
      },
      onError: () => {
        toast.error('기록 저장에 실패했어요. 다시 시도해 주세요.')
      },
    })
  }

  return (
    <div>
      <PageHeader
        title="기록 작성"
        showBack
        onBack={goBack}
        rightSlot={
          <span className={stepIndicatorStyle}>
            {step} / {TOTAL_STEPS}
          </span>
        }
      />

      <div className={pageStyle}>
        {step === 1 ? (
          <TripSelectStep
            trips={trips}
            isLoading={isTripsLoading}
            selectedTripId={draft.tripId}
            onSelect={handleSelectTrip}
            onNext={goNext}
          />
        ) : null}

        {step === 2 && !selectedTrip && isTripsLoading ? (
          <Loading label="여행 정보를 불러오는 중…" />
        ) : null}

        {step === 2 && selectedTrip ? (
          <DetailsStep
            trip={selectedTrip}
            title={draft.title}
            summary={draft.summary}
            placeMemos={draft.placeMemos}
            onTitleChange={(title) => setDraft((prev) => ({ ...prev, title }))}
            onSummaryChange={(summary) => setDraft((prev) => ({ ...prev, summary }))}
            onSaveMemo={handleSaveMemo}
            onNext={goNext}
          />
        ) : null}

        {step === 3 && selectedTrip ? (
          <PhotosStep
            trip={selectedTrip}
            placeMemos={draft.placeMemos}
            extraPhotos={draft.extraPhotos}
            coverPhoto={draft.coverPhoto}
            onAddExtraPhotos={(files) =>
              setDraft((prev) => ({ ...prev, extraPhotos: [...prev.extraPhotos, ...files] }))
            }
            onRemoveExtraPhoto={(file) =>
              setDraft((prev) => ({
                ...prev,
                extraPhotos: prev.extraPhotos.filter((photo) => photo !== file),
              }))
            }
            onSelectCover={(file) => setDraft((prev) => ({ ...prev, coverPhoto: file }))}
            onNext={goNext}
          />
        ) : null}

        {step === 4 ? (
          <VisibilityStep
            visibility={draft.visibility}
            onChange={(visibility) => setDraft((prev) => ({ ...prev, visibility }))}
            onComplete={handleComplete}
            isSubmitting={createRecordMutation.isPending}
          />
        ) : null}
      </div>
    </div>
  )
}
