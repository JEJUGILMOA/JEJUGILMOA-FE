import { useEffect, useRef } from 'react'

type UseLoadMoreSentinelOptions = {
  enabled: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  /** 뷰포트와 얼마나 미리 교차하면 로드할지 (px) */
  rootMargin?: string
}

/** 목록 하단 sentinel이 보이면 다음 페이지를 요청한다 */
export function useLoadMoreSentinel({
  enabled,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  rootMargin = '240px',
}: UseLoadMoreSentinelOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const onLoadMoreRef = useRef(onLoadMore)
  onLoadMoreRef.current = onLoadMore

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !enabled || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        if (isFetchingNextPage) return
        onLoadMoreRef.current()
      },
      { root: null, rootMargin, threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled, hasNextPage, isFetchingNextPage, rootMargin])

  return sentinelRef
}
