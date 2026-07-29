import { useNavigate, useParams } from 'react-router'
import { Image } from 'lucide-react'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { ROUTES } from '@/constants'
import {
  useCompletedTripsQuery,
  useExploreRecordsQuery,
  useMyRecordsQuery,
} from '@/features/records/hooks'
import type { TripDayPlan } from '@/features/records/types'
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

type PlanView = {
  badgeLabel: string
  title: string
  dateRangeLabel: string
  itinerary: TripDayPlan[]
  /** 이 계획을 기반으로 새 기록을 남길 수 있는 경우에만 채워짐 (본인 완료 여행일 때) */
  createCta: { tripId: string; tripTitle: string } | null
}

/** STEP 09: 연결된 여행 계획 보기 — 내 기록의 'OO 계획 보기' 또는 둘러보기의 '연결된 계획 보기' 클릭 시 진입 */
export function RecordPlanPage() {
  const { recordId } = useParams<{ recordId: string }>()
  const navigate = useNavigate()

  const myRecordsQuery = useMyRecordsQuery()
  const exploreRecordsQuery = useExploreRecordsQuery()
  const tripsQuery = useCompletedTripsQuery()

  const ownRecord = myRecordsQuery.data?.find((item) => item.id === recordId) ?? null
  const exploreRecord = ownRecord
    ? null
    : (exploreRecordsQuery.data?.find((item) => item.id === recordId) ?? null)

  const ownTrip = ownRecord?.tripId
    ? (tripsQuery.data?.find((item) => item.id === ownRecord.tripId) ?? null)
    : null

  const isLoading =
    myRecordsQuery.isLoading ||
    (!ownRecord && exploreRecordsQuery.isLoading) ||
    (Boolean(ownRecord?.tripId) && tripsQuery.isLoading)

  const view: PlanView | null = ownTrip
    ? {
        badgeLabel: '나의 계획',
        title: ownTrip.title,
        dateRangeLabel: ownTrip.dateRangeLabel,
        itinerary: ownTrip.itinerary,
        createCta: { tripId: ownTrip.id, tripTitle: ownTrip.title },
      }
    : exploreRecord?.linkedPlanItinerary
      ? {
          badgeLabel: `${exploreRecord.authorName}님의 계획`,
          title: exploreRecord.linkedPlanTitle ?? exploreRecord.title,
          dateRangeLabel: exploreRecord.tripDateRangeLabel,
          itinerary: exploreRecord.linkedPlanItinerary,
          createCta: null,
        }
      : null

  const goBack = () => navigate(recordId ? ROUTES.recordDetail(recordId) : ROUTES.record)

  const header = <PageHeader title="여행 계획" showBack onBack={goBack} />

  if (isLoading) {
    return (
      <div>
        {header}
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  if (!view) {
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

  const { createCta } = view

  return (
    <div>
      {header}

      <div className={pageStyle}>
        <div className={coverPlaceholderStyle}>
          <Image size={28} aria-hidden />
          <span>여행 계획 대표 이미지</span>
        </div>

        <div className={infoStyle}>
          <Badge status="info">{view.badgeLabel}</Badge>
          <div className={titleGroupStyle}>
            <h1 className={titleStyle}>{view.title}</h1>
            <p className={dateRangeStyle}>{view.dateRangeLabel}</p>
          </div>
        </div>

        <div className={divider} />

        <section>
          <h2 className={sectionTitleStyle}>일자별 일정</h2>
          <TripItinerary itinerary={view.itinerary} />
        </section>

        {createCta ? (
          <Button
            fullWidth
            size="lg"
            onClick={() =>
              navigate(ROUTES.recordCreate, {
                state: { tripId: createCta.tripId, tripTitle: createCta.tripTitle },
              })
            }
          >
            이 계획으로 새 기록 남기기
          </Button>
        ) : null}
      </div>
    </div>
  )
}
