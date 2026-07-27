import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl'
import { Empty } from '@/components/ui/Empty/Empty'
import { ROUTES } from '@/constants'
import { mockTrips, type TripStatus } from '@/pages/mypage/data/mockMyPage'
import { TripCard } from './components/TripCard'
import { listStyle, pageStyle } from './TripsPage.css.ts'

const FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'ongoing', label: '진행중' },
  { value: 'planned', label: '계획중' },
  { value: 'completed', label: '완료' },
] as const

type FilterValue = (typeof FILTERS)[number]['value']

export function TripsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterValue>('all')

  const trips = useMemo(() => {
    if (filter === 'all') return mockTrips
    return mockTrips.filter((trip) => trip.status === (filter as TripStatus))
  }, [filter])

  return (
    <div className={pageStyle}>
      <PageHeader title="내 여행" showBack onBack={() => navigate(ROUTES.my)} />

      <SegmentedControl
        items={[...FILTERS]}
        value={filter}
        onChange={(value) => setFilter(value as FilterValue)}
        aria-label="여행 상태 필터"
      />

      {trips.length === 0 ? (
        <Empty title="여행이 없어요" description="새로운 여행을 계획해 보세요." />
      ) : (
        <div className={listStyle}>
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onClick={() => {
                if (trip.status === 'ongoing') {
                  navigate(ROUTES.myTripDetail.replace(':tripId', trip.id))
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
