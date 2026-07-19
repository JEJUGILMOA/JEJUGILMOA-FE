import { ChevronLeft } from 'lucide-react'
import { type ReactNode } from 'react'
import { heading2 } from '@/styles/typography.css.ts'
import { cn } from '@/utils/cn'
import {
  backButton,
  pageHeaderLeft,
  pageHeaderRight,
  pageHeaderRoot,
  pageHeaderTitle,
} from './PageHeader.css.ts'

export type PageHeaderProps = {
  title: string
  showBack?: boolean
  onBack?: () => void
  rightSlot?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  showBack = false,
  onBack,
  rightSlot,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn(pageHeaderRoot, className)}>
      <div className={pageHeaderLeft}>
        {showBack ? (
          <button type="button" className={backButton} onClick={onBack} aria-label="뒤로 가기">
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
        ) : null}
        <h1 className={cn(heading2, pageHeaderTitle)}>{title}</h1>
      </div>
      {rightSlot ? <div className={pageHeaderRight}>{rightSlot}</div> : null}
    </header>
  )
}
