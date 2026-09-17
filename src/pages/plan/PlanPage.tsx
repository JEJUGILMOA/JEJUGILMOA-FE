import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Card } from '@/components/ui/Card/Card'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { FloatingActionButton } from '@/components/ui/FloatingActionButton/FloatingActionButton'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { ROUTES } from '@/constants'
import { openLogin } from '@/features/auth/openLogin'
import { requireLogin } from '@/features/auth/requireLogin'
import { usePlansQuery } from '@/features/plans/hooks'
import type { PlanStatus, TravelPlan } from '@/features/plans/types'
import { useAuthStore } from '@/stores/authStore'
import { PlanListItem } from './components/PlanListItem'
import {
  listStyle,
  pageStyle,
  sectionHeaderStyle,
  sectionHintStyle,
  sectionStyle,
  sectionTitleStyle,
  skeletonCardStyle,
  skeletonCardsStyle,
  skeletonSectionStyle,
  skeletonTitleRowStyle,
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

function PlansSkeleton() {
  return (
    <div className={listStyle} aria-busy aria-label="여행 계획을 불러오는 중">
      {Array.from({ length: 2 }, (_, sectionIndex) => (
        <div key={sectionIndex} className={skeletonSectionStyle} aria-hidden>
          <Skeleton width="32%" height={18} />
          <div className={skeletonCardsStyle}>
            {Array.from({ length: sectionIndex === 0 ? 1 : 2 }, (_, cardIndex) => (
              <div key={cardIndex} className={skeletonCardStyle}>
                <div className={skeletonTitleRowStyle}>
                  <Skeleton width="48%" height={20} />
                  <Skeleton width={56} height={22} />
                </div>
                <Skeleton width="62%" height={14} />
                <Skeleton width="28%" height={12} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function PlanPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { data: plans = [], isLoading, isError, refetch } = usePlansQuery()
  const goToCreate = () => {
    if (!requireLogin({ returnTo: ROUTES.planCreate, description: '여행 계획을 만들려면 로그인해 주세요.' })) {
      return
    }
    navigate(ROUTES.planCreate)
  }

  if (!isAuthenticated) {
    return (
      <div className={pageStyle}>
        <Card title="여행 계획">
          <Empty
            title="로그인이 필요해요"
            description="내 계획은 로그인 후 확인할 수 있습니다."
            action={
              <Button fullWidth onClick={() => openLogin(navigate, { returnTo: ROUTES.plan })}>
                로그인하기
              </Button>
            }
          />
        </Card>
      </div>
    )
  }

  const groups = groupPlans(plans)

  return (
    <div className={pageStyle}>
      {isLoading ? (
        <PlansSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
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
                <div className={sectionHeaderStyle}>
                  <span className={sectionTitleStyle}>{title}</span>
                  {hint ? <p className={sectionHintStyle}>{hint}</p> : null}
                </div>
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
