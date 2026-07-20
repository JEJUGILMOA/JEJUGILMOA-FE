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
  /** 페이지 제목 */
  title: string
  /** true면 뒤로 가기 버튼 표시. 기본값 false */
  showBack?: boolean
  /** 뒤로 가기 클릭 핸들러 */
  onBack?: () => void
  /** 우측 액션 슬롯 (아이콘 버튼 등) */
  rightSlot?: ReactNode
  className?: string
}

/**
 * 페이지 상단 헤더. 뒤로 가기와 우측 슬롯을 지원합니다.
 *
 * @example
 * <PageHeader title="장소 상세" showBack onBack={goBack} rightSlot={<IconButton />} />
 */
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
