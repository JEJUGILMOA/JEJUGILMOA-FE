import { GripVertical, X } from 'lucide-react'
import { useState, type DragEvent } from 'react'
import {
  dragHandleStyle,
  listStyle,
  removeButtonStyle,
  rowStyle,
  timeBadgeStyle,
  titleStyle,
} from './ScheduleList.css.ts'

export type ScheduleListItem = {
  id: string
  title: string
  time: string
}

export type ScheduleListProps = {
  items: ScheduleListItem[]
  onReorder: (nextOrderIds: string[]) => void
  onRemove: (id: string) => void
}

/** STEP 05 Day 일정 목록. 드래그로 순서를 바꾸고 ×로 제거한다 */
export function ScheduleList({ items, onReorder, onRemove }: ScheduleListProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const handleDragStart = (id: string) => (event: DragEvent<HTMLDivElement>) => {
    setDraggingId(id)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (targetId: string) => (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!draggingId || draggingId === targetId) return

    const fromIndex = items.findIndex((item) => item.id === draggingId)
    const toIndex = items.findIndex((item) => item.id === targetId)
    if (fromIndex === -1 || toIndex === -1) return

    const nextOrder = items.map((item) => item.id)
    const [moved] = nextOrder.splice(fromIndex, 1)
    nextOrder.splice(toIndex, 0, moved)
    onReorder(nextOrder)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
  }

  return (
    <div className={listStyle}>
      {items.map((item) => (
        <div
          key={item.id}
          className={rowStyle}
          data-dragging={item.id === draggingId}
          draggable
          onDragStart={handleDragStart(item.id)}
          onDragOver={handleDragOver(item.id)}
          onDragEnd={handleDragEnd}
        >
          <span className={dragHandleStyle} aria-hidden>
            <GripVertical size={16} />
          </span>
          <span className={timeBadgeStyle}>{item.time}</span>
          <span className={titleStyle}>{item.title}</span>
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
