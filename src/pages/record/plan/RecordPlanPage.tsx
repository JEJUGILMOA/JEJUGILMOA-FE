import { useNavigate, useParams } from 'react-router'
import { Image } from 'lucide-react'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { ROUTES } from '@/constants'
import { useCompletedTripsQuery, useMyRecordsQuery } from '@/features/records/hooks'
import { TripItinerary } from './components/TripItinerary'
import {
  coverPlaceholderStyle,
  dateRangeStyle,
  divider,
  infoStyle,
  pageStyle,
  sectionTitleStyle,
  titleGroupStyle,
  titleStyle,
} from './RecordPlanPage.css.ts'

/** STEP 09: 연결된 여행 계획 보기 — 기록 상세의 'OO 계획 보기' 클릭 시 진입 */
export function RecordPlanPage() {
  const { recordId } = useParams<{ recordId: string }>()
  const navigate = useNavigate()

  const myRecordsQuery = useMyRecordsQuery()
  const tripsQuery = useCompletedTripsQuery()

  const record = myRecordsQuery.data?.find((item) => item.id === recordId) ?? null
  const trip = record?.tripId
    ? (tripsQuery.data?.find((item) => item.id === record.tripId) ?? null)
    : null

  const isLoading = myRecordsQuery.isLoading || tripsQuery.isLoading

  const goBack = () =>
    navigate(recordId ? ROUTES.recordDetail(recordId) : ROUTES.record)

  const header = <PageHeader title="여행 계획" showBack onBack={goBack} />

  if (isLoading) {
    return (
      <div>
        {header}
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  if (!record || !trip) {
    return (
      <div>
        {header}
        <Empty
          title="연결된 여행 계획을 찾을 수 없어요"
          description="삭제되었거나 존재하지 않는 계획이에요."
        />
      </div>
    )
  }

  return (
    <div>
      {header}

      <div className={pageStyle}>
        <div className={coverPlaceholderStyle}>
          <Image size={28} aria-hidden />
          <span>여행 계획 대표 이미지</span>
        </div>

        <div className={infoStyle}>
          <Badge status="info">나의 계획</Badge>
          <div className={titleGroupStyle}>
            <h1 className={titleStyle}>{trip.title}</h1>
            <p className={dateRangeStyle}>{trip.dateRangeLabel}</p>
          </div>
        </div>

        <div className={divider} />

        <section>
          <h2 className={sectionTitleStyle}>일자별 일정</h2>
          <TripItinerary itinerary={trip.itinerary} />
        </section>

        <Button
          fullWidth
          size="lg"
          onClick={() =>
            navigate(ROUTES.recordCreate, { state: { tripId: trip.id, tripTitle: trip.title } })
          }
        >
          이 계획으로 새 기록 남기기
        </Button>
      </div>
    </div>
  )
}
