import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { FloatingActionButton } from '@/components/ui/FloatingActionButton/FloatingActionButton'
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { ROUTES } from '@/constants'
import { openLogin } from '@/features/auth/openLogin'
import { requireLogin } from '@/features/auth/requireLogin'
import { useMyRecordsQuery } from '@/features/records/hooks'
import { useAuthStore } from '@/stores/authStore'
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
  { value: 'explore', label: '둘러보기' },
  { value: 'mine', label: '내 기록' },
]

function tabFromSearchParam(value: string | null): RecordTab {
  return value === 'myrecord' ? 'mine' : 'explore'
}

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
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab = tabFromSearchParam(tabParam)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { data: records = [], isLoading, isError, refetch } = useMyRecordsQuery()

  // /record 진입 시 기본 탭을 둘러보기(search)로 맞춘다
  useEffect(() => {
    if (tabParam === 'search' || tabParam === 'myrecord') return
    setSearchParams({ tab: 'search' }, { replace: true })
  }, [tabParam, setSearchParams])

  const goToCreate = () => {
    if (
      !requireLogin({
        returnTo: ROUTES.recordCreate,
        description: '기록을 작성하려면 로그인해 주세요.',
      })
    ) {
      return
    }
    navigate(ROUTES.recordCreate)
  }

  const handleTabChange = (value: string) => {
    const next = value as RecordTab
    if (next === 'mine') {
      if (
        !requireLogin({
          returnTo: ROUTES.recordTab('myrecord'),
          description: '내 기록은 로그인 후 확인할 수 있어요.',
        })
      ) {
        return
      }
    }
    setSearchParams(next === 'explore' ? { tab: 'search' } : { tab: 'myrecord' }, {
      replace: true,
    })
  }

  return (
    <div className={pageStyle}>
      <div className={headerStyle}>
        <SegmentedControl
          items={TABS}
          value={tab}
          onChange={handleTabChange}
          aria-label="기록 보기 전환"
          fullWidth
        />
      </div>

      {tab === 'mine' ? (
        !isAuthenticated ? (
          <Empty
            title="로그인이 필요해요"
            description="내 기록은 로그인 후 확인할 수 있습니다."
            action={
              <Button
                onClick={() =>
                  openLogin(navigate, { returnTo: ROUTES.recordTab('myrecord') })
                }
              >
                로그인하기
              </Button>
            }
          />
        ) : isLoading ? (
          <RecordsSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => void refetch()} />
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
