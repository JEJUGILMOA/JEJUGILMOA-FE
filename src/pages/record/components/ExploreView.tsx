import { useState } from 'react'
import { Empty } from '@/components/ui/Empty/Empty'
import { Loading } from '@/components/ui/Loading/Loading'
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl'
import { useExploreRecordsQuery } from '@/features/records/hooks'
import { ExploreRecordCard } from './ExploreRecordCard'
import { ExplorePathPreview } from './ExplorePathPreview'
import { listStyle, viewToggleStyle, wrapStyle } from './ExploreView.css.ts'

type ExploreViewMode = 'card' | 'map'

const VIEW_MODES = [
  { value: 'card', label: '카드형' },
  { value: 'map', label: '지도형' },
]

/** STEP 06: 다른 사용자 기록 둘러보기 (카드형/지도형) */
export function ExploreView() {
  const [viewMode, setViewMode] = useState<ExploreViewMode>('card')
  const { data: records = [], isLoading } = useExploreRecordsQuery()

  return (
    <div className={wrapStyle}>
      <SegmentedControl
        items={VIEW_MODES}
        value={viewMode}
        onChange={(value) => setViewMode(value as ExploreViewMode)}
        aria-label="둘러보기 보기 방식 전환"
        className={viewToggleStyle}
      />

      {isLoading ? (
        <Loading label="다른 사용자의 기록을 불러오는 중…" />
      ) : records.length === 0 ? (
        <Empty title="아직 둘러볼 기록이 없어요" description="다른 사용자의 기록이 곧 채워질 거예요." />
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
