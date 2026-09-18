import { useLayoutEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/utils/cn'
import { memoBodyRecipe, memoRecipe, memoToggleStyle } from './ExpandableMemo.css.ts'

export type ExpandableMemoProps = {
  text: string
  className?: string
}

/** 회색 박스 텍스트. 3줄을 넘으면 더보기/접기 */
export function ExpandableMemo({ text, className }: ExpandableMemoProps) {
  const [expanded, setExpanded] = useState(false)
  const [canToggle, setCanToggle] = useState(false)
  const bodyRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const el = bodyRef.current
    if (!el) return

    const measure = () => {
      // 접힌 상태에서만 넘침을 측정한다 (펼치면 scrollHeight === clientHeight가 됨)
      if (expanded) return
      setCanToggle(el.scrollHeight > el.clientHeight + 1)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [text, expanded])

  return (
    <div className={cn(memoRecipe(), className)}>
      <p ref={bodyRef} className={memoBodyRecipe({ collapsed: !expanded })}>
        {text}
      </p>
      {canToggle ? (
        <button
          type="button"
          className={memoToggleStyle}
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <>
              접기 <ChevronUp size={14} aria-hidden />
            </>
          ) : (
            <>
              더보기 <ChevronDown size={14} aria-hidden />
            </>
          )}
        </button>
      ) : null}
    </div>
  )
}
