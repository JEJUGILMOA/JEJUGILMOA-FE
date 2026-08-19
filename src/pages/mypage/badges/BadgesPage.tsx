import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { ROUTES } from '@/constants'
import { mockBadges } from '@/pages/mypage/data/mockMyPage'
import { cn } from '@/utils/cn'
import {
  badgeCardStyle,
  badgeDescStyle,
  badgeNameStyle,
  gridStyle,
  lockedStyle,
  pageStyle,
  progressCardStyle,
  progressTextStyle,
} from './BadgesPage.css.ts'

export function BadgesPage() {
  const navigate = useNavigate()
  const earnedCount = mockBadges.filter((badge) => badge.earned).length

  return (
    <div className={pageStyle}>
      <PageHeader title="획득 배지" showBack onBack={() => navigate(ROUTES.my)} />

      <div className={progressCardStyle}>
        <p className={progressTextStyle}>
          {earnedCount}/{mockBadges.length} 배지 획득
        </p>
        <p className={badgeDescStyle}>다음 배지까지 방문 4곳</p>
      </div>

      <div className={gridStyle}>
        {mockBadges.map((badge) => (
          <div key={badge.id} className={cn(badgeCardStyle, !badge.earned && lockedStyle)}>
            <p className={badgeNameStyle}>{badge.name}</p>
            <p className={badgeDescStyle}>{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
