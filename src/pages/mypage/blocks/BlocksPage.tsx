import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { ROUTES } from '@/constants'
import { useBlockedUsersQuery, useUnblockUserMutation } from '@/features/users/hooks'
import { ProfileAvatar } from '@/pages/mypage/components/ProfileAvatar/ProfileAvatar'
import {
  itemStyle,
  listStyle,
  metaStyle,
  nameStyle,
  pageStyle,
  skeletonAvatarStyle,
  skeletonItemStyle,
} from './BlocksPage.css.ts'

function BlocksSkeleton() {
  return (
    <ul className={listStyle} aria-hidden>
      {Array.from({ length: 4 }, (_, index) => (
        <li key={index} className={skeletonItemStyle}>
          <Skeleton width={42} height={42} className={skeletonAvatarStyle} />
          <Skeleton width="42%" height={18} />
          <Skeleton width={72} height={32} />
        </li>
      ))}
    </ul>
  )
}

/** 마이페이지 — 차단한 사용자 목록·해제 */
export function BlocksPage() {
  const navigate = useNavigate()
  const blockedUsersQuery = useBlockedUsersQuery()
  const unblockMutation = useUnblockUserMutation()

  const users = blockedUsersQuery.data ?? []
  const unblockingId = unblockMutation.isPending
    ? unblockMutation.variables?.targetUserId
    : undefined

  return (
    <div className={pageStyle}>
      <PageHeader title="차단 관리" showBack onBack={() => navigate(ROUTES.my)} />

      {blockedUsersQuery.isPending ? (
        <BlocksSkeleton />
      ) : blockedUsersQuery.isError ? (
        <ErrorState
          title="차단 목록을 불러오지 못했어요"
          onRetry={() => void blockedUsersQuery.refetch()}
        />
      ) : users.length === 0 ? (
        <Empty
          title="차단한 사용자가 없어요"
          description="사용자를 차단하면 여기서 관리할 수 있어요."
        />
      ) : (
        <ul className={listStyle}>
          {users.map((user) => (
            <li key={user.userId} className={itemStyle}>
              <ProfileAvatar
                nickname={user.nickname}
                imageUrl={user.profileImageUrl ?? undefined}
                size="sm"
              />
              <div className={metaStyle}>
                <span className={nameStyle}>{user.nickname}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={unblockingId === user.userId}
                isLoading={unblockingId === user.userId}
                onClick={() =>
                  unblockMutation.mutate({
                    targetUserId: user.userId,
                    nickname: user.nickname,
                  })
                }
              >
                차단 해제
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
