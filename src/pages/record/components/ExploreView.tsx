import { LayoutGrid, Map as MapIcon } from 'lucide-react'
import { useState } from 'react'
import { Empty } from '@/components/ui/Empty/Empty'
import { Loading } from '@/components/ui/Loading/Loading'
import { useExploreRecordsQuery } from '@/features/records/hooks'
import { ExploreRecordCard } from './ExploreRecordCard'
import { ExplorePathPreview } from './ExplorePathPreview'
import { listStyle, viewToggleButtonStyle, wrapStyle } from './ExploreView.css.ts'

type ExploreViewMode = 'card' | 'map'

/** STEP 06: 다른 사용자 기록 둘러보기 (카드형/지도형) */
export function ExploreView() {
  const [viewMode, setViewMode] = useState<ExploreViewMode>('card')
  const { data: records = [], isLoading } = useExploreRecordsQuery()

  const isMapMode = viewMode === 'map'

  return (
    <div className={wrapStyle}>
      <button
        type="button"
        aria-pressed={isMapMode}
        aria-label={isMapMode ? '카드형으로 전환' : '지도형으로 전환'}
        className={viewToggleButtonStyle()}
        onClick={() => setViewMode(isMapMode ? 'card' : 'map')}
      >
        {isMapMode ? <LayoutGrid size={18} aria-hidden /> : <MapIcon size={18} aria-hidden />}
      </button>

      {isLoading ? (
        <Loading label="다른 사용자의 기록을 불러오는 중…" />
      ) : records.length === 0 ? (
        <Empty
          title="아직 둘러볼 기록이 없어요"
          description="다른 사용자의 기록이 곧 채워질 거예요."
        />
      ) : (
        <div className={listStyle}>
          {records.map((record) =>
            viewMode === 'card' ? (
              <ExploreRecordCard key={record.id} record={record} />
            ) : (
              <ExplorePathPreview key={record.id} record={record} />
            ),
          )}
        </div>
      )}
    </div>
  )
}
