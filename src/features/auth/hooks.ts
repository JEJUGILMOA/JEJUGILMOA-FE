import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import {
  fetchMyProfile,
  fetchMySettings,
  loginWithDevAuth,
  updateMyProfile,
  updateMySettings,
  withdrawMyAccount,
} from './api'
import type { UserSettingsUpdate, UserUpdateRequest } from './schemas'
import { applyDevLoginResult } from './session'
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

export function useMySettingsQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.mySettings,
    queryFn: fetchMySettings,
    enabled: isAuthenticated,
  })
}

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UserUpdateRequest) => updateMyProfile(body),
    onSuccess: (profile) => {
      queryClient.setQueryData(QUERY_KEYS.myProfile, profile)
      const current = authStore.getState().user
      if (current) {
        authStore.getState().setUser({
          ...current,
          nickname: profile.nickname,
          profileImageUrl: profile.profileImageUrl,
        })
      }
    },
  })
}

export function useUpdateMySettingsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UserSettingsUpdate) => updateMySettings(body),
    onSuccess: (settings) => {
      queryClient.setQueryData(QUERY_KEYS.mySettings, settings)
    },
  })
}

export function useWithdrawMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: withdrawMyAccount,
    onSuccess: () => {
      void queryClient.clear()
    },
  })
}

const DEV_LOGIN_EMAIL = 'user@example.com'

export function useDevLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => loginWithDevAuth(DEV_LOGIN_EMAIL),
    onSuccess: (result) => {
      applyDevLoginResult(result)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myProfile })
    },
  })
}
