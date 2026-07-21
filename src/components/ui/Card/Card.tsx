import type { HTMLAttributes, ReactNode } from 'react'
import { cardStyle, cardTitleStyle, cardBodyStyle } from './Card.css.ts'
import { cn } from '@/utils/cn'

type CardProps = HTMLAttributes<HTMLElement> & {
  /** 카드 상단 제목 */
  title?: string
  /** 본문 내용 */
  children: ReactNode
  /** 루트 시맨틱 태그. 기본값 article */
  as?: 'article' | 'section' | 'div'
}

/**
 * 제목·본문을 담는 카드 컨테이너.
 *
 * @example
 * <Card title="안내">내용을 여기에 넣습니다.</Card>
 */
export function Card({ title, children, className, as: Component = 'article', ...props }: CardProps) {
  return (
    <Component className={cn(cardStyle, className)} {...props}>
      {title ? <h3 className={cardTitleStyle}>{title}</h3> : null}
      <div className={cardBodyStyle}>{children}</div>
    </Component>
  )
}
