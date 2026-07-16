import { Card } from '@/components/ui/Card/Card'
import { Button } from '@/components/ui/Button/Button'
import { useAuthStore } from '@/stores/authStore'

export function MyPage() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const setAuth = useAuthStore((s) => s.setAuth)

  return (
    <Card title="마이">
      {isAuthenticated && user ? (
        <>
          <p>{user.nickname}님, 안녕하세요.</p>
          <Button variant="ghost" onClick={clearAuth}>
            로그아웃
          </Button>
        </>
      ) : (
        <>
          <p>로그인이 필요합니다.</p>
          <Button
            onClick={() =>
              setAuth({
                accessToken: 'dev-token',
                user: { id: '1', nickname: '제주여행자' },
              })
            }
          >
            개발용 로그인
          </Button>
        </>
      )}
    </Card>
  )
}
