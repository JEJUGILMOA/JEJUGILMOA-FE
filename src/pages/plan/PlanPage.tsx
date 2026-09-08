import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Card } from '@/components/ui/Card/Card'
import { Empty } from '@/components/ui/Empty/Empty'
import { FloatingActionButton } from '@/components/ui/FloatingActionButton/FloatingActionButton'
import { Loading } from '@/components/ui/Loading/Loading'
import { ROUTES } from '@/constants'
import { usePlansQuery } from '@/features/plans/hooks'
import type { PlanStatus, TravelPlan } from '@/features/plans/types'
import { PlanListItem } from './components/PlanListItem'
import {
  listStyle,
  pageStyle,
  sectionHintStyle,
  sectionStyle,
  sectionTitleStyle,
} from './PlanPage.css.ts'

const SECTION_ORDER: { status: PlanStatus; title: string; hint?: string }[] = [
  { status: 'ongoing', title: '진행중인 계획' },
  {
    status: 'draft',
    title: '예정된 여행',
    hint: '아직 출발 전인 여행이에요.',
  },
  { status: 'completed', title: '완료된 여행' },
]

function groupPlans(plans: TravelPlan[]): Record<PlanStatus, TravelPlan[]> {
  const groups: Record<PlanStatus, TravelPlan[]> = { ongoing: [], draft: [], completed: [] }
  for (const plan of plans) {
    groups[plan.status].push(plan)
  }
  return groups
}

export function PlanPage() {
  const navigate = useNavigate()
  const { data: plans = [], isLoading } = usePlansQuery()
  const goToCreate = () => navigate(ROUTES.planCreate)

  const groups = groupPlans(plans)

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
        <div className={listStyle}>
          {SECTION_ORDER.filter(({ status }) => groups[status].length > 0).map(
            ({ status, title, hint }) => (
              <div key={status} className={sectionStyle}>
                <span className={sectionTitleStyle}>{title}</span>
                {hint ? <p className={sectionHintStyle}>{hint}</p> : null}
                {groups[status].map((plan) => (
                  <PlanListItem key={plan.id} plan={plan} status={status} />
                ))}
              </div>
            ),
          )}
        </div>
      )}

      <FloatingActionButton onClick={goToCreate} aria-label="새 계획 만들기" />
    </div>
  )
}
