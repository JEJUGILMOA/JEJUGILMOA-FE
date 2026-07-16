import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/Card/Card'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { useAppStore } from '@/stores/appStore'
import { ROUTES } from '@/constants'
import { pageStyle, heroStyle, sectionStyle } from './HomePage.css.ts'

export function HomePage() {
  const navigate = useNavigate()
  const isWebView = useAppStore((s) => s.isWebView)
  const isInitialized = useAppStore((s) => s.isInitialized)

  return (
    <div className={pageStyle}>
      <section className={heroStyle}>
        <h2>제주 여행을 한곳에서</h2>
        <p>장소를 탐색하고, 일정을 세우고, 기록을 남겨보세요.</p>
        <p>
          환경: {isWebView ? 'WebView' : 'Browser'}
          {isInitialized ? ' · 준비 완료' : ' · 초기화 중'}
        </p>
      </section>

      <section className={sectionStyle}>
        <Card title="오늘의 추천">
          <Empty
            title="추천 장소를 준비 중이에요"
            description="곧 제주 인기 장소를 보여드릴게요."
            action={
              <Button variant="secondary" onClick={() => navigate(ROUTES.map)}>
                지도에서 둘러보기
              </Button>
            }
          />
        </Card>
      </section>
    </div>
  )
}
