import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Loading } from '@/components/ui/Loading/Loading'
import { ROUTES } from '@/constants'
import { BADGE_GROUP_LABEL } from '@/features/badges/format'
import { useMyBadgesQuery } from '@/features/badges/hooks'
import type { Badge } from '@/features/badges/schemas'
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
  sectionTitleStyle,
} from './BadgesPage.css.ts'

function nextProgressHint(badges: Badge[]) {
  const target = badges.find(
    (badge) =>
      !badge.acquired &&
      badge.currentProgress != null &&
      badge.targetProgress != null &&
      badge.targetProgress > badge.currentProgress,
  )
  if (!target || target.targetProgress == null || target.currentProgress == null) return null
  const remaining = target.targetProgress - target.currentProgress
  return `다음 배지까지 ${remaining} 남음`
}

export function BadgesPage() {
  const navigate = useNavigate()
  const badgesQuery = useMyBadgesQuery()

  const badges = useMemo(
    () => (badgesQuery.data ?? []).flatMap((group) => group.badges),
    [badgesQuery.data],
  )
  const earnedCount = badges.filter((badge) => badge.acquired).length
  const progressHint = nextProgressHint(badges)

  return (
    <div className={pageStyle}>
      <PageHeader title="획득 배지" showBack onBack={() => navigate(ROUTES.my)} />

      {badgesQuery.isLoading ? <Loading label="배지 불러오는 중" /> : null}
      {badgesQuery.isError ? <ErrorState onRetry={() => void badgesQuery.refetch()} /> : null}

      {!badgesQuery.isLoading && !badgesQuery.isError ? (
        <>
          <div className={progressCardStyle}>
            <p className={progressTextStyle}>
              {earnedCount}/{badges.length} 배지 획득
            </p>
            {progressHint ? <p className={badgeDescStyle}>{progressHint}</p> : null}
          </div>

          {(badgesQuery.data ?? []).map((group) => (
            <section key={group.group}>
              <h2 className={sectionTitleStyle}>{BADGE_GROUP_LABEL[group.group]}</h2>
              {group.badges.length === 0 ? (
                <Empty title="배지가 없어요" description="곧 새로운 배지가 추가될 예정이에요." />
              ) : (
                <div className={gridStyle}>
                  {group.badges.map((badge) => (
                    <div
                      key={badge.badgeId}
                      className={cn(badgeCardStyle, !badge.acquired && lockedStyle)}
                    >
                      <p className={badgeNameStyle}>{badge.name}</p>
                      <p className={badgeDescStyle}>{badge.description}</p>
                      {!badge.acquired &&
                      badge.currentProgress != null &&
                      badge.targetProgress != null ? (
                        <p className={badgeDescStyle}>
                          {badge.currentProgress}/{badge.targetProgress}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </>
      ) : null}
    </div>
  )
}
