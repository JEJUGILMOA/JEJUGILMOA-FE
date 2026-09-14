import { useNavigate } from 'react-router'
import { BookOpen, ChevronRight, MapPin, Settings, Share2, Sparkles } from 'lucide-react'
import { getErrorMessage } from '@/api/error'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { useMyProfileQuery } from '@/features/auth/hooks'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants'
import { MenuListItem } from '@/pages/mypage/components/MenuListItem/MenuListItem'
import { ProfileAvatar } from '@/pages/mypage/components/ProfileAvatar/ProfileAvatar'
import {
  chevronStyle,
  emailStyle,
  menuListStyle,
  nameStyle,
  pageStyle,
  profileButtonStyle,
  profileMetaStyle,
  profileRowStyle,
  profileSkeletonAvatarStyle,
  profileSkeletonEmailStyle,
  profileSkeletonNameStyle,
} from './MyPage.css.ts'

const MENU_ITEMS = [
  { label: '내 여행', to: ROUTES.myTrips, icon: BookOpen },
  { label: '즐겨찾기', to: ROUTES.myFavorites, icon: MapPin },
  { label: '배지', to: ROUTES.myBadges, icon: Sparkles },
  { label: '공유기록', to: ROUTES.mySharedRecords, icon: Share2 },
  { label: '설정', to: ROUTES.mySettings, icon: Settings },
] as const

export function MyPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isAuthResolved = useAuthStore((s) => s.isAuthResolved)
  const { data: profile, isPending, isError, error } = useMyProfileQuery()

  const nickname = profile?.nickname ?? user?.nickname ?? ''
  const email = profile?.email
  const imageUrl = profile?.profileImageUrl ?? user?.profileImageUrl
  // 네이티브 세션 주입 전 · 프로필 로딩 중에는 게스트 CTA 대신 스켈레톤
  const showProfileSkeleton =
    !isAuthResolved || (isAuthenticated && isPending && !profile)

  return (
    <div className={pageStyle}>
      <button
        type="button"
        className={profileButtonStyle}
        onClick={() => {
          if (!isAuthResolved) return
          navigate(isAuthenticated ? ROUTES.myProfile : `${ROUTES.login}?returnTo=${ROUTES.my}`)
        }}
        aria-label={
          !isAuthResolved ? '프로필 불러오는 중' : isAuthenticated ? '프로필 보기' : '로그인'
        }
        aria-busy={showProfileSkeleton || undefined}
        disabled={!isAuthResolved}
      >
        <div className={profileRowStyle}>
          {showProfileSkeleton ? (
            <Skeleton width={74} height={74} className={profileSkeletonAvatarStyle} />
          ) : (
            <ProfileAvatar
              nickname={isAuthenticated ? nickname || '사용자' : '게스트'}
              imageUrl={isAuthenticated ? imageUrl : undefined}
              size="md"
            />
          )}
          <div className={profileMetaStyle}>
            {showProfileSkeleton ? (
              <>
                <Skeleton width="42%" height={22} className={profileSkeletonNameStyle} />
                <Skeleton width="68%" height={14} className={profileSkeletonEmailStyle} />
              </>
            ) : (
              <>
                <span className={nameStyle}>
                  {!isAuthenticated ? '로그인하기' : nickname || '사용자'}
                </span>
                <span className={emailStyle}>
                  {!isAuthenticated
                    ? '로그인이 필요해요'
                    : isError
                      ? getErrorMessage(error, '프로필을 불러오지 못했어요')
                      : (email ?? '이메일 없음')}
                </span>
              </>
            )}
          </div>
          <ChevronRight className={chevronStyle} size={16} strokeWidth={2} aria-hidden />
        </div>
      </button>

      <div className={menuListStyle}>
        {MENU_ITEMS.map(({ label, to, icon: Icon }) => (
          <MenuListItem
            key={to}
            label={label}
            icon={<Icon size={15} strokeWidth={2} />}
            onClick={() => navigate(to)}
          />
        ))}
      </div>
    </div>
  )
}
