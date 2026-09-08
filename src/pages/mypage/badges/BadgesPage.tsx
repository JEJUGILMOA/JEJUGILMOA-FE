import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Info, Lock } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Modal } from '@/components/ui/Modal/Modal'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { ROUTES } from '@/constants'
import { BADGE_GROUP_THEME } from '@/features/badges/format'
import { useMyBadgesQuery } from '@/features/badges/hooks'
import type { Badge, BadgeGroup } from '@/features/badges/schemas'
import { useAuthStore } from '@/stores/authStore'
import {
  badgeImageStyle,
  badgeItemStyle,
  badgeMediaRecipe,
  badgeNameStyle,
  badgeProgressStyle,
  gridStyle,
  groupCardRecipe,
  groupCountStyle,
  groupHeaderStyle,
  groupIconRecipe,
  groupTitleStyle,
  infoButtonStyle,
  pageStyle,
  progressCardStyle,
  progressCountAccentStyle,
  progressCountStyle,
  progressFillStyle,
  progressHeaderStyle,
  progressHintStyle,
  progressLabelStyle,
  progressMetaStyle,
  progressPercentStyle,
  progressTrackStyle,
  skeletonBadgeCellStyle,
  skeletonBadgeMediaStyle,
  skeletonGroupCardStyle,
  skeletonProgressCardStyle,
  skeletonStackStyle,
} from './BadgesPage.css.ts'

function BadgeCell({ badge, tone }: { badge: Badge; tone: BadgeGroup['group'] }) {
  const theme = BADGE_GROUP_THEME[tone]
  const current = badge.currentProgress ?? 0
  const target = badge.targetProgress
  const showProgress = target != null

  return (
    <div className={badgeItemStyle}>
      <div
        className={badgeMediaRecipe({
          tone: theme.cardClass,
          acquired: badge.acquired,
        })}
      >
        {badge.acquired && badge.imageUrl ? (
          <img src={badge.imageUrl} alt="" className={badgeImageStyle} />
        ) : badge.acquired ? (
          <span aria-hidden>✓</span>
        ) : (
          <Lock size={22} strokeWidth={2} aria-hidden />
        )}
      </div>
      <p className={badgeNameStyle}>{badge.name}</p>
      {showProgress ? (
        <p className={badgeProgressStyle}>
          {current} / {target}
        </p>
      ) : null}
    </div>
  )
}

function BadgesSkeleton() {
  return (
    <div className={skeletonStackStyle} aria-hidden>
      <section className={skeletonProgressCardStyle}>
        <Skeleton width="36%" height={18} />
        <Skeleton width="100%" height={10} />
        <Skeleton width="58%" height={14} />
      </section>
      {Array.from({ length: 2 }, (_, groupIndex) => (
        <section key={groupIndex} className={skeletonGroupCardStyle}>
          <Skeleton width="40%" height={18} />
          <div className={gridStyle}>
            {Array.from({ length: 4 }, (_, badgeIndex) => (
              <div key={badgeIndex} className={skeletonBadgeCellStyle}>
                <Skeleton width={56} height={56} className={skeletonBadgeMediaStyle} />
                <Skeleton width="80%" height={12} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export function BadgesPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const badgesQuery = useMyBadgesQuery()
  const [infoOpen, setInfoOpen] = useState(false)

  const groups = badgesQuery.data ?? []
  const badges = useMemo(() => groups.flatMap((group) => group.badges), [groups])
  const totalCount = badges.length
  const earnedCount = badges.filter((badge) => badge.acquired).length
  const remainingCount = Math.max(totalCount - earnedCount, 0)
  const percent = totalCount === 0 ? 0 : Math.round((earnedCount / totalCount) * 100)

  const progressHint =
    totalCount === 0
      ? '아직 등록된 배지가 없어요.'
      : remainingCount === 0
        ? '모든 배지를 획득했어요!'
        : `아직 ${remainingCount}개의 배지가 남았어요!`

  return (
    <div className={pageStyle}>
      <PageHeader
        title="획득 배지"
        showBack
        onBack={() => navigate(ROUTES.my)}
        rightSlot={
          <button
            type="button"
            className={infoButtonStyle}
            aria-label="배지 안내"
            onClick={() => setInfoOpen(true)}
          >
            <Info size={20} strokeWidth={2} />
          </button>
        }
      />

      {!isAuthenticated ? (
        <Empty
          title="로그인이 필요해요"
          description="배지 현황을 보려면 로그인해 주세요."
          action={
            <Button onClick={() => navigate(`${ROUTES.login}?returnTo=${ROUTES.myBadges}`)}>
              로그인
            </Button>
          }
        />
      ) : null}

      {isAuthenticated && badgesQuery.isLoading ? <BadgesSkeleton /> : null}
      {isAuthenticated && badgesQuery.isError ? (
        <ErrorState onRetry={() => void badgesQuery.refetch()} />
      ) : null}

      {isAuthenticated && !badgesQuery.isLoading && !badgesQuery.isError ? (
        <>
          <section className={progressCardStyle} aria-label="전체 진행률">
            <div className={progressHeaderStyle}>
              <h2 className={progressLabelStyle}>전체 진행률</h2>
              <p className={progressCountStyle}>
                <span className={progressCountAccentStyle}>{earnedCount}</span>
                {` / ${totalCount}`}
              </p>
            </div>
            <div className={progressTrackStyle} aria-hidden>
              <div className={progressFillStyle} style={{ width: `${percent}%` }} />
            </div>
            <div className={progressMetaStyle}>
              <p className={progressHintStyle}>{progressHint}</p>
              <p className={progressPercentStyle}>{percent}%</p>
            </div>
          </section>

          {groups.length === 0 ? (
            <Empty title="배지가 없어요" description="곧 새로운 배지가 추가될 예정이에요." />
          ) : (
            groups.map((group) => {
              const theme = BADGE_GROUP_THEME[group.group]
              const earnedInGroup = group.badges.filter((badge) => badge.acquired).length
              const Icon = theme.Icon

              return (
                <section
                  key={group.group}
                  className={groupCardRecipe({ tone: theme.cardClass })}
                  aria-label={theme.label}
                >
                  <div className={groupHeaderStyle}>
                    <span className={groupIconRecipe({ tone: theme.cardClass })}>
                      <Icon size={16} strokeWidth={2.2} />
                    </span>
                    <h2 className={groupTitleStyle}>{theme.label}</h2>
                    <span className={groupCountStyle}>
                      {earnedInGroup} / {group.badges.length}
                    </span>
                  </div>

                  {group.badges.length === 0 ? (
                    <Empty title="배지가 없어요" description="곧 새로운 배지가 추가될 예정이에요." />
                  ) : (
                    <div className={gridStyle}>
                      {group.badges.map((badge) => (
                        <BadgeCell key={badge.badgeId} badge={badge} tone={group.group} />
                      ))}
                    </div>
                  )}
                </section>
              )
            })
          )}
        </>
      ) : null}

      <Modal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="배지란?"
        description="여행 중 장소를 방문하고 조건을 달성하면 배지를 획득할 수 있어요. 잠긴 배지는 아직 조건이 남아 있는 상태예요."
        actions={[{ label: '확인', onClick: () => setInfoOpen(false) }]}
      />
    </div>
  )
}
