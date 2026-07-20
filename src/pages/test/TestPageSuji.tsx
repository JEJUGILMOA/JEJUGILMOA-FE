import { Badge } from '@/components/ui/Badge/Badge'
import { badgeContainer } from '@/components/ui/Badge/Badge.css'
import { Card } from '@/components/ui/Card/Card'

const HomeIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.293 2.293a1 1 0 0 1 1.414 0l8 8A1 1 0 0 1 20 12h-1v7a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-7H2a1 1 0 0 1-.707-1.707l8-8z" />
  </svg>
)

export function TestPageSuji() {
  return (
    <Card title="이곳에서 컴포넌트를 마음껏 테스트하세요! 수지 페이지">
      <p>테스트 페이지</p>
      <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* 1. STATUS · COLOR */}
        <div>
          <h3>STATUS · COLOR</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <Badge status="success">무료</Badge>
            <Badge status="info">진행중</Badge>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge status="error">마감</Badge>
            <Badge status="neutral">준비중</Badge>
          </div>
        </div>

        {/* 2. OUTLINE */}
        <div>
          <h3>OUTLINE</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <Badge status="success" variant="outline">
              무료
            </Badge>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge status="error" variant="outline">
              마감
            </Badge>
          </div>
        </div>

        {/* 3. Xsmall (Dot 알림) */}
        <div>
          <h3>Xsmall</h3>
          <div className={badgeContainer}>
            {/* 종 아이콘 SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#5B5C60">
              <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>

            {/* 우측 상단에 걸치도록 위치하는 Dot Badge */}
            <Badge size="Xsmall" status="error" />
          </div>
        </div>

        {/* 4. small */}
        <div>
          <h3>small</h3>
          <Badge size="small" status="success">
            무료
          </Badge>
        </div>

        {/* 5. Medium */}
        <div>
          <h3>Medium</h3>
          <Badge size="Medium" status="success">
            무료
          </Badge>
        </div>
      </div>
    </Card>
  )
}
