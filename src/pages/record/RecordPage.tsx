import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { Loading } from '@/components/ui/Loading/Loading'
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl'
import { ROUTES } from '@/constants'
import { useMyRecordsQuery } from '@/features/records/hooks'
import { ExploreView } from './components/ExploreView'
import { FloatingActionButton } from './components/FloatingActionButton'
import { RecordCard } from './components/RecordCard'
import { headerStyle, listStyle, pageStyle } from './RecordPage.css.ts'

type RecordTab = 'mine' | 'explore'

const TABS = [
  { value: 'mine', label: '내 기록' },
  { value: 'explore', label: '둘러보기' },
]

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
          <Loading label="기록을 불러오는 중…" />
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
