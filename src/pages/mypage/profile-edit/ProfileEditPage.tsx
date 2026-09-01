import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Pencil } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { TextField } from '@/components/ui/TextField/TextField'
import { Loading } from '@/components/ui/Loading/Loading'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { toast } from '@/components/ui/Toast/Toast'
import { useMyProfileQuery, useUpdateMyProfileMutation } from '@/features/auth/hooks'
import { ROUTES } from '@/constants'
import { ProfileAvatar } from '@/pages/mypage/components/ProfileAvatar/ProfileAvatar'
import {
  avatarWrapStyle,
  editBadgeStyle,
  emailReadonlyStyle,
  fieldGroupStyle,
  fieldLabelStyle,
  pageStyle,
  readonlyFieldStyle,
} from './ProfileEditPage.css.ts'

export function ProfileEditPage() {
  const navigate = useNavigate()
  const { data: profile, isPending, isError, refetch } = useMyProfileQuery()
  const updateProfile = useUpdateMyProfileMutation()

  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (!profile) return
    setNickname(profile.nickname)
    setBio(profile.bio ?? '')
  }, [profile])

  const handleSave = async () => {
    const trimmedNickname = nickname.trim()
    const trimmedBio = bio.trim()

    if (!trimmedNickname) {
      toast.error('닉네임을 입력해 주세요.')
      return
    }

    try {
      await updateProfile.mutateAsync({
        nickname: trimmedNickname,
        bio: trimmedBio,
      })
      toast.success('프로필이 저장되었어요.')
      navigate(ROUTES.myProfile)
    } catch {
      toast.error('프로필을 저장하지 못했어요.')
    }
  }

  if (isPending) {
    return (
      <div className={pageStyle}>
        <PageHeader title="프로필 수정" showBack onBack={() => navigate(ROUTES.myProfile)} />
        <Loading label="프로필 불러오는 중" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className={pageStyle}>
        <PageHeader title="프로필 수정" showBack onBack={() => navigate(ROUTES.myProfile)} />
        <ErrorState onRetry={() => void refetch()} />
      </div>
    )
  }

  return (
    <div className={pageStyle}>
      <PageHeader
        title="프로필 수정"
        showBack
        onBack={() => navigate(ROUTES.myProfile)}
        actions={[{ id: 'save', label: '저장', tone: 'primary', onPress: () => void handleSave() }]}
      />

      <div className={avatarWrapStyle}>
        <ProfileAvatar nickname={nickname || profile.nickname} imageUrl={profile.profileImageUrl} size="md" />
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
          <div className={readonlyFieldStyle}>{profile.email || '-'}</div>
          <p className={emailReadonlyStyle}>이메일은 변경할 수 없어요.</p>
        </div>
      </div>
    </div>
  )
}
