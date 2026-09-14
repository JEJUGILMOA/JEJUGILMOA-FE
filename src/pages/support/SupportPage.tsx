import {
  descStyle,
  emailLinkStyle,
  emailStyle,
  pageStyle,
  sectionStyle,
  titleStyle,
} from './SupportPage.css.ts'

const SUPPORT_EMAIL = 'jskim6335@naver.com'

/** 공개 고객센터 — 로그인·마이 탭과 무관한 독립 페이지 */
export function SupportPage() {
  return (
    <div className={pageStyle}>
      <section className={sectionStyle}>
        <h2 className={titleStyle}>고객센터</h2>
        <p className={descStyle}>
          서비스 이용 중 문제가 있거나 개선이 필요한 점이 있다면 아래 이메일로 연락해 주세요.
        </p>
        <p className={descStyle}>확인 후 빠르게 답변드리겠습니다.</p>
        <a className={emailLinkStyle} href={`mailto:${SUPPORT_EMAIL}`}>
          <span className={emailStyle}>{SUPPORT_EMAIL}</span>
        </a>
      </section>
    </div>
  )
}
