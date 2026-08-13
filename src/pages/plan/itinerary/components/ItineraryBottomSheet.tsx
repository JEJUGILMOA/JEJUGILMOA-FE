import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { ChevronUp } from 'lucide-react'
import {
  bodyStyle,
  contentStyle,
  expandButtonStyle,
  handleStyle,
  handleWrapStyle,
  titleStyle,
} from './ItineraryBottomSheet.css.ts'

const SNAP_FRACTIONS = [0.28, 0.58, 0.92]
/** 드래그로 끝까지 내리면 네이버맵처럼 시트가 완전히 사라진다 — 대신 지도 위에
 * 뜨는 별도 버튼으로만 다시 펼칠 수 있다. */
const COLLAPSED_HEIGHT = 0

export type ItineraryBottomSheetProps = {
  title: string
  children: ReactNode
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * 지도 위에 항상 도킹되는 바텀시트. vaul 대신 손잡이 영역만 드래그 가능한
 * 직접 구현으로 만들어, 리스트 스크롤과 시트 리사이즈 제스처가 서로 간섭하지 않는다.
 *
 * 드래그 중에는 포인터가 손잡이 밖으로 벗어나도(빠르게 쓸어올리는 동작 등) 계속
 * 추적되도록 window에 move/up 리스너를 붙인다 — setPointerCapture 하나에만
 * 의존하면 캡처가 실패하는 환경(또는 손잡이가 작아 빠르게 벗어나는 제스처)에서
 * 드래그가 중간에 끊기는 문제가 있었다.
 */
export function ItineraryBottomSheet({ title, children }: ItineraryBottomSheetProps) {
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === 'undefined' ? 800 : window.innerHeight,
  )

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const snapHeights = SNAP_FRACTIONS.map((fraction) => Math.round(viewportHeight * fraction))
  const minHeight = snapHeights[0]
  const maxHeight = snapHeights[snapHeights.length - 1]
  // 드래그로는 손잡이만 남기고(COLLAPSED_HEIGHT) 완전히 접을 수도 있다 — 지도를 크게 보고 싶을 때.
  const allSnapHeights = [COLLAPSED_HEIGHT, ...snapHeights]

  const [height, setHeight] = useState(minHeight)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null)
  // 접힌 상태에서 다시 펼칠 때 되돌아갈 높이 (마지막으로 펼쳐져 있던 스냅 지점)
  const lastExpandedHeightRef = useRef(minHeight)

  const isCollapsed = height <= COLLAPSED_HEIGHT

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { startY: event.clientY, startHeight: height }
    setIsDragging(true)
  }

  const expand = () => setHeight(lastExpandedHeightRef.current)

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (event: PointerEvent) => {
      if (!dragRef.current) return
      const dy = event.clientY - dragRef.current.startY
      setHeight(clamp(dragRef.current.startHeight - dy, COLLAPSED_HEIGHT, maxHeight))
    }

    const handleEnd = () => {
      dragRef.current = null
      setIsDragging(false)
      setHeight((current) => {
        const snapped = allSnapHeights.reduce((closest, snap) =>
          Math.abs(snap - current) < Math.abs(closest - current) ? snap : closest,
        )
        if (snapped > COLLAPSED_HEIGHT) lastExpandedHeightRef.current = snapped
        return snapped
      })
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleEnd)
    window.addEventListener('pointercancel', handleEnd)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleEnd)
      window.removeEventListener('pointercancel', handleEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  // 완전히 접힌 뒤(드래그가 끝난 상태)에만 별도 펼치기 버튼을 띄운다 — 드래그 도중에는
  // 시트 자체가 손잡이 역할을 하니 버튼이 끼어들 필요가 없다.
  const showExpandButton = isCollapsed && !isDragging

  return (
    <>
      <div
        className={contentStyle}
        style={{ height, transition: isDragging ? 'none' : 'height 220ms ease' }}
      >
        <div className={handleWrapStyle} onPointerDown={handlePointerDown}>
          <div className={handleStyle} aria-hidden />
          <span className={titleStyle}>{title}</span>
        </div>

        <div className={bodyStyle}>{children}</div>
      </div>

      {showExpandButton ? (
        <button type="button" className={expandButtonStyle} onClick={expand}>
          <ChevronUp size={16} aria-hidden />
          {title}
        </button>
      ) : null}
    </>
  )
}
