import { apiDelete, apiGet, apiPost } from '@/api/http'

function toUserIdNumber(userId: string | number) {
  const value = typeof userId === 'number' ? userId : Number(userId)
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('유효하지 않은 사용자 ID예요.')
  }
  return value
}

/** POST /users/{targetUserId}/block — 사용자 차단 */
export async function blockUser(targetUserId: string | number): Promise<void> {
  await apiPost<void>(`/users/${toUserIdNumber(targetUserId)}/block`)
}

/** DELETE /users/{targetUserId}/block — 사용자 차단 해제 */
export async function unblockUser(targetUserId: string | number): Promise<void> {
  await apiDelete<void>(`/users/${toUserIdNumber(targetUserId)}/block`)
}

export type BlockedUser = {
  userId: number
  nickname: string
  profileImageUrl: string | null
}

/** GET /users/blocks — 차단 목록 조회 */
export async function fetchBlockedUsers(): Promise<BlockedUser[]> {
  const data = await apiGet<BlockedUser[]>('/users/blocks')
  return data ?? []
}
