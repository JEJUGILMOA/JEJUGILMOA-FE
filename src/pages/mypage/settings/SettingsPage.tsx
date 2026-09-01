import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Modal } from '@/components/ui/Modal/Modal'
import { Loading } from '@/components/ui/Loading/Loading'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { toast } from '@/components/ui/Toast/Toast'
import { logoutAuth } from '@/features/auth/api'
import {
  useMySettingsQuery,
  useUpdateMySettingsMutation,
  useWithdrawMutation,
} from '@/features/auth/hooks'
import type { UserSettings } from '@/features/auth/schemas'
import { useAuthStore } from '@/stores/authStore'
import { QUERY_KEYS, ROUTES } from '@/constants'
import { cn } from '@/utils/cn'
import {
  dangerTextStyle,
  dividerStyle,
  linkValueStyle,
  pageStyle,
  sectionLabelStyle,
  settingLabelStyle,
  settingRowStyle,
  toggleStyle,
  toggleThumbStyle,
} from './SettingsPage.css.ts'

type NotiKey = 'all' | 'schedule' | 'marketing'

function toUiState(settings: UserSettings) {
  const notifyAll =
    settings.notifyPlanStart &&
    settings.notifyRecordWriting &&
    settings.notifyBadgeAcquired &&
    settings.notifyNextPlace &&
    settings.notifyPlaceArrival

  return {
    all: notifyAll,
    schedule: settings.notifyPlanStart,
    marketing: settings.notifyMarketing,
    location: settings.locationPermission,
  }
}

