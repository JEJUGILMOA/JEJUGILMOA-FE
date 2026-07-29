import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type UIEvent,
} from 'react'
import { cn } from '@/utils/cn'
import {
  fadeLeftStyle,
  fadeRightStyle,
  scrollAreaStyle,
  wrapperStyle,
} from './HorizontalScrollArea.css.ts'

const EDGE_THRESHOLD_PX = 2

type HorizontalScrollAreaProps = {
  children: ReactNode
  /** 스크롤 영역 className (ul/div 등) */
  className?: string
  /** 래퍼 className */
  wrapperClassName?: string
  /** 스크롤 요소 태그. 기본값 div */
  as?: 'div' | 'ul'
  /**
   * 끝 그라데이션 설정.
   * - false: 페이드 숨김
   * - color: 페이지 배경색에 맞출 hex (기본 #FDFEFE)
   * - width: 페이드 너비 px (기본 32)
   */
  fade?: false | {
    color?: string
    width?: number
  }
  'aria-label'?: string
  role?: string
}

function readEdges(element: HTMLElement) {
  const { scrollLeft, scrollWidth, clientWidth } = element
  const maxScroll = scrollWidth - clientWidth
  return {
    canScrollLeft: scrollLeft > EDGE_THRESHOLD_PX,
    canScrollRight: maxScroll > EDGE_THRESHOLD_PX && scrollLeft < maxScroll - EDGE_THRESHOLD_PX,
  }
}

function toRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '')
  if (normalized.length !== 6) return `rgba(253, 254, 255, ${alpha})`
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * 가로 스크롤 영역. 더 넘길 수 있는 쪽에 끝 그라데이션 힌트를 표시합니다.
 */
export function HorizontalScrollArea({
  children,
  className,
  wrapperClassName,
  as = 'div',
  fade,
  'aria-label': ariaLabel,
  role,
}: HorizontalScrollAreaProps) {
  const scrollRef = useRef<HTMLElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const showFade = fade !== false
  const fadeColor = (fade === false ? undefined : fade)?.color ?? '#FDFEFE'
  const fadeWidth = (fade === false ? undefined : fade)?.width ?? 32

  const syncEdges = useCallback(() => {
    if (!showFade) return
    const element = scrollRef.current
    if (!element) return
    const next = readEdges(element)
    setCanScrollLeft(next.canScrollLeft)
    setCanScrollRight(next.canScrollRight)
  }, [showFade])

  useEffect(() => {
    if (!showFade) return
    const element = scrollRef.current
    if (!element) return

    const sync = () => syncEdges()
    sync()
    const rafId = requestAnimationFrame(sync)

    const resizeObserver = new ResizeObserver(sync)
    resizeObserver.observe(element)

    const mutationObserver = new MutationObserver(sync)
    mutationObserver.observe(element, { childList: true, subtree: true })

    window.addEventListener('resize', sync)
    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [showFade, syncEdges])

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    if (!showFade) return
    const next = readEdges(event.currentTarget)
    setCanScrollLeft(next.canScrollLeft)
    setCanScrollRight(next.canScrollRight)
  }

  const setScrollNode = useCallback((node: HTMLElement | null) => {
    scrollRef.current = node
  }, [])

  const sharedClassName = cn(scrollAreaStyle, className)
  const wrapperVars = {
    ['--scroll-fade-width' as string]: `${fadeWidth}px`,
  } satisfies CSSProperties

  return (
    <div className={cn(wrapperStyle, wrapperClassName)} style={wrapperVars}>
      {showFade ? (
        <div
          className={fadeLeftStyle}
          data-visible={canScrollLeft ? 'true' : 'false'}
          aria-hidden
          style={{
            background: `linear-gradient(90deg, ${fadeColor} 0%, ${toRgba(fadeColor, 0)} 100%)`,
          }}
        />
      ) : null}

      {as === 'ul' ? (
        <ul
          ref={setScrollNode}
          className={sharedClassName}
          onScroll={handleScroll}
          aria-label={ariaLabel}
          role={role}
        >
          {children}
        </ul>
      ) : (
        <div
          ref={setScrollNode}
          className={sharedClassName}
          onScroll={handleScroll}
          aria-label={ariaLabel}
          role={role}
        >
          {children}
        </div>
      )}

      {showFade ? (
        <div
          className={fadeRightStyle}
          data-visible={canScrollRight ? 'true' : 'false'}
          aria-hidden
          style={{
            background: `linear-gradient(270deg, ${fadeColor} 0%, ${toRgba(fadeColor, 0)} 100%)`,
          }}
        />
      ) : null}
    </div>
  )
}
