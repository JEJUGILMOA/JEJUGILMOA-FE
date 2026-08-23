import { useNavigate } from 'react-router'
import { BookOpen, ChevronRight, MapPin, Settings, Share2, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants'
import { MenuListItem } from '@/pages/mypage/components/MenuListItem/MenuListItem'
import { ProfileAvatar } from '@/pages/mypage/components/ProfileAvatar/ProfileAvatar'
import { mockProfile } from '@/pages/mypage/data/mockMyPage'
import {
  chevronStyle,
  emailStyle,
  menuListStyle,
  nameStyle,
  pageStyle,
  profileButtonStyle,
  profileMetaStyle,
  profileRowStyle,
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

  const nickname = user?.nickname ?? mockProfile.nickname
  const email = mockProfile.email
  const imageUrl = user?.profileImageUrl

  return (
    <div className={pageStyle}>
      <button
        type="button"
        className={profileButtonStyle}
        onClick={() => navigate(ROUTES.myProfile)}
        aria-label="프로필 보기"
      >
        <div className={profileRowStyle}>
          <ProfileAvatar nickname={nickname} imageUrl={imageUrl} size="md" />
          <div className={profileMetaStyle}>
            <span className={nameStyle}>{nickname}</span>
            <span className={emailStyle}>{email}</span>
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
