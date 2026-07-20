import { Badge } from '@/components/ui/Badge/Badge'
import { badgeContainer } from '@/components/ui/Badge/Badge.css'
import { Card } from '@/components/ui/Card/Card'
import { Chip } from '@/components/ui/Chip/Chip'

const HomeIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.293 2.293a1 1 0 0 1 1.414 0l8 8A1 1 0 0 1 20 12h-1v7a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 1-1 1v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-7H2a1 1 0 0 1-.707-1.707l8-8z" />
  </svg>
)

export function TestPageSuji() {
  return (
    <Card title="이곳에서 컴포넌트를 마음껏 테스트하세요! 수지 페이지">
      <p>테스트 페이지</p>
      <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* ================= CHIP TEST SECTIONS ================= */}

        {/* 1. Select_chip 섹션 */}
        <div>
          <h3>Select_chip</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Chip colorScheme="primary" isSelected={true}>
              전체
            </Chip>
            <Chip isSelected={false}>자연</Chip>
            <Chip isSelected={false}>맛집</Chip>
            <Chip colorScheme="neutral" isSelected={true}>
              맛집
            </Chip>
          </div>
        </div>

        {/* 2. WITH ICON 섹션 */}
        <div>
          <h3>WITH ICON</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Chip isSelected={false} icon={<span>♡</span>}>
              찜한 장소
            </Chip>
            <Chip colorScheme="primaryLight" isSelected={true} icon={<HomeIcon size={16} />}>
              내 주변
            </Chip>
          </div>
        </div>

        {/* 3. REMOVABLE 섹션 */}
        <div>
          <h3>REMOVABLE</h3>
          <Chip isSelected={false} onRemove={() => alert('삭제')}>
            도보 10분 이내
          </Chip>
        </div>

        {/* 4. 크기별 규격 (SM, MD, LG) */}
        <div>
          <h3>Sizes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              SM:{' '}
              <Chip size="SM" colorScheme="primary" isSelected={true}>
                전체
              </Chip>
            </div>
            <div>
              MD:{' '}
              <Chip size="MD" colorScheme="primary" isSelected={true}>
                전체
              </Chip>
            </div>
            <div>
              LG:{' '}
              <Chip size="LG" colorScheme="primary" isSelected={true}>
                전체
              </Chip>
            </div>
          </div>
        </div>

        {/* ================= BADGE TEST SECTIONS ================= */}

        {/* 5. STATUS / COLOR BADGE */}
        <div>
          <h3>Badge - STATUS / COLOR</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <Badge status="success">무료</Badge>
            <Badge status="info">진행중</Badge>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge status="error">마감</Badge>
            <Badge status="neutral">준비중</Badge>
          </div>
        </div>

        {/* 6. OUTLINE BADGE */}
        <div>
          <h3>Badge - OUTLINE</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge status="success" variant="outline">
              무료
            </Badge>
            <Badge status="error" variant="outline">
              마감
            </Badge>
          </div>
        </div>

        {/* 7. Xsmall (Dot Badge) */}
        <div>
          <h3>Badge - Xsmall (Notification Dot)</h3>
          <div className={badgeContainer}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#5B5C60">
              <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            <Badge size="Xsmall" status="error" />
          </div>
        </div>
      </div>
    </Card>
  )
}
