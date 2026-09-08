import { cn } from '@/utils/cn'
import { avatarImageStyle, avatarStyle, sizeRecipe } from './ProfileAvatar.css.ts'

/** public/assets 임시 프로필 (이미지 미설정 시) */
const FALLBACK_PROFILE_IMAGES = ['/assets/profile1.png', '/assets/profile2.png'] as const

export type ProfileAvatarProps = {
  nickname: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function pickFallbackImage(nickname: string) {
  let hash = 0
  for (let i = 0; i < nickname.length; i += 1) {
    hash = (hash + nickname.charCodeAt(i) * (i + 1)) % FALLBACK_PROFILE_IMAGES.length
  }
  return FALLBACK_PROFILE_IMAGES[hash] ?? FALLBACK_PROFILE_IMAGES[0]
}

export function ProfileAvatar({
  nickname,
  imageUrl,
  size = 'md',
  className,
}: ProfileAvatarProps) {
  const src = imageUrl?.trim() || pickFallbackImage(nickname)

  return (
    <div
      className={cn(avatarStyle, sizeRecipe({ size }), className)}
      aria-label={`${nickname} 프로필`}
      role="img"
    >
      <img className={avatarImageStyle} src={src} alt="" />
    </div>
  )
}
