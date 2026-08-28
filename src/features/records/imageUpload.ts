import { apiPost } from '@/api/http'
import type { ImageUploadResponse } from './types'

/** 이미지 하나당 S3 presigned PUT URL을 발급받는다 */
function requestImageUploadUrl(file: File): Promise<ImageUploadResponse> {
  return apiPost<ImageUploadResponse>('/image-uploads', {
    contentType: file.type,
    fileSize: file.size,
  })
}

/**
 * 발급받은 presigned URL로 S3에 직접 PUT 업로드.
 * S3는 우리 서버가 아닌 별도 origin이라, axios 인터셉터가 붙이는 서비스 Authorization
 * 헤더가 들어가면 안 된다 — 그래서 apiClient가 아니라 순수 `fetch`를 쓴다.
 */
async function uploadFileToS3(
  uploadUrl: string,
  file: File,
  requiredHeaders: Record<string, string>,
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: requiredHeaders,
    body: file,
  })
  if (!response.ok) {
    throw new Error(`이미지 업로드에 실패했습니다 (${response.status})`)
  }
}

/** presigned URL 발급 → S3 업로드까지 마치고 기록 생성/수정 API에 보낼 objectKey를 반환한다 */
export async function uploadImageAndGetObjectKey(file: File): Promise<string> {
  const { uploadUrl, objectKey, requiredHeaders } = await requestImageUploadUrl(file)
  await uploadFileToS3(uploadUrl, file, requiredHeaders)
  return objectKey
}
