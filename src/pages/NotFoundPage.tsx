import { Card } from '@/components/ui/Card/Card'
import { Button } from '@/components/ui/Button/Button'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/constants'
import { pageStyle } from './NotFoundPage.css.ts'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={pageStyle}>
      <Card title="페이지를 찾을 수 없어요">
        <p>요청하신 주소가 존재하지 않습니다.</p>
        <Button onClick={() => navigate(ROUTES.home)}>홈으로 이동</Button>
      </Card>
    </div>
  )
}
