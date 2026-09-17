import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '@/api/error'
import { toast } from '@/components/ui/Toast/Toast'
import { QUERY_KEYS, ROUTES } from '@/constants'
import { promptLoginOnUnauthorized } from '@/features/auth/requireLogin'
import type { ExploreRecord } from '@/features/records/types'
import { useAuthStore } from '@/stores/authStore'
import { blockUser, fetchBlockedUsers, unblockUser, type BlockedUser } from './api'

export type BlockUserInput = {
  targetUserId: number
  authorName: string
}

export function useBlockedUsersQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.blockedUsers,
    queryFn: fetchBlockedUsers,
    enabled: isAuthenticated,
  })
}

/** POST /users/{targetUserId}/block — 차단 후 둘러보기에서 해당 작성자 기록을 즉시 숨긴다 */
export function useBlockUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ targetUserId }: BlockUserInput) => blockUser(targetUserId),
    onMutate: async ({ targetUserId, authorName }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.exploreRecords }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.blockedUsers }),
      ])
      const previousExplore = queryClient.getQueryData<ExploreRecord[]>(QUERY_KEYS.exploreRecords)
      const previousBlocked = queryClient.getQueryData<BlockedUser[]>(QUERY_KEYS.blockedUsers)

      if (previousExplore) {
        queryClient.setQueryData<ExploreRecord[]>(
          QUERY_KEYS.exploreRecords,
          previousExplore.filter((record) => record.authorId !== targetUserId),
        )
      }

      if (previousBlocked && !previousBlocked.some((user) => user.userId === targetUserId)) {
        queryClient.setQueryData<BlockedUser[]>(QUERY_KEYS.blockedUsers, [
          { userId: targetUserId, nickname: authorName, profileImageUrl: null },
          ...previousBlocked,
        ])
      }

      return { previousExplore, previousBlocked }
    },
    onError: (error, _input, context) => {
      if (context?.previousExplore) {
        queryClient.setQueryData(QUERY_KEYS.exploreRecords, context.previousExplore)
      }
      if (context?.previousBlocked) {
        queryClient.setQueryData(QUERY_KEYS.blockedUsers, context.previousBlocked)
      }
      if (
        promptLoginOnUnauthorized(error, {
          returnTo: ROUTES.recordTab('search'),
          description: '사용자를 차단하려면 로그인해 주세요.',
        })
      ) {
        return
      }
      toast.error(getErrorMessage(error, '사용자를 차단하지 못했어요. 다시 시도해 주세요.'))
    },
    onSuccess: (_data, { authorName }) => {
      toast.success(`${authorName} 님을 차단했어요.`)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blockedUsers })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blockedUsers })
    },
  })
}

export type UnblockUserInput = {
  targetUserId: number
  nickname: string
}

/** DELETE /users/{targetUserId}/block — 차단 해제 */
export function useUnblockUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ targetUserId }: UnblockUserInput) => unblockUser(targetUserId),
    onMutate: async ({ targetUserId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.blockedUsers })
      const previous = queryClient.getQueryData<BlockedUser[]>(QUERY_KEYS.blockedUsers)

      if (previous) {
        queryClient.setQueryData<BlockedUser[]>(
          QUERY_KEYS.blockedUsers,
          previous.filter((user) => user.userId !== targetUserId),
        )
      }

      return { previous }
    },
    onError: (error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.blockedUsers, context.previous)
      }
      toast.error(getErrorMessage(error, '차단을 해제하지 못했어요. 다시 시도해 주세요.'))
    },
    onSuccess: (_data, { nickname }) => {
      toast.success(`${nickname} 님 차단을 해제했어요.`)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blockedUsers })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
    },
  })
}
