import { cn } from '@/utils/cn'
import { useMyPageApiLogStore } from '@/stores/mypageApiLogStore'
import type { MyPageApiLogEntry } from '@/stores/mypageApiLogStore'
import {
  actionButtonStyle,
  codeBlockStyle,
  emptyStyle,
  entryHeaderStyle,
  entryStyle,
  headerActionsStyle,
  headerStyle,
  listStyle,
  methodStyle,
  panelCollapsedStyle,
  panelStyle,
  sectionTitleStyle,
  statusBadgeStyle,
  statusErrorStyle,
  statusPendingStyle,
  statusSuccessStyle,
  titleStyle,
  urlStyle,
} from './MyPageApiLogPanel.css.ts'

function stringify(value: unknown) {
  if (value == null) return '-'
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function statusLabel(entry: MyPageApiLogEntry) {
  if (entry.status === 'pending') return '요청중'
  if (entry.status === 'error') return `오류 ${entry.httpStatus ?? ''}`.trim()
  return `완료 ${entry.httpStatus ?? ''}`.trim()
}

function LogSection({ title, value }: { title: string; value: unknown }) {
  return (
    <div>
      <p className={sectionTitleStyle}>{title}</p>
      <pre className={codeBlockStyle}>{stringify(value)}</pre>
    </div>
  )
}

function LogEntry({ entry }: { entry: MyPageApiLogEntry }) {
  return (
    <li className={entryStyle}>
      <div className={entryHeaderStyle}>
        <span className={methodStyle}>{entry.method}</span>
        <span className={urlStyle}>{entry.url}</span>
        <span
          className={cn(
            statusBadgeStyle,
            entry.status === 'pending' && statusPendingStyle,
            entry.status === 'success' && statusSuccessStyle,
            entry.status === 'error' && statusErrorStyle,
          )}
        >
          {statusLabel(entry)}
        </span>
      </div>

      <LogSection title="Request Headers" value={entry.requestHeaders} />
      <LogSection title="Request Params" value={entry.requestParams} />
      <LogSection title="Request Body" value={entry.requestBody} />

      {entry.status !== 'pending' ? (
        <>
          <LogSection title="Response Headers" value={entry.responseHeaders ?? null} />
          <LogSection title="Response Body" value={entry.responseBody ?? null} />
          <LogSection title="Response result" value={entry.result ?? null} />
          {entry.code || entry.message ? (
            <LogSection
              title="Envelope"
              value={{
                isSuccess: entry.isSuccess,
                code: entry.code,
                message: entry.message,
              }}
            />
          ) : null}
          {entry.errorMessage ? <LogSection title="Error" value={entry.errorMessage} /> : null}
        </>
      ) : null}
    </li>
  )
}

export function MyPageApiLogPanel() {
  if (!import.meta.env.DEV) return null

  const entries = useMyPageApiLogStore((state) => state.entries)
  const isOpen = useMyPageApiLogStore((state) => state.isOpen)
  const clear = useMyPageApiLogStore((state) => state.clear)
  const toggleOpen = useMyPageApiLogStore((state) => state.toggleOpen)

  return (
    <section className={cn(panelStyle, !isOpen && panelCollapsedStyle)} aria-label="마이페이지 API 로그">
      <div className={headerStyle}>
        <h2 className={titleStyle}>API 로그 ({entries.length})</h2>
        <div className={headerActionsStyle}>
          <button type="button" className={actionButtonStyle} onClick={clear}>
            지우기
          </button>
          <button type="button" className={actionButtonStyle} onClick={toggleOpen}>
            {isOpen ? '접기' : '펼치기'}
          </button>
        </div>
      </div>

      {isOpen ? (
        entries.length > 0 ? (
          <ul className={listStyle}>
            {entries.map((entry) => (
              <LogEntry key={entry.id} entry={entry} />
            ))}
          </ul>
        ) : (
          <p className={emptyStyle}>아직 API 호출이 없어요.</p>
        )
      ) : null}
    </section>
  )
}
