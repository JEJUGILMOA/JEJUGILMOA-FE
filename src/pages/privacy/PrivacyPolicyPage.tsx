import type { ReactNode } from 'react'
import {
  dividerStyle,
  docTitleStyle,
  effectiveDateStyle,
  leadStyle,
  listStyle,
  noteStyle,
  pageStyle,
  paragraphStyle,
  sectionStyle,
  sectionTitleStyle,
  strongInlineStyle,
  subsectionTitleStyle,
  tableStyle,
  tableWrapStyle,
  tdStyle,
  thStyle,
} from './PrivacyPolicyPage.css.ts'

const EFFECTIVE_DATE = '2026년 9월 14일'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={sectionStyle}>
      <h2 className={sectionTitleStyle}>{title}</h2>
      {children}
    </section>
  )
}

function P({ children }: { children: ReactNode }) {
  return <p className={paragraphStyle}>{children}</p>
}

function Strong({ children }: { children: ReactNode }) {
  return <strong className={strongInlineStyle}>{children}</strong>
}

/** 공개 개인정보처리방침 — 로그인·마이 탭과 무관한 독립 페이지 */
export function PrivacyPolicyPage() {
  return (
    <div className={pageStyle}>
      <h1 className={docTitleStyle}>개인정보처리방침</h1>
      <p className={leadStyle}>
        제주길모아(이하 “서비스”)는 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」 등 관련
        법령을 준수하고 있습니다.
      </p>
      <p className={leadStyle}>
        서비스는 이용자의 개인정보가 어떠한 목적으로 처리되고 어떻게 관리되는지 알기 쉽게 안내하기
        위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
      </p>
      <p className={effectiveDateStyle}>시행일자: {EFFECTIVE_DATE}</p>
      <hr className={dividerStyle} />

      <Section title="제1조 개인정보의 처리 목적, 처리 항목 및 법적 근거">
        <P>서비스는 다음의 목적을 위하여 필요한 범위에서 개인정보를 처리합니다.</P>
        <P>
          서비스 제공을 위한 계약의 체결 및 이행에 필요한 개인정보는 관련 법령에 근거하여 처리하며,
          별도의 동의가 필요한 개인정보는 이용자의 동의를 받은 후 처리합니다.
        </P>
        <div className={tableWrapStyle}>
          <table className={tableStyle}>
            <thead>
              <tr>
                <th className={thStyle}>처리 목적</th>
                <th className={thStyle}>처리하는 개인정보</th>
                <th className={thStyle}>처리 근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdStyle}>회원 가입 및 관리</td>
                <td className={tdStyle}>
                  소셜 로그인 제공자, 소셜 계정 식별정보, 이메일, 닉네임, 프로필 이미지, 회원
                  식별정보, 가입일시
                </td>
                <td className={tdStyle}>서비스 이용계약의 체결 및 이행</td>
              </tr>
              <tr>
                <td className={tdStyle}>프로필 관리</td>
                <td className={tdStyle}>닉네임, 프로필 이미지, 자기소개</td>
                <td className={tdStyle}>서비스 이용계약의 체결 및 이행</td>
              </tr>
              <tr>
                <td className={tdStyle}>여행 계획 생성 및 관리</td>
                <td className={tdStyle}>
                  여행 제목, 여행 일정, 동행 유형, 관심 카테고리, 출발지 및 출발지 좌표, 방문 예정
                  장소, 여행 예산, 여행 진행 상태
                </td>
                <td className={tdStyle}>서비스 이용계약의 체결 및 이행</td>
              </tr>
              <tr>
                <td className={tdStyle}>위치 기반 방문 인증</td>
                <td className={tdStyle}>현재 위치정보(위도·경도), 방문 인증 대상 장소, 방문 인증 시각</td>
                <td className={tdStyle}>위치기반서비스 제공을 위한 이용자의 동의 및 관련 법령</td>
              </tr>
              <tr>
                <td className={tdStyle}>여행 기록 제공</td>
                <td className={tdStyle}>
                  여행 기록 제목·내용, 장소별 메모, 방문 장소·일시, 업로드 이미지, 공개 여부
                </td>
                <td className={tdStyle}>서비스 이용계약의 체결 및 이행</td>
              </tr>
              <tr>
                <td className={tdStyle}>개인화 기능 제공</td>
                <td className={tdStyle}>즐겨찾기, 저장한 코스, 배지 획득내역, 여행 기록 반응정보</td>
                <td className={tdStyle}>서비스 이용계약의 체결 및 이행</td>
              </tr>
              <tr>
                <td className={tdStyle}>푸시 알림 제공</td>
                <td className={tdStyle}>FCM 디바이스 토큰, 알림 설정정보</td>
                <td className={tdStyle}>서비스 기능 제공 및 이용자의 알림 설정</td>
              </tr>
              <tr>
                <td className={tdStyle}>회원 탈퇴 및 복구</td>
                <td className={tdStyle}>회원 식별정보, 탈퇴일시, 익명화일시</td>
                <td className={tdStyle}>서비스 이용계약 종료 처리 및 계정 복구</td>
              </tr>
            </tbody>
          </table>
        </div>
        <P>서비스는 위 목적에 필요한 범위를 초과하여 개인정보를 이용하지 않습니다.</P>
        <P>처리 목적이 변경되는 경우에는 관련 법령에 따라 필요한 조치를 취합니다.</P>
      </Section>

      <Section title="제2조 소셜 로그인 시 처리하는 개인정보">
        <P>서비스는 다음의 소셜 로그인 서비스를 지원합니다.</P>
        <ul className={listStyle}>
          <li>Google</li>
          <li>Kakao</li>
          <li>Naver</li>
          <li>Apple</li>
        </ul>
        <P>
          소셜 로그인 과정에서 각 서비스 제공자로부터 이용자가 해당 제공자에게 제공하고 제공에
          동의한 범위 내의 정보를 전달받습니다.
        </P>
        <P>서비스에서는 회원 식별 및 계정 관리를 위하여 다음 정보를 저장할 수 있습니다.</P>
        <ul className={listStyle}>
          <li>소셜 로그인 제공자</li>
          <li>소셜 계정 고유 식별정보</li>
          <li>이메일 주소</li>
          <li>닉네임</li>
          <li>프로필 이미지 URL</li>
        </ul>
        <P>
          또한 서비스 이용 과정에서 이용자가 직접 입력한 자기소개 등의 프로필 정보가 추가로 저장될 수
          있습니다.
        </P>
        <P>
          서비스는 소셜 로그인 제공자로부터 서비스 제공에 필요하지 않은 개인정보를 임의로 수집하지
          않습니다.
        </P>
      </Section>

      <Section title="제3조 위치정보의 처리">
        <P>
          서비스는 제주 여행 중 현재 위치 확인 및 관광지 방문 인증 기능을 제공하기 위하여 필요한
          경우 이용자의 위치정보를 처리합니다.
        </P>
        <h3 className={subsectionTitleStyle}>1. 위치정보 이용 목적</h3>
        <P>위치정보는 다음 목적으로 이용됩니다.</P>
        <ul className={listStyle}>
          <li>이용자의 현재 위치 확인</li>
          <li>방문 예정 관광지와 현재 위치 간 거리 확인</li>
          <li>관광지 방문 인증</li>
          <li>방문 인증에 따른 배지 지급</li>
          <li>기타 이용자가 요청한 위치기반 여행 기능 제공</li>
        </ul>
        <h3 className={subsectionTitleStyle}>2. 방문 인증 시 위치정보 처리</h3>
        <P>
          이용자가 방문 인증 기능을 실행하면 기기의 위치 권한을 이용하여 현재 위치를 확인합니다.
        </P>
        <P>방문 인증 과정에서 다음 정보가 서버로 전달됩니다.</P>
        <ul className={listStyle}>
          <li>현재 위도</li>
          <li>현재 경도</li>
          <li>방문 인증 대상 장소</li>
        </ul>
        <P>
          서버는 전달받은 현재 위치와 방문 대상 장소의 위치를 비교하여 이용자가 해당 장소로부터{' '}
          <Strong>100m 이내에 있는지 확인</Strong>합니다.
        </P>
        <P>
          방문 인증을 위해 전달된 <Strong>현재 위도·경도는 거리 검증에만 사용하며 데이터베이스에
          저장하지 않습니다.</Strong>
        </P>
        <P>거리 검증이 완료된 후 현재 위치 좌표 자체를 별도로 보관하지 않습니다.</P>
        <P>
          서비스는 방문 인증을 위하여 이용자의 위치를 지속적으로 추적하거나 이동경로를 저장하지
          않으며, 별도의 백그라운드 상시 위치 추적을 기본적으로 수행하지 않습니다.
        </P>
        <h3 className={subsectionTitleStyle}>3. 위치정보 이용기록</h3>
        <P>서비스는 위치정보 이용 사실을 관리하기 위하여 다음 정보를 기록합니다.</P>
        <ul className={listStyle}>
          <li>사용자 식별번호</li>
          <li>위치정보 취득 경로</li>
          <li>위치정보 이용 서비스</li>
          <li>위치정보 제공 대상</li>
          <li>위치정보 이용 시각</li>
        </ul>
        <P>위 기록에는 이용자의 실제 위도·경도 좌표가 포함되지 않습니다.</P>
        <P>
          위치정보 이용기록은 <Strong>1년간 보관한 후 삭제</Strong>합니다.
        </P>
      </Section>

      <Section title="제4조 개인정보의 처리 및 보유기간">
        <P>서비스는 개인정보 처리 목적을 달성하는 데 필요한 기간 동안 개인정보를 보유합니다.</P>
        <P>회원 탈퇴 시 개인정보는 다음과 같이 처리됩니다.</P>
        <div className={tableWrapStyle}>
          <table className={tableStyle}>
            <thead>
              <tr>
                <th className={thStyle}>개인정보 또는 데이터</th>
                <th className={thStyle}>보유기간 및 처리방법</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdStyle}>회원정보</td>
                <td className={tdStyle}>탈퇴 후 30일간 계정 복구를 위해 보관한 후 식별정보 익명화</td>
              </tr>
              <tr>
                <td className={tdStyle}>여행계획</td>
                <td className={tdStyle}>회원정보 익명화 후에도 서비스 데이터로 유지될 수 있음</td>
              </tr>
              <tr>
                <td className={tdStyle}>여행기록</td>
                <td className={tdStyle}>회원정보 익명화 후에도 기록 데이터로 유지될 수 있음</td>
              </tr>
              <tr>
                <td className={tdStyle}>즐겨찾기·저장한 코스</td>
                <td className={tdStyle}>회원정보 익명화 후에도 서비스 데이터로 유지될 수 있음</td>
              </tr>
              <tr>
                <td className={tdStyle}>배지 획득정보</td>
                <td className={tdStyle}>회원정보 익명화 후에도 서비스 데이터로 유지될 수 있음</td>
              </tr>
              <tr>
                <td className={tdStyle}>업로드 이미지</td>
                <td className={tdStyle}>
                  별도의 삭제 요청 또는 서비스의 삭제 정책이 적용될 때까지 보관될 수 있음
                </td>
              </tr>
              <tr>
                <td className={tdStyle}>FCM 디바이스 토큰</td>
                <td className={tdStyle}>
                  푸시 알림 제공을 위하여 서버에 저장되며, 현재 회원 탈퇴 시 자동 삭제되지 않음
                </td>
              </tr>
              <tr>
                <td className={tdStyle}>방문 인증에 사용된 현재 위도·경도</td>
                <td className={tdStyle}>거리 검증 후 저장하지 않음</td>
              </tr>
              <tr>
                <td className={tdStyle}>위치정보 이용기록</td>
                <td className={tdStyle}>1년</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className={subsectionTitleStyle}>1. 회원 탈퇴 후 30일</h3>
        <P>회원 탈퇴가 요청되면 탈퇴 시각을 기록하고 해당 계정을 탈퇴 상태로 변경합니다.</P>
        <P>회원 탈퇴와 동시에 로그인 유지에 사용되는 Refresh Token은 폐기됩니다.</P>
        <P>
          서비스는 이용자의 계정 복구 요청에 대응하기 위하여{' '}
          <Strong>탈퇴일로부터 30일 동안 회원정보 및 계정에 연결된 데이터를 유지</Strong>합니다.
        </P>
        <P>해당 기간에는 이용자의 요청에 따라 계정을 복구할 수 있습니다.</P>
        <h3 className={subsectionTitleStyle}>2. 탈퇴 후 30일 경과 시</h3>
        <P>
          탈퇴일로부터 30일이 경과하면 이용자를 직접 식별할 수 있는 회원정보를 다음과 같이
          처리합니다.
        </P>
        <ul className={listStyle}>
          <li>소셜 로그인 제공자 정보 → 삭제</li>
          <li>소셜 계정 고유 식별정보 → 삭제</li>
          <li>이메일 주소 → 삭제</li>
          <li>프로필 이미지 URL → 삭제</li>
          <li>자기소개 → 삭제</li>
          <li>닉네임 → “탈퇴한 사용자”로 변경</li>
          <li>익명화 완료시각 → 기록</li>
        </ul>
        <P>
          회원 데이터 행 자체는 서비스 데이터의 관계 유지를 위하여 남을 수 있으나, 위와 같이
          이용자를 직접 식별할 수 있는 개인정보를 제거합니다.
        </P>
        <h3 className={subsectionTitleStyle}>3. 익명화 이후 서비스 데이터</h3>
        <P>
          여행계획, 여행기록, 즐겨찾기, 저장한 코스, 배지 획득내역 등 일부 서비스 데이터는
          회원정보가 익명화된 이후에도 유지될 수 있습니다.
        </P>
        <P>이 경우 해당 데이터를 탈퇴한 이용자를 직접 식별하기 위한 목적으로 이용하지 않습니다.</P>
      </Section>

      <Section title="제5조 이용자가 업로드한 이미지의 처리">
        <P>이용자가 여행 기록 및 프로필 등의 기능을 이용하면서 직접 이미지를 업로드할 수 있습니다.</P>
        <P>업로드된 이미지는 서비스 제공을 위하여 외부 클라우드 저장소에 저장됩니다.</P>
        <P>현재 서비스의 이미지 저장 환경은 다음과 같습니다.</P>
        <ul className={listStyle}>
          <li>저장 서비스: Amazon S3</li>
          <li>리전: 대한민국 서울(ap-northeast-2)</li>
          <li>이미지 최대 크기: 10MB</li>
          <li>업로드용 Presigned URL 유효시간: 10분</li>
        </ul>
        <P>
          현재 별도의 S3 자동 삭제 Lifecycle 정책이 설정되어 있지 않으므로 이용자가 업로드한
          이미지는 별도의 삭제 처리가 이루어질 때까지 저장될 수 있습니다.
        </P>
        <P>
          서비스는 향후 이미지 보관 및 삭제 정책이 변경되는 경우 본 개인정보처리방침에 해당 내용을
          반영합니다.
        </P>
      </Section>

      <Section title="제6조 개인정보의 파기 및 익명화">
        <P>
          서비스는 개인정보 보유기간이 경과하거나 개인정보 처리 목적이 달성되어 해당 개인정보가 더
          이상 필요하지 않은 경우 관련 법령 및 서비스의 보유정책에 따라 삭제 또는 익명화합니다.
        </P>
        <P>회원 탈퇴 시 처리 절차는 다음과 같습니다.</P>
        <P>
          <Strong>
            회원 탈퇴 신청 → 계정 탈퇴 처리 및 Refresh Token 폐기 → 30일간 계정 복구 가능 → 30일
            경과 → 회원 식별정보 익명화
          </Strong>
        </P>
        <P>
          전자적 형태로 저장된 개인정보를 삭제하는 경우 해당 정보를 복구 또는 재생하기 어렵도록
          처리합니다.
        </P>
        <P>
          서비스 운영상 유지되는 데이터의 경우 이용자를 직접 식별할 수 있는 회원정보를 제거한
          상태로 보존할 수 있습니다.
        </P>
      </Section>

      <Section title="제7조 개인정보의 제3자 제공">
        <P>서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.</P>
        <P>
          다만 다음의 경우에는 관련 법령에서 허용하는 범위에서 개인정보를 제공할 수 있습니다.
        </P>
        <ol className={listStyle}>
          <li>이용자가 개인정보 제공에 별도로 동의한 경우</li>
          <li>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 필요한 경우</li>
        </ol>
        <P>
          서비스가 이용자의 개인정보를 제3자에게 제공하는 경우 관련 법령에 따라 제공받는 자, 제공
          목적, 제공하는 개인정보 항목 및 보유·이용기간 등을 이용자에게 안내합니다.
        </P>
      </Section>

      <Section title="제8조 개인정보 처리업무의 위탁 및 외부 서비스 이용">
        <P>서비스는 원활한 서비스 제공을 위하여 외부 서비스를 이용할 수 있습니다.</P>
        <div className={tableWrapStyle}>
          <table className={tableStyle}>
            <thead>
              <tr>
                <th className={thStyle}>업체 또는 서비스</th>
                <th className={thStyle}>이용 목적</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdStyle}>Amazon Web Services, Inc.</td>
                <td className={tdStyle}>서비스 인프라 운영 및 이미지 저장</td>
              </tr>
              <tr>
                <td className={tdStyle}>Google Firebase Cloud Messaging</td>
                <td className={tdStyle}>모바일 푸시 알림 발송</td>
              </tr>
              <tr>
                <td className={tdStyle}>Google</td>
                <td className={tdStyle}>Google 계정 로그인 및 인증</td>
              </tr>
              <tr>
                <td className={tdStyle}>Kakao</td>
                <td className={tdStyle}>Kakao 계정 로그인 및 인증</td>
              </tr>
              <tr>
                <td className={tdStyle}>Naver</td>
                <td className={tdStyle}>Naver 계정 로그인 및 인증</td>
              </tr>
              <tr>
                <td className={tdStyle}>Apple</td>
                <td className={tdStyle}>Apple 계정 로그인 및 인증</td>
              </tr>
            </tbody>
          </table>
        </div>
        <P>
          서비스는 개인정보 처리업무를 위탁하는 경우 관련 법령에 따라 개인정보가 안전하게 처리될 수
          있도록 필요한 사항을 관리합니다.
        </P>
        <p className={noteStyle}>
          ※ 실제 위탁관계 및 개인정보의 국외 이전 여부는 각 서비스의 계약 및 데이터 처리 구조를
          기준으로 별도로 확인하여 본 처리방침에 반영합니다.
        </p>
      </Section>

      <Section title="제9조 개인정보의 국외 이전">
        <P>
          서비스에서 이용하는 외부 사업자의 서비스 구조에 따라 개인정보가 국외에서 처리되거나
          이전될 수 있습니다.
        </P>
        <P>
          개인정보의 국외 이전이 발생하는 경우 서비스는 관련 법령에 따라 다음 사항을 확인하여
          이용자에게 안내합니다.
        </P>
        <ul className={listStyle}>
          <li>이전되는 개인정보 항목</li>
          <li>개인정보가 이전되는 국가</li>
          <li>이전받는 자</li>
          <li>이전 목적</li>
          <li>이전 일시 및 방법</li>
          <li>보유 및 이용기간</li>
          <li>개인정보 이전을 거부하는 방법 및 거부 시 발생하는 사항</li>
        </ul>
        <P>
          현재 이용 중인 외부 서비스의 실제 데이터 처리 구조 및 국외 이전 여부를 확인하여 필요한
          사항을 본 개인정보처리방침에 반영합니다.
        </P>
      </Section>

      <Section title="제10조 이용자와 법정대리인의 권리 및 행사방법">
        <P>
          이용자는 자신의 개인정보에 대하여 관련 법령이 정하는 범위에서 다음의 권리를 행사할 수
          있습니다.
        </P>
        <ul className={listStyle}>
          <li>개인정보 열람 요구</li>
          <li>개인정보 정정 요구</li>
          <li>개인정보 삭제 요구</li>
          <li>개인정보 처리정지 요구</li>
          <li>개인정보 수집·이용 동의 철회</li>
          <li>회원 탈퇴</li>
          <li>위치정보 이용 동의 철회</li>
        </ul>
        <P>
          이용자는 서비스 내 다음 메뉴를 통해 개인정보를 직접 확인하거나 일부 정보를 변경할 수
          있습니다.
        </P>
        <P>
          <Strong>마이 → 설정 → 프로필 및 계정 설정</Strong>
        </P>
        <P>회원 탈퇴 역시 서비스 내 계정 설정을 통해 신청할 수 있습니다.</P>
        <P>
          회원 탈퇴 후 <Strong>30일 이내에는 계정 복구를 요청할 수 있으며</Strong>, 30일이 경과하여
          회원정보 익명화가 완료된 이후에는 기존 계정을 복구할 수 없습니다.
        </P>
        <P>
          서비스 내에서 직접 처리할 수 없는 개인정보의 열람·정정·삭제·처리정지 등에 관한 요청은
          제14조의 개인정보 관련 문의처를 통해 접수할 수 있습니다.
        </P>
        <P>
          서비스는 이용자의 권리 행사 요청을 받은 경우 관련 법령에서 정하는 절차와 기간에 따라
          필요한 조치를 취합니다.
        </P>
      </Section>

      <Section title="제11조 개인정보 전송요구 및 자동화된 결정에 관한 사항">
        <P>
          현재 서비스는 이용자의 개인정보에 대하여 「개인정보 보호법」에 따른 개인정보 전송요구 대상
          서비스를 제공하지 않습니다.
        </P>
        <P>
          또한 현재 서비스는 이용자의 권리 또는 의무에 중대한 영향을 미치는 결정을{' '}
          <Strong>완전히 자동화된 개인정보 처리만으로 수행하는 기능을 운영하지 않습니다.</Strong>
        </P>
        <P>
          향후 개인정보 전송요구 대상 서비스 또는 자동화된 결정에 해당하는 기능을 제공하게 되는
          경우, 관련 법령에 따라 행사방법, 처리절차 및 개인정보가 처리되는 방식 등을 본
          개인정보처리방침을 통해 안내합니다.
        </P>
      </Section>

      <Section title="제12조 쿠키 및 행태정보에 관한 사항">
        <P>
          현재 모바일 앱을 중심으로 제공되는 서비스에서는 이용자의 온라인 활동을 추적하여 맞춤형
          광고를 제공하기 위한 목적으로 행태정보를 수집·이용하거나 제3자에게 제공하지 않습니다.
        </P>
        <P>서비스는 현재 맞춤형 광고 제공을 목적으로 이용자의 개인정보를 이용하지 않습니다.</P>
        <P>
          향후 웹 서비스에서 쿠키를 이용하거나 맞춤형 광고를 위한 행태정보를 수집·이용하는 경우,
          수집하는 행태정보의 항목, 수집 방법, 이용 목적, 보유기간 및 이용자의 거부방법 등을 본
          개인정보처리방침을 통해 안내합니다.
        </P>
      </Section>

      <Section title="제13조 개인정보의 안전성 확보조치">
        <P>
          서비스는 이용자의 개인정보를 안전하게 관리하기 위하여 개인정보의 성격과 처리환경을
          고려하여 다음과 같은 보호조치를 적용합니다.
        </P>
        <ul className={listStyle}>
          <li>개인정보 접근권한 최소화</li>
          <li>인증 및 접근제어</li>
          <li>HTTPS 등 암호화 통신 사용</li>
          <li>JWT 기반 사용자 인증</li>
          <li>Refresh Token 관리 및 탈퇴 시 폐기</li>
          <li>데이터베이스 및 서버 접근 제한</li>
          <li>이용자 업로드 파일에 대한 접근 관리</li>
          <li>개인정보 보유기간에 따른 익명화 처리</li>
          <li>위치정보 이용기록의 보유기간 관리 및 자동 삭제</li>
        </ul>
      </Section>

      <Section title="제14조 개인정보 보호책임자 및 개인정보 관련 고충처리">
        <P>
          서비스는 이용자의 개인정보를 보호하고 개인정보 처리에 관한 문의 및 불만을 처리하기 위하여
          개인정보 보호책임자 및 개인정보 관련 문의처를 운영합니다.
        </P>
        <h3 className={subsectionTitleStyle}>개인정보 보호책임자</h3>
        <ul className={listStyle}>
          <li>성명: [대표자 또는 개인정보 보호책임자]</li>
          <li>직책: [대표 / 개인정보 보호책임자]</li>
          <li>이메일: [개인정보 보호책임자 이메일]</li>
          <li>전화번호: [연락처]</li>
        </ul>
        <h3 className={subsectionTitleStyle}>개인정보 관련 문의 및 고충처리</h3>
        <ul className={listStyle}>
          <li>담당부서: [제주길모아 고객지원 / 운영팀 등]</li>
          <li>이메일: [고객지원 이메일]</li>
          <li>전화번호: [연락처]</li>
        </ul>
        <P>
          이용자는 서비스 이용 중 발생하는 개인정보 보호 관련 문의, 불만, 열람·정정·삭제·처리정지
          등의 요청을 위 연락처를 통해 접수할 수 있습니다.
        </P>
        <P>서비스는 이용자의 문의 및 권리 행사 요청을 신속하게 확인하고 처리하도록 노력합니다.</P>
      </Section>

      <Section title="제15조 만 14세 미만 아동의 개인정보">
        <P>서비스는 원칙적으로 만 14세 미만 아동을 대상으로 회원가입 서비스를 제공하지 않습니다.</P>
        <P>
          서비스 이용 과정에서 만 14세 미만 아동의 개인정보가 수집된 사실을 확인한 경우 관련 법령에
          따라 필요한 조치를 취합니다.
        </P>
      </Section>

      <Section title="제16조 개인정보처리방침의 공개">
        <P>
          본 개인정보처리방침은 이용자가 언제든지 쉽게 확인할 수 있도록 서비스 내에서 공개합니다.
        </P>
        <P>이용자는 다음과 같은 경로에서 개인정보처리방침을 확인할 수 있습니다.</P>
        <P>
          <Strong>마이 → 설정 → 약관 및 정책 → 개인정보처리방침</Strong>
        </P>
        <P>
          또한 회원가입 또는 로그인 과정 등 개인정보 처리와 밀접한 화면에서도 필요한 경우
          개인정보처리방침을 확인할 수 있는 링크를 제공합니다.
        </P>
      </Section>

      <Section title="제17조 개인정보처리방침의 변경">
        <P>
          본 개인정보처리방침의 내용이 변경되는 경우 변경 내용과 시행일자를 서비스 또는 웹사이트
          등을 통해 안내합니다.
        </P>
        <P>
          이용자의 권리에 중대한 영향을 미치는 변경이 있는 경우 관련 법령에서 정한 방법에 따라
          별도로 안내합니다.
        </P>
      </Section>

      <Section title="제18조 사업자 정보">
        <ul className={listStyle}>
          <li>상호: [사업자 상호]</li>
          <li>서비스명: 제주길모아</li>
          <li>대표자: [대표자명]</li>
          <li>사업자등록번호: [사업자등록번호]</li>
          <li>사업장 소재지: [사업장 주소]</li>
          <li>이메일: [서비스 문의 이메일]</li>
          <li>전화번호: [연락처]</li>
        </ul>
      </Section>

      <Section title="부칙">
        <P>
          본 개인정보처리방침은 <Strong>{EFFECTIVE_DATE}</Strong>부터 시행합니다.
        </P>
      </Section>
    </div>
  )
}
