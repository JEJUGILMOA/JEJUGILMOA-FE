import { useParams } from 'react-router'
import { Card } from '@/components/ui/Card/Card'
import { Empty } from '@/components/ui/Empty/Empty'
import { pageStyle } from './PlacePage.css.ts'

export function PlacePage() {
  const { placeId } = useParams()

  return (
    <div className={pageStyle}>
      <Card title="장소 상세">
        {placeId ? (
          <p>장소 ID: {placeId}</p>
        ) : (
          <Empty title="장소를 찾을 수 없어요" description="올바른 장소로 다시 이동해 주세요." />
        )}
      </Card>
    </div>
  )
}
