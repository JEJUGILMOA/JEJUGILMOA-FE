import { useNavigate, useParams } from 'react-router'
import { getErrorMessage } from '@/api/error'
import { Button } from '@/components/ui/Button/Button'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { mapPath, openMapOnNative } from '@/features/map/openMap'
import { usePlanQuery } from '@/features/plans/hooks'
import { useStartTripMutation } from '@/features/trips/hooks'
import { PlanOverview } from '@/pages/plan/components/PlanOverview/PlanOverview'
import { actionsStyle, emptyHintStyle, pageStyle } from './PlanDetailPage.css.ts'

/** 저장된 계획 조회 — DRAFT에서 여행 시작 CTA 제공 */
export function PlanDetailPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const planQuery = usePlanQuery(planId)
  const startTripMutation = useStartTripMutation()

  const goBack = () => navigate(-1)
  const plan = planQuery.data

  const goToActiveTripMap = () => {
    if (openMapOnNative({ mode: 'activeTrip' })) return
    navigate(mapPath({ mode: 'activeTrip' }))
  }

  const handleStartTrip = () => {
    const numericId = Number(planId)
    if (!Number.isFinite(numericId) || numericId <= 0) {
      toast.error('유효하지 않은 계획이에요.')
      return
    }

    startTripMutation.mutate(numericId, {
      onSuccess: () => {
        toast.success('여행을 시작했어요')
        goToActiveTripMap()
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, '여행 시작에 실패했어요. 다시 시도해 주세요.'))
      },
    })
  }

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
            <>
              <Button fullWidth size="lg" onClick={goToActiveTripMap}>
                지도에서 보기
              </Button>
              <Button
                fullWidth
                size="lg"
                variant="outline"
                onClick={() => navigate(ROUTES.planItinerary(planId))}
              >
                일정 보기
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
