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
    <path d="M11.293 2.293a1 1 0 0 1 1.414 0l8 8A1 1 0 0 1 20 12h-1v7a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-7H2a1 1 0 0 1-.707-1.707l8-8z" />
  </svg>
)

export function TestPageSuji() {
  return (
    <Card title="이곳에서 컴포넌트를 마음껏 테스트하세요! 수지 페이지">
      <p>테스트 페이지</p>
      <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 1. Select_chip 섹션 */}
        <div>
          <h3>Select_chip</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Chip variant="selected">전체</Chip>
            <Chip variant="outline">자연</Chip>
            <Chip variant="outline">맛집</Chip>
            <Chip variant="filled">맛집</Chip>
          </div>
        </div>

        {/* 2. WITH ICON 섹션 */}
        <div>
          <h3>WITH ICON</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Chip variant="outline" icon={<span>♡</span>}>
              찜한 장소
            </Chip>
            <Chip variant="primaryLight" icon={<HomeIcon size={16} />}>
              내 주변
            </Chip>
          </div>
        </div>

        {/* 3. REMOVABLE 섹션 */}
        <div>
          <h3>REMOVABLE</h3>
          <Chip variant="outline" onRemove={() => alert('삭제')}>
            도보 10분 이내
          </Chip>
        </div>

        {/* 4. 크기별 규격 (SM, MD, LG) */}
        <div>
          <h3>Sizes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              SM:{' '}
              <Chip size="SM" variant="selected">
                전체
              </Chip>
            </div>
            <div>
              MD:{' '}
              <Chip size="MD" variant="selected">
                전체
              </Chip>
            </div>
            <div>
              LG:{' '}
              <Chip size="LG" variant="selected">
                전체
              </Chip>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
