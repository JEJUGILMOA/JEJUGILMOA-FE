import { cn } from '@/utils/cn'
import { avatarImageStyle, avatarStyle, sizeRecipe } from './ProfileAvatar.css.ts'

export type ProfileAvatarProps = {
  nickname: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProfileAvatar({
  nickname,
  imageUrl,
  size = 'md',
  className,
}: ProfileAvatarProps) {
  return (
    <div
      className={cn(avatarStyle, sizeRecipe({ size }), className)}
      aria-label={`${nickname} 프로필`}
      role="img"
    >
      {imageUrl ? <img className={avatarImageStyle} src={imageUrl} alt="" /> : null}
    </div>
  )
}
