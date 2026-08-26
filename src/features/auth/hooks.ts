import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { fetchMyProfile } from './api'
import { authStore, useAuthStore } from '@/stores/authStore'

export function useMyProfileQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const query = useQuery({
    queryKey: QUERY_KEYS.myProfile,
    queryFn: fetchMyProfile,
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (!query.data) return
    const current = authStore.getState().user
    authStore.getState().setUser({
      id: current?.id ?? query.data.email ?? query.data.nickname,
      nickname: query.data.nickname,
      profileImageUrl: query.data.profileImageUrl,
    })
  }, [query.data])

  return query
}
