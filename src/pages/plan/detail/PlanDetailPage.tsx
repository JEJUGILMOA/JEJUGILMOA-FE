import { useCallback, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getErrorMessage } from '@/api/error'
import { Button } from '@/components/ui/Button/Button'
import { Loading } from '@/components/ui/Loading/Loading'
import { Modal } from '@/components/ui/Modal/Modal'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { mapPath, openMapOnNative } from '@/features/map/openMap'
import { refreshTabsOnNative } from '@/features/navigation/refreshTabs'
import { usePlanQuery } from '@/features/plans/hooks'
import { useCancelTripMutation, useStartTripMutation } from '@/features/trips/hooks'
import { PlanOverview } from '@/pages/plan/components/PlanOverview/PlanOverview'
import { actionsRowStyle, actionsStyle, emptyHintStyle, pageStyle } from './PlanDetailPage.css.ts'

/** 저장된 계획 조회 — DRAFT에서 여행 시작 CTA 제공 */
export function PlanDetailPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const planQuery = usePlanQuery(planId)
  const startTripMutation = useStartTripMutation()
  const cancelTripMutation = useCancelTripMutation()
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false)
  /** 네이티브 버튼 탭 시 action+dismiss 레이스에서 isPending보다 먼저 막기 위함 */
  const cancellingRef = useRef(false)

  const goBack = () => navigate(-1)
  const plan = planQuery.data

  const goToActiveTripMap = () => {
    if (openMapOnNative({ mode: 'activeTrip' })) return
    navigate(mapPath({ mode: 'activeTrip' }))
  }

  const handleStartTrip = async () => {
    const numericId = Number(planId)
    if (!Number.isFinite(numericId) || numericId <= 0) {
      toast.error('유효하지 않은 계획이에요.')
      return
    }

    try {
      await startTripMutation.mutateAsync(numericId)
      toast.success('여행을 시작했어요')
      refreshTabsOnNative(['plan', 'map'])
      goToActiveTripMap()
    } catch (error) {
      toast.error(getErrorMessage(error, '여행 시작에 실패했어요. 다시 시도해 주세요.'))
    }
  }

  const closeCancelConfirm = useCallback(() => {
    if (cancellingRef.current || cancelTripMutation.isPending) return
    setCancelConfirmOpen(false)
  }, [cancelTripMutation.isPending])

  const handleCancelTrip = useCallback(() => {
    const numericId = Number(planId)
    if (!Number.isFinite(numericId) || numericId <= 0) {
      toast.error('유효하지 않은 여행이에요.')
      return
    }

    cancellingRef.current = true
    cancelTripMutation.mutate(numericId, {
      onSuccess: () => {
        setCancelConfirmOpen(false)
        toast.success('여행을 취소했어요')
        navigate(ROUTES.plan)
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, '여행 취소에 실패했어요. 다시 시도해 주세요.'))
      },
      onSettled: () => {
        cancellingRef.current = false
      },
    })
  }, [planId, cancelTripMutation, navigate])

  if (planQuery.isPending) {
    return (
      <div>
        <PageHeader title="여행 계획" showBack onBack={goBack} />
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  if (planQuery.isError || !plan) {
    return (
      <div>
        <PageHeader title="여행 계획" showBack onBack={goBack} />
        <p className={emptyHintStyle}>계획을 불러오지 못했어요.</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="여행 계획" showBack onBack={goBack} />

      <div className={pageStyle}>
        <PlanOverview plan={plan} editable={false} />

        <div className={actionsStyle}>
          {plan.status === 'draft' ? (
            <>
              <Button
                fullWidth
                size="lg"
                isLoading={startTripMutation.isPending}
                onClick={handleStartTrip}
              >
                여행 시작하기
              </Button>
              <Button
                fullWidth
                size="lg"
                variant="outline"
                onClick={() => navigate(ROUTES.planItinerary(planId))}
              >
                일정 수정
              </Button>
            </>
          ) : null}

          {plan.status === 'ongoing' ? (
            <div className={actionsRowStyle}>
              <Button
                fullWidth
                size="lg"
                variant="danger"
                isLoading={cancelTripMutation.isPending}
                onClick={(event) => {
                  // 네이티브 모달이 touchend 전에 뜨면 :active 색이 남는 iOS/WebView 이슈
                  event.currentTarget.blur()
                  window.setTimeout(() => setCancelConfirmOpen(true), 0)
                }}
              >
                여행 취소
              </Button>
              <Button fullWidth size="lg" onClick={goToActiveTripMap}>
                지도에서 보기
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <Modal
        open={cancelConfirmOpen}
        title="여행을 취소할까요?"
        description="진행 중인 여행을 중단해요. 방문 인증 기록은 유지됩니다."
        onClose={closeCancelConfirm}
        actions={[
          {
            label: '닫기',
            variant: 'ghost',
            onClick: closeCancelConfirm,
          },
          {
            label: '여행 취소',
            variant: 'danger',
            onClick: handleCancelTrip,
          },
        ]}
      />
    </div>
  )
}
