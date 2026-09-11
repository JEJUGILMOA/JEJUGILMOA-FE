import { ChevronDown, LayoutGrid, ListFilter, Map as MapIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Empty } from '@/components/ui/Empty/Empty'
import { Popover } from '@/components/ui/Popover/Popover'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { useExploreRecordsQuery } from '@/features/records/hooks'
import type { ExploreRecord } from '@/features/records/types'
import { ExploreRecordCard } from './ExploreRecordCard'
import { ExplorePathPreview } from './ExplorePathPreview'
import {
  listStyle,
  skeletonAuthorRowStyle,
  skeletonAvatarStyle,
  skeletonBodyStyle,
  skeletonCardStyle,
  skeletonThumbStyle,
  skeletonThumbWrapStyle,
  sortButtonStyle,
  sortMenuItemStyle,
  sortMenuListStyle,
  toolbarStyle,
  viewModeButtonStyle,
  viewModeGroupStyle,
  wrapStyle,
} from './ExploreView.css.ts'

type ExploreViewMode = 'card' | 'map'
type ExploreSort = 'latest' | 'popular' | 'oldest'

const SORT_OPTIONS: { value: ExploreSort; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'oldest', label: '오래된순' },
]

function sortExploreRecords(records: ExploreRecord[], sort: ExploreSort): ExploreRecord[] {
  const next = records.slice()
  switch (sort) {
    case 'popular':
      return next.sort((a, b) => b.likeCount - a.likeCount || b.createdAt.localeCompare(a.createdAt))
    case 'oldest':
      return next.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    case 'latest':
    default:
      return next.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

function ExploreRecordsSkeleton() {
  return (
    <div className={listStyle} aria-busy aria-label="다른 사용자의 기록을 불러오는 중">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className={skeletonCardStyle} aria-hidden>
          <div className={skeletonThumbWrapStyle}>
            <Skeleton width="100%" height="100%" className={skeletonThumbStyle} />
          </div>
          <div className={skeletonBodyStyle}>
            <Skeleton width="58%" height={18} />
            <Skeleton width="90%" height={14} />
            <div className={skeletonAuthorRowStyle}>
              <Skeleton width={24} height={24} className={skeletonAvatarStyle} />
              <Skeleton width="28%" height={12} />
            </div>
            <Skeleton width="42%" height={28} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** STEP 06: 다른 사용자 기록 둘러보기 (카드형/지도형) */
export function ExploreView() {
  const [viewMode, setViewMode] = useState<ExploreViewMode>('card')
  const [sort, setSort] = useState<ExploreSort>('latest')
  const [sortOpen, setSortOpen] = useState(false)
  const { data: records = [], isLoading } = useExploreRecordsQuery()

  const sortedRecords = useMemo(() => sortExploreRecords(records, sort), [records, sort])
  const sortLabel = SORT_OPTIONS.find((option) => option.value === sort)?.label ?? '최신순'

  return (
    <div className={wrapStyle}>
      <div className={toolbarStyle}>
        <div className={viewModeGroupStyle} role="group" aria-label="둘러보기 표시 방식">
          <button
            type="button"
            aria-pressed={viewMode === 'card'}
            className={viewModeButtonStyle({ selected: viewMode === 'card' })}
            onClick={() => setViewMode('card')}
          >
            <LayoutGrid size={16} aria-hidden />
            카드형
          </button>
          <button
            type="button"
            aria-pressed={viewMode === 'map'}
            className={viewModeButtonStyle({ selected: viewMode === 'map' })}
            onClick={() => setViewMode('map')}
          >
            <MapIcon size={16} aria-hidden />
            지도형
          </button>
        </div>

        <Popover
          open={sortOpen}
          onOpenChange={setSortOpen}
          align="end"
          ariaLabel="기록 정렬"
          trigger={
            <button
              type="button"
              className={sortButtonStyle}
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((prev) => !prev)}
            >
              <ListFilter size={16} aria-hidden />
              {sortLabel}
              <ChevronDown size={14} aria-hidden />
            </button>
          }
        >
          <div className={sortMenuListStyle}>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="menuitem"
                className={sortMenuItemStyle({ selected: sort === option.value })}
                onClick={() => {
                  setSort(option.value)
                  setSortOpen(false)
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Popover>
      </div>

      {isLoading ? (
        <ExploreRecordsSkeleton />
      ) : sortedRecords.length === 0 ? (
        <Empty
          title="아직 둘러볼 기록이 없어요"
          description="다른 사용자의 기록이 곧 채워질 거예요."
        />
      ) : (
        <div className={listStyle}>
          {sortedRecords.map((record) =>
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
