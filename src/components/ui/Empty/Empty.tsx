import type { ReactNode } from 'react'
import { AlertCircle, Heart, Search } from 'lucide-react'
import {
  emptyDescriptionStyle,
  emptyStyle,
  emptyTitleStyle,
  iconWrapRecipe,
} from './Empty.css.ts'

type EmptyTone = 'neutral' | 'primary' | 'danger'

type EmptyProps = {
  /** 제목. 기본값 빈 문자열 */
  title?: string
  /** 보조 설명. 기본값 빈 문자열 */
  description?: string
  /** 아이콘·톤. 기본값 neutral */
  tone?: EmptyTone
  /** 커스텀 아이콘. 없으면 tone별 기본 아이콘 */
  icon?: ReactNode
  /** 하단 액션 슬롯 (버튼 등) */
  action?: ReactNode
}

const defaultIcons: Record<EmptyTone, ReactNode> = {
  neutral: <Search size={24} />,
  primary: <Heart size={24} />,
  danger: <AlertCircle size={24} />,
}

/**
 * 데이터가 없을 때 보여주는 빈 상태.
 *
 * @example
 * <Empty title="결과가 없어요" description="다른 조건으로 검색해 보세요" tone="neutral" />
 */
export function Empty({
  title = '',
  description = '',
  tone = 'neutral',
  icon,
  action,
}: EmptyProps) {
  return (
    <div className={emptyStyle} role="status">
      <span className={iconWrapRecipe({ tone })} aria-hidden>
        {icon ?? defaultIcons[tone]}
      </span>
      <div>
        <p className={emptyTitleStyle}>{title}</p>
        <p className={emptyDescriptionStyle}>{description}</p>
      </div>
      {action}
    </div>
  )
}
