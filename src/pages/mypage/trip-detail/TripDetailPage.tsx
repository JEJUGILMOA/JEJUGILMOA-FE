import { useNavigate, useParams } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ROUTES } from '@/constants'
import { mockTrips } from '@/pages/mypage/data/mockMyPage'
import {
  metaStyle,
  pageStyle,
  sectionTitleStyle,
  statsGridStyle,
  statsItemStyle,
  statsLabelStyle,
  statsValueStyle,
  timelineItemStyle,
  timelineListStyle,
  titleStyle,
} from './TripDetailPage.css.ts'

export function TripDetailPage() {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const trip = mockTrips.find((item) => item.id === tripId)

  if (!trip) {
    return (
      <div className={pageStyle}>
        <PageHeader title="진행중 여행" showBack onBack={() => navigate(ROUTES.myTrips)} />
        <Empty title="여행을 찾을 수 없어요" description="목록에서 다시 선택해 주세요." />
      </div>
    )
  }

  return (
    <div className={pageStyle}>
      <PageHeader
        title="진행중 여행"
        showBack
        onBack={() => navigate(ROUTES.myTrips)}
        rightSlot={
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.plan)}>
            일정 수정
          </Button>
        }
      />

      <h2 className={titleStyle}>{trip.title}</h2>
      <p className={metaStyle}>2026.07.20–23 · 2일차 · 맑음 24°C ☀️</p>

      <div className={statsGridStyle}>
        <div className={statsItemStyle}>
          <span className={statsValueStyle}>3</span>
          <span className={statsLabelStyle}>방문 완료</span>
        </div>
        <div className={statsItemStyle}>
          <span className={statsValueStyle}>18분</span>
          <span className={statsLabelStyle}>다음까지</span>
        </div>
        <div className={statsItemStyle}>
          <span className={statsValueStyle}>4</span>
          <span className={statsLabelStyle}>남은 장소</span>
        </div>
      </div>

      <p className={sectionTitleStyle}>오늘 일정</p>
      <ul className={timelineListStyle}>
        <li className={timelineItemStyle}>10:02 협재해수욕장 방문 완료</li>
        <li className={timelineItemStyle}>이동중 · 성산일출봉 · 도착 예정 10:18</li>
        <li className={timelineItemStyle}>13:00 오설록 티뮤지엄 예정</li>
      </ul>

      <Button fullWidth variant="secondary" onClick={() => navigate(ROUTES.map)}>
        지도에서 보기
      </Button>
    </div>
  )
}
