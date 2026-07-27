import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Pencil } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { TextField } from '@/components/ui/TextField/TextField'
import { toast } from '@/components/ui/Toast/Toast'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants'
import { ProfileAvatar } from '@/pages/mypage/components/ProfileAvatar/ProfileAvatar'
import { mockProfile } from '@/pages/mypage/data/mockMyPage'
import {
  avatarWrapStyle,
  editBadgeStyle,
  emailReadonlyStyle,
  fieldGroupStyle,
  fieldLabelStyle,
  pageStyle,
  readonlyFieldStyle,
  saveButtonStyle,
} from './ProfileEditPage.css.ts'

export function ProfileEditPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setAuth = useAuthStore((s) => s.setAuth)
  const accessToken = useAuthStore((s) => s.accessToken)

  const [nickname, setNickname] = useState(user?.nickname ?? mockProfile.nickname)
  const [bio, setBio] = useState(mockProfile.bio)

  const handleSave = () => {
    const trimmed = nickname.trim()
    if (!trimmed) {
      toast.error('닉네임을 입력해 주세요.')
      return
    }

    if (user && accessToken) {
      setAuth({
        accessToken,
        user: {
          ...user,
          nickname: trimmed,
        },
      })
    }

    toast.success('프로필이 저장되었어요.')
    navigate(ROUTES.myProfile)
  }

  return (
    <div className={pageStyle}>
      <PageHeader
        title="프로필 수정"
        showBack
        onBack={() => navigate(ROUTES.myProfile)}
        rightSlot={
          <button type="button" className={saveButtonStyle} onClick={handleSave}>
            저장
          </button>
        }
      />

      <div className={avatarWrapStyle}>
        <ProfileAvatar
          nickname={nickname || mockProfile.nickname}
          imageUrl={user?.profileImageUrl}
          size="md"
        />
        <button
          type="button"
          className={editBadgeStyle}
          aria-label="프로필 사진 변경"
          onClick={() => toast.info('사진 변경은 곧 지원될 예정이에요.')}
        >
          <Pencil size={12} strokeWidth={2} />
        </button>
      </div>

      <div className={fieldGroupStyle}>
        <TextField label="닉네임" value={nickname} onChange={setNickname} maxLength={20} />
        <TextField label="한줄 소개" value={bio} onChange={setBio} maxLength={40} />
        <div>
          <span className={fieldLabelStyle}>이메일</span>
          <div className={readonlyFieldStyle}>{mockProfile.email}</div>
          <p className={emailReadonlyStyle}>이메일은 변경할 수 없어요.</p>
        </div>
      </div>
    </div>
  )
}
