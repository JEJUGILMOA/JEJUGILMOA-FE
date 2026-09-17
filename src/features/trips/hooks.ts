import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { pushCurrentTripToNative } from '@/features/map/pushCurrentTripToNative'
import { cancelTrip, fetchCurrentTrip, startTrip } from './api'

export function useCurrentTripQuery(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.currentTrip,
    queryFn: fetchCurrentTrip,
    enabled,
  })
}

export function useStartTripMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (planId: number) => startTrip(planId),
    onSuccess: async (trip, planId) => {
      // 지도 탭이 아직 마운트되지 않아도 바로 쓰도록 캐시에 심는다
      queryClient.setQueryData(QUERY_KEYS.currentTrip, trip)

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(String(planId)) })
      void queryClient.invalidateQueries({ queryKey: ['plans', 'summaries'] })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentTrip })

      // 네이티브 진행중 여행 시트는 react-query와 별도 — 응답을 즉시 밀어준다
      try {
        await pushCurrentTripToNative(trip)
      } catch {
        // 네이티브 푸시 실패해도 여행 시작 자체는 성공으로 둔다
      }
    },
  })
}

export function useCancelTripMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tripId: number) => cancelTrip(tripId),
    onSuccess: async (_data, tripId) => {
      queryClient.setQueryData(QUERY_KEYS.currentTrip, undefined)

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(String(tripId)) })
      void queryClient.invalidateQueries({ queryKey: ['plans', 'summaries'] })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentTrip })

      try {
        await pushCurrentTripToNative(null)
      } catch {
        // ignore
      }
    },
  })
}
