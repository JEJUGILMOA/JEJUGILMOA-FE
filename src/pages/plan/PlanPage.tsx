import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Card } from '@/components/ui/Card/Card'
import { Empty } from '@/components/ui/Empty/Empty'
import { Loading } from '@/components/ui/Loading/Loading'
import { ROUTES } from '@/constants'
import { usePlansQuery } from '@/features/plans/hooks'
import { PlanListItem } from './components/PlanListItem'
import { listStyle, pageStyle } from './PlanPage.css.ts'

export function PlanPage() {
  const navigate = useNavigate()
  const { data: plans = [], isLoading } = usePlansQuery()
  const goToCreate = () => navigate(ROUTES.planCreate)

  return (
    <div className={pageStyle}>
      {isLoading ? (
        <Loading label="여행 계획을 불러오는 중…" />
      ) : plans.length === 0 ? (
        <Card title="여행 계획">
          <Empty
            title="아직 계획이 없어요"
            description="제주 일정을 만들어 여행을 준비해 보세요."
            action={
              <Button fullWidth onClick={goToCreate}>
                새 계획 만들기
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <Button fullWidth size="lg" onClick={goToCreate}>
            새 계획 만들기
          </Button>
          <div className={listStyle}>
            {plans.map((plan) => (
              <PlanListItem key={plan.id} plan={plan} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
