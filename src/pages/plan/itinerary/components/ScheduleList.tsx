import { GripVertical, Star, X } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { cn } from '@/utils/cn'
import {
  dragHandleStyle,
  listStyle,
  mustVisitButtonRecipe,
  removeButtonStyle,
  rowMustVisitStyle,
  rowStyle,
  titleStyle,
} from './ScheduleList.css.ts'
import { TimeField } from './TimeField'

export type ScheduleListItem = {
  id: string
  title: string
  time: string
}

export type ScheduleListProps = {
  items: ScheduleListItem[]
  /** 이 Day에서 "꼭 가고 싶은 장소"로 정한 곳들(최대 4개) */
  mustVisitIds: string[]
  onReorder: (nextOrderIds: string[]) => void
  onRemove: (id: string) => void
  onTimeChange: (id: string, time: string) => void
  onToggleMustVisit: (id: string) => void
}

/**
 * STEP 05 Day 일정 목록. ⋮⋮ 손잡이를 포인터로 드래그해 순서를 바꾸고, 시간을 수정하고, ×로 제거한다.
 *
 * 네이티브 HTML5 draggable 대신 포인터 이벤트로 직접 구현한다 — 브라우저의 native
 * drag-and-drop은 드래그 도중 원본 DOM이 재배치되면 제스처가 끊기는 등 실제 마우스로는
 * 신뢰도가 낮았다. window에 pointermove/pointerup을 붙이는 방식은 ItineraryBottomSheet의
 * 드래그 구현과 동일하며, 훨씬 안정적으로 동작한다.
 */
export function ScheduleList({
  items,
  mustVisitIds,
  onReorder,
  onRemove,
  onTimeChange,
  onToggleMustVisit,
}: ScheduleListProps) {
  const rowRefs = useRef(new Map<string, HTMLDivElement>())
  const previewOrderRef = useRef<string[] | null>(null)
  const dragStartYRef = useRef(0)
  const dragStartTopRef = useRef(0)

  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [previewOrder, setPreviewOrder] = useState<string[] | null>(null)
  const [dragOffsetY, setDragOffsetY] = useState(0)

  const orderedIds = previewOrder ?? items.map((item) => item.id)
  const itemsById = new Map(items.map((item) => [item.id, item]))
  const orderedItems = orderedIds
    .map((id) => itemsById.get(id))
    .filter((item): item is ScheduleListItem => item !== undefined)

  const handleHandlePointerDown = (id: string) => (event: ReactPointerEvent<HTMLSpanElement>) => {
    event.preventDefault()
    const row = rowRefs.current.get(id)
    dragStartYRef.current = event.clientY
    dragStartTopRef.current = row?.getBoundingClientRect().top ?? 0

    const initialOrder = items.map((item) => item.id)
    previewOrderRef.current = initialOrder
    setPreviewOrder(initialOrder)
    setDragOffsetY(0)
    setDraggingId(id)
  }

  useEffect(() => {
    if (!draggingId) return

    const handleMove = (event: PointerEvent) => {
      const offsetY = event.clientY - dragStartYRef.current
      setDragOffsetY(offsetY)

      const current = previewOrderRef.current
      if (!current) return

      const draggedRow = rowRefs.current.get(draggingId)
      const rowHeight = draggedRow?.getBoundingClientRect().height ?? 0
      const draggedMidY = dragStartTopRef.current + rowHeight / 2 + offsetY

      const others = current.filter((id) => id !== draggingId)
      let insertIndex = others.length
      for (let i = 0; i < others.length; i += 1) {
        const el = rowRefs.current.get(others[i])
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (draggedMidY < rect.top + rect.height / 2) {
          insertIndex = i
          break
        }
      }

      const next = [...others]
      next.splice(insertIndex, 0, draggingId)
      if (next.join('|') !== current.join('|')) {
        previewOrderRef.current = next
        setPreviewOrder(next)
      }
    }

    const handleUp = () => {
      setDraggingId(null)
      setDragOffsetY(0)
      const finalOrder = previewOrderRef.current
      previewOrderRef.current = null
      setPreviewOrder(null)
      if (finalOrder) onReorder(finalOrder)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingId])

  return (
    <div className={listStyle}>
      {orderedItems.map((item) => (
        <div
          key={item.id}
          ref={(el) => {
            if (el) rowRefs.current.set(item.id, el)
            else rowRefs.current.delete(item.id)
          }}
          className={cn(rowStyle, mustVisitIds.includes(item.id) && rowMustVisitStyle)}
          data-dragging={item.id === draggingId}
          style={item.id === draggingId ? { transform: `translateY(${dragOffsetY}px)` } : undefined}
        >
          <span className={dragHandleStyle} onPointerDown={handleHandlePointerDown(item.id)} aria-hidden>
            <GripVertical size={16} />
          </span>
          <TimeField
            value={item.time}
            onChange={(time) => onTimeChange(item.id, time)}
            label={`${item.title} 시간`}
          />
          <span className={titleStyle}>{item.title}</span>
          <button
            type="button"
            className={mustVisitButtonRecipe({ active: mustVisitIds.includes(item.id) })}
            onClick={() => onToggleMustVisit(item.id)}
            aria-label={
              mustVisitIds.includes(item.id)
                ? `${item.title} 꼭 가고 싶은 장소 해제`
                : `${item.title}를 꼭 가고 싶은 장소로 정하기`
            }
          >
            <Star size={16} fill={mustVisitIds.includes(item.id) ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            className={removeButtonStyle}
            onClick={() => onRemove(item.id)}
            aria-label={`${item.title} 일정에서 제거`}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
