import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Button } from '@/components/ui/Button/Button'
import { Loading } from '@/components/ui/Loading/Loading'
import { getErrorMessage } from '@/api/error'
import { formatJoinedAt } from '@/features/auth/format'
import { useMyProfileQuery } from '@/features/auth/hooks'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants'
import { ProfileAvatar } from '@/pages/mypage/components/ProfileAvatar/ProfileAvatar'
import {
  bioStyle,
  infoLabelStyle,
  infoRowStyle,
  infoValueStyle,
  nameStyle,
  pageStyle,
  profileBlockStyle,
  statsItemStyle,
  statsLabelStyle,
  statsRowStyle,
  statsValueStyle,
  editButtonStyle,
} from './ProfilePage.css.ts'
import { profileMetaBlockStyle } from '../MyPage.css.ts'

export function ProfilePage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const { data: profile, isPending, isError, error, refetch } = useMyProfileQuery()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`${ROUTES.login}?returnTo=${ROUTES.myProfile}`, { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  if (isPending) {
    return (
      <div className={pageStyle}>
        <PageHeader title="프로필" showBack onBack={() => navigate(ROUTES.my)} />
        <Loading label="프로필 불러오는 중" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className={pageStyle}>
        <PageHeader title="프로필" showBack onBack={() => navigate(ROUTES.my)} />
        <p>{getErrorMessage(error, '프로필을 불러오지 못했어요.')}</p>
        <Button fullWidth onClick={() => void refetch()}>
          다시 시도
        </Button>
      </div>
    )
  }

  const nickname = profile.nickname || user?.nickname || '사용자'

  return (
    <div className={pageStyle}>
      <PageHeader title="프로필" showBack onBack={() => navigate(ROUTES.my)} />

      <div className={profileBlockStyle}>
        <ProfileAvatar
          nickname={nickname}
          imageUrl={profile.profileImageUrl ?? user?.profileImageUrl}
          size="lg"
        />
        <div className={profileMetaBlockStyle}>
          <span className={nameStyle}>{nickname}</span>
          <span className={bioStyle}>{profile.bio?.trim() || '한줄 소개가 없어요'}</span>
        </div>
      </div>

      <div className={statsRowStyle}>
        <button
          type="button"
          className={statsItemStyle}
          onClick={() => navigate(ROUTES.myTrips)}
        >
          <span className={statsValueStyle}>{profile.completedTripCount ?? 0}</span>
          <span className={statsLabelStyle}>완료 여행</span>
        </button>
        <button
          type="button"
          className={statsItemStyle}
          onClick={() => navigate(ROUTES.myFavorites)}
        >
          <span className={statsValueStyle}>{profile.favoriteCount ?? 0}</span>
          <span className={statsLabelStyle}>즐겨찾기</span>
        </button>
        <button
          type="button"
          className={statsItemStyle}
          onClick={() => navigate(ROUTES.myBadges)}
        >
          <span className={statsValueStyle}>{profile.badgeCount ?? 0}</span>
          <span className={statsLabelStyle}>배지</span>
        </button>
      </div>

      <div className={infoRowStyle}>
        <span className={infoLabelStyle}>이메일</span>
        <span className={infoValueStyle}>{profile.email || '-'}</span>
      </div>
      <div className={infoRowStyle}>
        <span className={infoLabelStyle}>가입일</span>
        <span className={infoValueStyle}>{formatJoinedAt(profile.joinedAt)}</span>
      </div>

      <Button
        className={editButtonStyle}
        size="lg"
        fullWidth
        onClick={() => navigate(ROUTES.myProfileEdit)}
      >
        프로필 수정
      </Button>
    </div>
  )
}
