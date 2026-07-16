import type { ReactNode } from 'react'
import { headerStyle, titleStyle } from './AppHeader.css.ts'

type AppHeaderProps = {
  title: string
  rightSlot?: ReactNode
}

export function AppHeader({ title, rightSlot }: AppHeaderProps) {
  return (
    <header className={headerStyle}>
      <h1 className={titleStyle}>{title}</h1>
      {rightSlot}
    </header>
  )
}
