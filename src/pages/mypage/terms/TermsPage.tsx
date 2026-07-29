import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { ROUTES } from '@/constants'
import { mockTerms } from '@/pages/mypage/data/mockMyPage'
import { itemStyle, listStyle, pageStyle, titleStyle } from './TermsPage.css.ts'

export function TermsPage() {
  const navigate = useNavigate()

  return (
    <div className={pageStyle}>
      <PageHeader title="약관 및 정책" showBack onBack={() => navigate(ROUTES.mySettings)} />
      <ul className={listStyle}>
        {mockTerms.map((term) => (
          <li key={term.id}>
            <button
              type="button"
              className={itemStyle}
              onClick={() => navigate(ROUTES.myTermDetail.replace(':termId', term.id))}
            >
              <span className={titleStyle}>{term.title}</span>
              <span aria-hidden>›</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
