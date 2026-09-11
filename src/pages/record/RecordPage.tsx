import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { FloatingActionButton } from '@/components/ui/FloatingActionButton/FloatingActionButton'
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { ROUTES } from '@/constants'
import { useMyRecordsQuery } from '@/features/records/hooks'
import { ExploreView } from './components/ExploreView'
import { RecordCard } from './components/RecordCard'
import {
  headerStyle,
  listStyle,
  pageStyle,
  skeletonBodyStyle,
  skeletonCardStyle,
  skeletonThumbStyle,
  skeletonThumbWrapStyle,
} from './RecordPage.css.ts'

type RecordTab = 'mine' | 'explore'

const TABS = [
  { value: 'mine', label: '내 기록' },
  { value: 'explore', label: '둘러보기' },
]

function RecordsSkeleton() {
  return (
    <div className={listStyle} aria-busy aria-label="기록을 불러오는 중">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className={skeletonCardStyle} aria-hidden>
          <div className={skeletonThumbWrapStyle}>
            <Skeleton width="100%" height="100%" className={skeletonThumbStyle} />
          </div>
          <div className={skeletonBodyStyle}>
            <Skeleton width="62%" height={18} />
            <Skeleton width="88%" height={14} />
            <Skeleton width="48%" height={12} />
            <Skeleton width="36%" height={12} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function RecordPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<RecordTab>('mine')
  const { data: records = [], isLoading } = useMyRecordsQuery()

  const goToCreate = () => navigate(ROUTES.recordCreate)

  return (
    <div className={pageStyle}>
      <div className={headerStyle}>
        <SegmentedControl
          items={TABS}
          value={tab}
          onChange={(value) => setTab(value as RecordTab)}
          aria-label="기록 보기 전환"
          fullWidth
        />
      </div>

      {tab === 'mine' ? (
        isLoading ? (
          <RecordsSkeleton />
        ) : records.length === 0 ? (
          <Empty
            title="기록이 비어 있어요"
            description="방문한 장소와 후기를 남겨보세요."
            action={<Button onClick={goToCreate}>기록 작성하기</Button>}
          />
        ) : (
          <div className={listStyle}>
            {records.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        )
      ) : (
        <ExploreView />
      )}

      <FloatingActionButton onClick={goToCreate} aria-label="기록 작성하기" />
    </div>
  )
}
