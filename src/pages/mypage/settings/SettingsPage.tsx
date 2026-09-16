import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Modal } from '@/components/ui/Modal/Modal'
import { toast } from '@/components/ui/Toast/Toast'
import { nativeBridge } from '@/bridge/nativeBridge'
import { logoutAuth } from '@/features/auth/api'
import { clearClientAuthSession } from '@/features/auth/clearClientSession'
import {
  useMySettingsQuery,
  useUpdateMySettingsMutation,
  useWithdrawMutation,
} from '@/features/auth/hooks'
import type { UserSettings } from '@/features/auth/schemas'
import { useAuthStore } from '@/stores/authStore'
import { EXTERNAL_PRIVACY_POLICY_URL, EXTERNAL_SUPPORT_URL, ROUTES } from '@/constants'
import { cn } from '@/utils/cn'
import {
  dangerTextStyle,
  dividerStyle,
  linkValueStyle,
  pageStyle,
  sectionLabelButtonStyle,
  sectionLabelStyle,
  settingLabelStyle,
  settingRowStyle,
  togglePlaceholderStyle,
  toggleStyle,
  toggleThumbStyle,
} from './SettingsPage.css.ts'

type NotiKey = 'all' | 'schedule' | 'marketing'

const DEV_UNLOCK_TAPS = 7
const DEV_UNLOCK_WINDOW_MS = 2500

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

function SettingToggle({
  checked,
  ready,
  onClick,
}: {
  checked: boolean
  ready: boolean
  onClick: () => void
}) {
  if (!ready) {
    return <span className={togglePlaceholderStyle} aria-hidden />
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={toggleStyle({ on: checked })}
      onClick={onClick}
    >
      <span className={toggleThumbStyle({ on: checked })} />
    </button>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const settingsQuery = useMySettingsQuery()
  const updateSettings = useUpdateMySettingsMutation()
  const withdrawMutation = useWithdrawMutation()

  const [logoutOpen, setLogoutOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const locationTapRef = useRef({ count: 0, lastAt: 0 })

  const settings = settingsQuery.data
  const ui = settings ? toUiState(settings) : null
  const togglesReady = Boolean(ui)

  const patchSettings = async (patch: Partial<UserSettings>) => {
    try {
      await updateSettings.mutateAsync(patch)
    } catch {
      toast.error('설정을 저장하지 못했어요.')
    }
  }

  const toggle = async (key: NotiKey) => {
    if (!settings || !ui) return

    if (key === 'all') {
      const next = !ui.all
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
      await patchSettings({ notifyPlanStart: !ui.schedule })
      return
    }

    await patchSettings({ notifyMarketing: !ui.marketing })
  }

  const handleLocationToggle = async () => {
    if (!settings || !ui) return
    await patchSettings({ locationPermission: !ui.location })
  }

  /** 설정 > 「위치」 섹션 라벨 7회 연속 탭 → 네이티브 방문 인증 시뮬레이션 토글 */
  const handleLocationSectionTap = () => {
    const now = Date.now()
    if (now - locationTapRef.current.lastAt > DEV_UNLOCK_WINDOW_MS) {
      locationTapRef.current.count = 0
    }
    locationTapRef.current.lastAt = now
    locationTapRef.current.count += 1

    if (locationTapRef.current.count < DEV_UNLOCK_TAPS) return

    locationTapRef.current.count = 0
    if (!nativeBridge.isNativeWebView()) {
      toast.info('앱에서만 사용할 수 있어요.')
      return
    }
    nativeBridge.postToNative({ type: 'TOGGLE_TRIP_VISIT_SPOOF' })
  }

  const handleLogout = async () => {
    setLogoutOpen(false)
    try {
      await logoutAuth()
    } catch {
      // 쿠키가 이미 만료된 경우에도 로컬 세션은 정리한다.
    } finally {
      clearClientAuthSession()
      clearAuth()
    }

    if (nativeBridge.isNativeWebView()) {
      nativeBridge.postToNative({ type: 'LOGOUT' })
      return
    }

    toast.success('로그아웃되었어요.')
    navigate(ROUTES.login, { replace: true })
  }

  const handleWithdraw = async () => {
    try {
      await withdrawMutation.mutateAsync()
      setWithdrawOpen(false)
      clearClientAuthSession()
      clearAuth()
      toast.success('회원 탈퇴가 완료되었어요.')

      // 탈퇴 토스트를 보여 준 뒤 로그인 화면으로 이동 (네이티브 LOGOUT 토스트와 겹치지 않게)
      window.setTimeout(() => {
        if (nativeBridge.isNativeWebView()) {
          nativeBridge.postToNative({ type: 'LOGOUT' })
          return
        }
        navigate(ROUTES.login, { replace: true })
      }, 1500)
    } catch {
      toast.error('회원 탈퇴에 실패했어요.')
    }
  }

  const openExternalUrl = (url: string) => {
    if (nativeBridge.isNativeWebView()) {
      nativeBridge.postToNative({
        type: 'OPEN_EXTERNAL_URL',
        url,
      })
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const openPrivacyPolicy = () => openExternalUrl(EXTERNAL_PRIVACY_POLICY_URL)
  const openSupport = () => openExternalUrl(EXTERNAL_SUPPORT_URL)

  return (
    <div className={pageStyle}>
      <PageHeader title="설정" showBack onBack={() => navigate(ROUTES.my)} />

      <p className={sectionLabelStyle}>알림</p>
      <div className={settingRowStyle}>
        <span className={settingLabelStyle}>전체 알림</span>
        <SettingToggle
          checked={ui?.all ?? false}
          ready={togglesReady}
          onClick={() => void toggle('all')}
        />
      </div>
      <div className={settingRowStyle}>
        <span className={settingLabelStyle}>여행 일정 알림</span>
        <SettingToggle
          checked={ui?.schedule ?? false}
          ready={togglesReady}
          onClick={() => void toggle('schedule')}
        />
      </div>
      <div className={settingRowStyle}>
        <span className={settingLabelStyle}>마케팅 알림</span>
        <SettingToggle
          checked={ui?.marketing ?? false}
          ready={togglesReady}
          onClick={() => void toggle('marketing')}
        />
      </div>

      <div className={dividerStyle}>
        <button
          type="button"
          className={sectionLabelButtonStyle}
          onClick={handleLocationSectionTap}
          aria-label="위치"
        >
          위치
        </button>
      </div>
      <div className={settingRowStyle}>
        <span className={settingLabelStyle}>위치 권한</span>
        <SettingToggle
          checked={ui?.location ?? false}
          ready={togglesReady}
          onClick={() => void handleLocationToggle()}
        />
      </div>

      <div className={dividerStyle}>
        <p className={sectionLabelStyle}>지원</p>
      </div>
      <button type="button" className={settingRowStyle} onClick={openSupport}>
        <span className={settingLabelStyle}>고객센터</span>
        <span className={linkValueStyle}>›</span>
      </button>
      <button type="button" className={settingRowStyle} onClick={openPrivacyPolicy}>
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
          { label: '로그아웃', onClick: () => void handleLogout() },
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
