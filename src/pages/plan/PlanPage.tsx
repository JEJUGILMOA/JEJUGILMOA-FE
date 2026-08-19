import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Card } from '@/components/ui/Card/Card'
import { Empty } from '@/components/ui/Empty/Empty'
import { FloatingActionButton } from '@/components/ui/FloatingActionButton/FloatingActionButton'
import { Loading } from '@/components/ui/Loading/Loading'
import { ROUTES } from '@/constants'
import { usePlansQuery } from '@/features/plans/hooks'
import { getPlanGroup, type PlanGroup } from '@/features/plans/planStatus'
import type { TravelPlan } from '@/features/plans/types'
import { PlanListItem } from './components/PlanListItem'
import {
  listStyle,
  pageStyle,
  sectionHintStyle,
  sectionStyle,
  sectionTitleStyle,
} from './PlanPage.css.ts'

const SECTION_ORDER: { group: PlanGroup; title: string; hint?: string }[] = [
  { group: 'ongoing', title: '진행중인 계획' },
  {
    group: 'draft',
    title: '저장해야 하는 계획',
    hint: '계획하다 만 여행이 있어요. 마저 완성해보세요.',
  },
  { group: 'saved', title: '저장된 계획' },
]

function groupPlans(plans: TravelPlan[]): Record<PlanGroup, TravelPlan[]> {
  const groups: Record<PlanGroup, TravelPlan[]> = { ongoing: [], draft: [], saved: [] }
  for (const plan of plans) {
    groups[getPlanGroup(plan)].push(plan)
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
          {SECTION_ORDER.filter(({ group }) => groups[group].length > 0).map(
            ({ group, title, hint }) => (
              <div key={group} className={sectionStyle}>
                <span className={sectionTitleStyle}>{title}</span>
                {hint ? <p className={sectionHintStyle}>{hint}</p> : null}
                {groups[group].map((plan) => (
                  <PlanListItem key={plan.id} plan={plan} group={group} />
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
