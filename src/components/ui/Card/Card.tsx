import type { HTMLAttributes, ReactNode } from 'react'
import { cardStyle, cardTitleStyle, cardBodyStyle } from './Card.css.ts'
import { cn } from '@/utils/cn'

type CardProps = HTMLAttributes<HTMLElement> & {
  title?: string
  children: ReactNode
  as?: 'article' | 'section' | 'div'
}

export function Card({ title, children, className, as: Component = 'article', ...props }: CardProps) {
  return (
    <Component className={cn(cardStyle, className)} {...props}>
      {title ? <h3 className={cardTitleStyle}>{title}</h3> : null}
      <div className={cardBodyStyle}>{children}</div>
    </Component>
  )
}
