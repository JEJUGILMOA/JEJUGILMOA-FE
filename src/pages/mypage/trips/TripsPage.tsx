import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Loading } from '@/components/ui/Loading/Loading'
import { ROUTES } from '@/constants'
import { mapPlanSummaryToTrip } from '@/features/plans/format'
import { usePlanSummariesQuery } from '@/features/plans/hooks'
import type { PlanApiStatus } from '@/features/plans/schemas'
import { TripCard } from './components/TripCard'
import { listStyle, pageStyle } from './TripsPage.css.ts'

const FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'ongoing', label: '진행중' },
  { value: 'planned', label: '계획중' },
  { value: 'completed', label: '완료' },
] as const

type FilterValue = (typeof FILTERS)[number]['value']

const API_STATUS_BY_FILTER: Record<Exclude<FilterValue, 'all'>, PlanApiStatus> = {
  ongoing: 'IN_PROGRESS',
  planned: 'DRAFT',
  completed: 'COMPLETED',
}

export function TripsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterValue>('all')
  const apiStatus = filter === 'all' ? undefined : API_STATUS_BY_FILTER[filter]

  const tripsQuery = usePlanSummariesQuery(apiStatus ? { status: apiStatus } : undefined)

  const trips = useMemo(
    () => (tripsQuery.data ?? []).map(mapPlanSummaryToTrip),
    [tripsQuery.data],
  )

  return (
    <div className={pageStyle}>
      <PageHeader title="내 여행" showBack onBack={() => navigate(ROUTES.my)} />

      <SegmentedControl
        items={[...FILTERS]}
        value={filter}
        onChange={(value) => setFilter(value as FilterValue)}
        aria-label="여행 상태 필터"
      />

      {tripsQuery.isLoading ? <Loading label="여행 목록 불러오는 중" /> : null}

      {tripsQuery.isError ? <ErrorState onRetry={() => void tripsQuery.refetch()} /> : null}

      {!tripsQuery.isLoading && !tripsQuery.isError ? (
        trips.length === 0 ? (
          <Empty title="여행이 없어요" description="새로운 여행을 계획해 보세요." />
        ) : (
          <div className={listStyle}>
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => {
                  if (trip.status === 'ongoing') {
                    navigate(ROUTES.planItinerary(trip.id))
                    return
                  }
                  if (trip.status === 'planned') {
                    navigate(ROUTES.planPreview(trip.id))
                  }
                }}
              />
            ))}
          </div>
        )
      ) : null}
    </div>
  )
}
