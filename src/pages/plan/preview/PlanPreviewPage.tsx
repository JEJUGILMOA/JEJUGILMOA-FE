import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { buildPlanCreateRequest } from '@/features/plans/api'
import { useCreatePlanMutation, usePlanDraft, useSavePlanEditMutation } from '@/features/plans/hooks'
import { NEW_PLAN_ID, planDraftStore } from '@/features/plans/planDraftStore'
import { PlanOverview } from '@/pages/plan/components/PlanOverview/PlanOverview'
import { emptyHintStyle, pageStyle } from './PlanPreviewPage.css.ts'

/** 작성/편집 마법사 STEP6 — 계획 저장 전용 미리보기 */
export function PlanPreviewPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { plan, isPending, isError } = usePlanDraft(planId)
  const createPlanMutation = useCreatePlanMutation()
  const savePlanEditMutation = useSavePlanEditMutation()
  const isSaving = createPlanMutation.isPending || savePlanEditMutation.isPending

  const goBack = () => navigate(-1)
  const goEditInfo = () => navigate(ROUTES.planEdit(planId))
  const goEditItinerary = () =>
    navigate(ROUTES.planItinerary(planId), { state: { fromPreview: true } })
  const goEditBudget = () => navigate(ROUTES.planBudget(planId), { state: { fromPreview: true } })

  const handleSave = () => {
    if (!plan) return
    const payload = buildPlanCreateRequest(plan)
    const onSuccess = () => {
      toast.success('계획을 저장했어요')
      planDraftStore.getState().clearDraft()
      navigate(ROUTES.plan)
    }
    const onError = () => {
      toast.error('계획 저장에 실패했어요. 다시 시도해 주세요.')
    }

    if (plan.id === NEW_PLAN_ID) {
      createPlanMutation.mutate(payload, { onSuccess, onError })
    } else {
      savePlanEditMutation.mutate({ planId: plan.id, payload }, { onSuccess, onError })
    }
  }

  if (isPending) {
    return (
      <div>
        <PageHeader title="계획 미리보기" showBack onBack={goBack} />
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  if (isError || !plan) {
    return (
      <div>
        <PageHeader title="계획 미리보기" showBack onBack={goBack} />
        <p className={emptyHintStyle}>계획을 불러오지 못했어요.</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="계획 미리보기" showBack onBack={goBack} />

      <div className={pageStyle}>
        <PlanOverview
          plan={plan}
          editable
          onTitleChange={(title) => {
            planDraftStore.getState().updateDraft((current) => ({ ...current, title }))
          }}
          onEditInfo={goEditInfo}
          onEditItinerary={goEditItinerary}
          onEditBudget={goEditBudget}
        />

        <Button fullWidth size="lg" isLoading={isSaving} onClick={handleSave}>
          계획 저장하기
        </Button>
      </div>
    </div>
  )
}
