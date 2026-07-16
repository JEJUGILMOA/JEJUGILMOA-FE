import type { ReactNode } from 'react'
import { emptyStyle, emptyTitleStyle, emptyDescriptionStyle } from './Empty.css.ts'

type EmptyProps = {
  title?: string
  description?: string
  action?: ReactNode
}

export function Empty({
  title = '아직 내용이 없어요',
  description = '새로운 여행 장소를 탐색해 보세요.',
  action,
}: EmptyProps) {
  return (
    <div className={emptyStyle} role="status">
      <p className={emptyTitleStyle}>{title}</p>
      <p className={emptyDescriptionStyle}>{description}</p>
      {action}
    </div>
  )
}
