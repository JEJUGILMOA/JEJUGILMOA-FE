import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Button } from '@/components/ui/Button/Button'
import { ROUTES } from '@/constants'
import {
  descStyle,
  pageStyle,
  sectionStyle,
  titleStyle,
} from './SupportPage.css.ts'

export function SupportPage() {
  const navigate = useNavigate()

  return (
    <div className={pageStyle}>
      <PageHeader title="고객센터" showBack onBack={() => navigate(ROUTES.mySettings)} />

      <section className={sectionStyle}>
        <h2 className={titleStyle}>무엇을 도와드릴까요?</h2>
        <p className={descStyle}>이용 중 불편한 점이 있다면 문의를 남겨 주세요.</p>
        <Button fullWidth onClick={() => navigate(ROUTES.mySupportInquiry)}>
          문의하기
        </Button>
      </section>
    </div>
  )
}
