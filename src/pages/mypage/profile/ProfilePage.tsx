import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Button } from '@/components/ui/Button/Button'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants'
import { ProfileAvatar } from '@/pages/mypage/components/ProfileAvatar/ProfileAvatar'
import { mockProfile } from '@/pages/mypage/data/mockMyPage'
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
  const user = useAuthStore((s) => s.user)
  const nickname = user?.nickname ?? mockProfile.nickname

  return (
    <div className={pageStyle}>
      <PageHeader title="프로필" showBack onBack={() => navigate(ROUTES.my)} />

      <div className={profileBlockStyle}>
        <ProfileAvatar
          nickname={nickname}
          imageUrl={user?.profileImageUrl}
          size="lg"
        />
        <div className={profileMetaBlockStyle}>
          <span className={nameStyle}>{nickname}</span>
          <span className={bioStyle}>{mockProfile.bio}</span>
        </div>
      </div>

      <div className={statsRowStyle}>
        <button
          type="button"
          className={statsItemStyle}
          onClick={() => navigate(ROUTES.myTrips)}
        >
          <span className={statsValueStyle}>{mockProfile.completedTrips}</span>
          <span className={statsLabelStyle}>완료 여행</span>
        </button>
        <button
          type="button"
          className={statsItemStyle}
          onClick={() => navigate(ROUTES.myFavorites)}
        >
          <span className={statsValueStyle}>{mockProfile.favorites}</span>
          <span className={statsLabelStyle}>즐겨찾기</span>
        </button>
        <button
          type="button"
          className={statsItemStyle}
          onClick={() => navigate(ROUTES.myBadges)}
        >
          <span className={statsValueStyle}>{mockProfile.badges}</span>
          <span className={statsLabelStyle}>배지</span>
        </button>
      </div>

      <div className={infoRowStyle}>
        <span className={infoLabelStyle}>이메일</span>
        <span className={infoValueStyle}>{mockProfile.email}</span>
      </div>
      <div className={infoRowStyle}>
        <span className={infoLabelStyle}>가입일</span>
        <span className={infoValueStyle}>{mockProfile.joinedAt}</span>
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
