import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { mapRecordCardToSharedRecord } from '@/features/records/format'
import { useMySharedRecordsQuery } from '@/features/records/hooks'
import { SharedRecordCard } from './components/SharedRecordCard'
import {
  listStyle,
  pageStyle,
  skeletonBodyStyle,
  skeletonCardStyle,
  skeletonCoverStyle,
  statsItemStyle,
  statsLabelStyle,
  statsRowStyle,
  statsValueStyle,
} from './SharedRecordsPage.css.ts'

function SharedRecordsSkeleton() {
  return (
    <>
      <div className={statsRowStyle} aria-hidden>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={statsItemStyle}>
            <Skeleton width={36} height={20} />
            <Skeleton width={40} height={12} />
          </div>
        ))}
      </div>
      <div className={listStyle} aria-hidden>
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className={skeletonCardStyle}>
            <Skeleton width="100%" height={78} className={skeletonCoverStyle} />
            <div className={skeletonBodyStyle}>
              <Skeleton width="70%" height={18} />
              <Skeleton width="52%" height={14} />
              <Skeleton width="40%" height={12} />
              <Skeleton width="100%" height={36} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export function SharedRecordsPage() {
  const navigate = useNavigate()
  const recordsQuery = useMySharedRecordsQuery()

  const records = useMemo(
    () => (recordsQuery.data ?? []).map(mapRecordCardToSharedRecord),
    [recordsQuery.data],
  )

  const totals = useMemo(() => {
    return records.reduce(
      (acc, record) => {
        acc.views += record.views
        acc.likes += record.likes
        return acc
      },
      { views: 0, likes: 0 },
    )
  }, [records])

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link)
      toast.success('링크를 복사했어요.')
    } catch {
      toast.error('링크 복사에 실패했어요.')
    }
  }

  return (
    <div className={pageStyle}>
      <PageHeader title="공유한 기록" showBack onBack={() => navigate(ROUTES.my)} />

      {recordsQuery.isLoading ? <SharedRecordsSkeleton /> : null}
      {recordsQuery.isError ? <ErrorState onRetry={() => void recordsQuery.refetch()} /> : null}

      {!recordsQuery.isLoading && !recordsQuery.isError ? (
        <>
          <div className={statsRowStyle}>
            <div className={statsItemStyle}>
              <span className={statsValueStyle}>{records.length}</span>
              <span className={statsLabelStyle}>공유중</span>
            </div>
            <div className={statsItemStyle}>
              <span className={statsValueStyle}>{totals.views}</span>
              <span className={statsLabelStyle}>총 조회</span>
            </div>
            <div className={statsItemStyle}>
              <span className={statsValueStyle}>{totals.likes}</span>
              <span className={statsLabelStyle}>총 좋아요</span>
            </div>
          </div>

          {records.length === 0 ? (
            <Empty title="공유한 기록이 없어요" description="여행을 기록하고 공유해 보세요." />
          ) : (
            <div className={listStyle}>
              {records.map((record) => (
                <SharedRecordCard
                  key={record.id}
                  record={record}
                  onCopyLink={() => void handleCopy(record.link)}
                  onViewDetail={() => navigate(ROUTES.recordDetail(record.id))}
                />
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
