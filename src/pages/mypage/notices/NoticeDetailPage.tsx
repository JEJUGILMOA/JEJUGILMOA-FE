import { useNavigate, useParams } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Empty } from '@/components/ui/Empty/Empty'
import { ROUTES } from '@/constants'
import { mockNotices } from '@/pages/mypage/data/mockMyPage'
import { bodyStyle, dateStyle, pageStyle, titleStyle } from './NoticeDetailPage.css.ts'

export function NoticeDetailPage() {
  const navigate = useNavigate()
  const { noticeId } = useParams()
  const notice = mockNotices.find((item) => item.id === noticeId)

  if (!notice) {
    return (
      <div className={pageStyle}>
        <PageHeader title="공지사항" showBack onBack={() => navigate(ROUTES.myNotices)} />
        <Empty title="공지를 찾을 수 없어요" />
      </div>
    )
  }

  return (
    <div className={pageStyle}>
      <PageHeader title="공지사항" showBack onBack={() => navigate(ROUTES.myNotices)} />
      <h2 className={titleStyle}>{notice.title}</h2>
      <p className={dateStyle}>{notice.date}</p>
      <p className={bodyStyle}>{notice.body}</p>
    </div>
  )
}
