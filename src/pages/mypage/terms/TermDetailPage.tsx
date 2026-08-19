import { useNavigate, useParams } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Empty } from '@/components/ui/Empty/Empty'
import { ROUTES } from '@/constants'
import { mockTerms } from '@/pages/mypage/data/mockMyPage'
import { bodyStyle, pageStyle, titleStyle } from './TermDetailPage.css.ts'

export function TermDetailPage() {
  const navigate = useNavigate()
  const { termId } = useParams()
  const term = mockTerms.find((item) => item.id === termId)

  if (!term) {
    return (
      <div className={pageStyle}>
        <PageHeader title="약관" showBack onBack={() => navigate(ROUTES.myTerms)} />
        <Empty title="약관을 찾을 수 없어요" />
      </div>
    )
  }

  return (
    <div className={pageStyle}>
      <PageHeader title={term.title} showBack onBack={() => navigate(ROUTES.myTerms)} />
      <h2 className={titleStyle}>{term.title}</h2>
      <p className={bodyStyle}>{term.body}</p>
    </div>
  )
}
