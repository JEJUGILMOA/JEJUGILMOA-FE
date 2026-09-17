/** 기록·프로필 등 이미지 첨부에서 허용하는 MIME / 확장자 */

export const IMAGE_FILE_ACCEPT =
  'image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'])

export const IMAGE_FILE_ACCEPT_HINT = 'JPG, PNG, WEBP, HEIC'

export function isAllowedImageFile(file: File): boolean {
  const mime = file.type.trim().toLowerCase()
  if (mime && ALLOWED_MIME_TYPES.has(mime)) return true

  // iOS 등에서 type이 비어 오는 경우가 있어 확장자로 한 번 더 본다
  const name = file.name.trim().toLowerCase()
  const dot = name.lastIndexOf('.')
  if (dot < 0) return false
  return ALLOWED_EXTENSIONS.has(name.slice(dot))
}

export function partitionImageFiles(files: File[]) {
  const accepted: File[] = []
  const rejected: File[] = []
  for (const file of files) {
    if (isAllowedImageFile(file)) accepted.push(file)
    else rejected.push(file)
  }
  return { accepted, rejected }
}