export function SettingsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const settingsQuery = useMySettingsQuery()
  const updateSettings = useUpdateMySettingsMutation()
  const withdrawMutation = useWithdrawMutation()

  const [noti, setNoti] = useState<Record<NotiKey, boolean>>({
    all: true,
    schedule: true,
    marketing: false,
  })
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  useEffect(() => {
    if (!settingsQuery.data) return
    const ui = toUiState(settingsQuery.data)
    setNoti({ all: ui.all, schedule: ui.schedule, marketing: ui.marketing })
    setLocationEnabled(ui.location)
  }, [settingsQuery.data])

  const patchSettings = async (patch: Partial<UserSettings>) => {
    try {
      await updateSettings.mutateAsync(patch)
    } catch {
      toast.error('설정을 저장하지 못했어요.')
    }
  }

  const toggle = async (key: NotiKey) => {
    if (!settingsQuery.data) return

    if (key === 'all') {
      const next = !noti.all
      setNoti({ all: next, schedule: next, marketing: next })
      await patchSettings({
        notifyPlanStart: next,
        notifyRecordWriting: next,
        notifyBadgeAcquired: next,
        notifyNextPlace: next,
        notifyPlaceArrival: next,
        notifyMarketing: next,
      })
      return
    }

    if (key === 'schedule') {
      const next = !noti.schedule
      setNoti((prev) => ({ ...prev, schedule: next }))
      await patchSettings({ notifyPlanStart: next })
      return
    }

    const next = !noti.marketing
    setNoti((prev) => ({ ...prev, marketing: next }))
    await patchSettings({ notifyMarketing: next })
  }

  const handleLocationToggle = async () => {
    const next = !locationEnabled
    setLocationEnabled(next)
    await patchSettings({ locationPermission: next })
  }

  const handleLogout = async () => {
    try {
      await logoutAuth()
    } catch {
      // 쿠키가 이미 만료된 경우에도 로컬 세션은 정리한다.
    } finally {
      clearAuth()
      void queryClient.removeQueries({ queryKey: QUERY_KEYS.myProfile })
      setLogoutOpen(false)
      toast.success('로그아웃되었어요.')
      navigate(ROUTES.login)
    }
  }

  const handleWithdraw = async () => {
    try {
      await withdrawMutation.mutateAsync()
      clearAuth()
      setWithdrawOpen(false)
      toast.success('회원 탈퇴가 완료되었어요.')
      navigate(ROUTES.my)
    } catch {
      toast.error('회원 탈퇴에 실패했어요.')
    }
  }

  if (settingsQuery.isLoading) {
    return (
      <div className={pageStyle}>
        <PageHeader title="설정" showBack onBack={() => navigate(ROUTES.my)} />
        <Loading label="설정 불러오는 중" />
      </div>
    )
  }

  if (settingsQuery.isError || !settingsQuery.data) {
    return (
      <div className={pageStyle}>
        <PageHeader title="설정" showBack onBack={() => navigate(ROUTES.my)} />
        <ErrorState onRetry={() => void settingsQuery.refetch()} />
      </div>
    )
  }

  return (
    <div className={pageStyle}>
      <PageHeader title="설정" showBack onBack={() => navigate(ROUTES.my)} />

      <p className={sectionLabelStyle}>알림</p>
      <div className={settingRowStyle}>
        <span className={settingLabelStyle}>전체 알림</span>
        <button
          type="button"
          role="switch"
          aria-checked={noti.all}
          className={toggleStyle({ on: noti.all })}
          onClick={() => void toggle('all')}
        >
          <span className={toggleThumbStyle({ on: noti.all })} />
        </button>
      </div>
      <div className={settingRowStyle}>
        <span className={settingLabelStyle}>여행 일정 알림</span>
        <button
          type="button"
          role="switch"
          aria-checked={noti.schedule}
          className={toggleStyle({ on: noti.schedule })}
          onClick={() => void toggle('schedule')}
        >
          <span className={toggleThumbStyle({ on: noti.schedule })} />
        </button>
      </div>
      <div className={settingRowStyle}>
        <span className={settingLabelStyle}>마케팅 알림</span>
        <button
          type="button"
          role="switch"
          aria-checked={noti.marketing}
          className={toggleStyle({ on: noti.marketing })}
          onClick={() => void toggle('marketing')}
        >
          <span className={toggleThumbStyle({ on: noti.marketing })} />
        </button>
      </div>

      <div className={dividerStyle}>
        <p className={sectionLabelStyle}>위치</p>
      </div>
      <div className={settingRowStyle}>
        <span className={settingLabelStyle}>위치 권한</span>
        <button
          type="button"
          role="switch"
          aria-checked={locationEnabled}
          className={toggleStyle({ on: locationEnabled })}
          onClick={() => void handleLocationToggle()}
        >
          <span className={toggleThumbStyle({ on: locationEnabled })} />
        </button>
      </div>

      <div className={dividerStyle}>
        <p className={sectionLabelStyle}>지원</p>
      </div>
      <button
        type="button"
        className={settingRowStyle}
        onClick={() => navigate(ROUTES.myNotices)}
      >
        <span className={settingLabelStyle}>공지사항</span>
        <span className={linkValueStyle}>›</span>
      </button>
      <button
        type="button"
        className={settingRowStyle}
        onClick={() => navigate(ROUTES.mySupport)}
      >
        <span className={settingLabelStyle}>고객센터</span>
        <span className={linkValueStyle}>›</span>
      </button>
      <button
        type="button"
        className={settingRowStyle}
        onClick={() => navigate(ROUTES.myTerms)}
      >
        <span className={settingLabelStyle}>약관 및 정책</span>
        <span className={linkValueStyle}>›</span>
      </button>

      <div className={dividerStyle}>
        <p className={sectionLabelStyle}>계정</p>
      </div>
      <button type="button" className={settingRowStyle} onClick={() => setLogoutOpen(true)}>
        <span className={settingLabelStyle}>로그아웃</span>
        <span className={linkValueStyle}>›</span>
      </button>
      <button type="button" className={settingRowStyle} onClick={() => setWithdrawOpen(true)}>
        <span className={cn(settingLabelStyle, dangerTextStyle)}>회원 탈퇴</span>
        <span className={linkValueStyle}>›</span>
      </button>

      <Modal
        open={logoutOpen}
        title="로그아웃 하시겠습니까?"
        description="다시 로그인하면 이어서 이용할 수 있어요."
        onClose={() => setLogoutOpen(false)}
        actions={[
          { label: '취소', onClick: () => setLogoutOpen(false), variant: 'ghost' },
          { label: '로그아웃', onClick: handleLogout },
        ]}
      />

      <Modal
        open={withdrawOpen}
        title="회원 탈퇴 하시겠습니까?"
        description="탈퇴 시 여행 기록과 즐겨찾기가 삭제되며 복구할 수 없어요."
        onClose={() => setWithdrawOpen(false)}
        actions={[
          { label: '취소', onClick: () => setWithdrawOpen(false), variant: 'ghost' },
          { label: '탈퇴하기', onClick: () => void handleWithdraw(), variant: 'danger' },
        ]}
      />
    </div>
  )
}
