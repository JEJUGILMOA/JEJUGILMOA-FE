import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Empty } from '@/components/ui/Empty/Empty'
import { ROUTES } from '@/constants'
import { mockNotices } from '@/pages/mypage/data/mockMyPage'
import { dateStyle, itemStyle, listStyle, pageStyle, titleStyle } from './NoticesPage.css.ts'

export function NoticesPage() {
  const navigate = useNavigate()

  return (
    <div className={pageStyle}>
      <PageHeader title="공지사항" showBack onBack={() => navigate(ROUTES.mySettings)} />

      {mockNotices.length === 0 ? (
        <Empty title="공지사항이 없어요" />
      ) : (
        <ul className={listStyle}>
          {mockNotices.map((notice) => (
            <li key={notice.id}>
              <button
                type="button"
                className={itemStyle}
                onClick={() =>
                  navigate(ROUTES.myNoticeDetail.replace(':noticeId', notice.id))
                }
              >
                <span className={titleStyle}>{notice.title}</span>
                <span className={dateStyle}>{notice.date}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
