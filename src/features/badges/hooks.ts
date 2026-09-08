import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { useAuthStore } from '@/stores/authStore'
import { fetchMyBadges } from './api'

export function useMyBadgesQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.myBadges,
    queryFn: fetchMyBadges,
    enabled: isAuthenticated,
  })
}
