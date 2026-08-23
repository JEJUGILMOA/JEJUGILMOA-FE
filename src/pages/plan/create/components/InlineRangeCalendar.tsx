import { useEffect, useMemo, useState } from 'react'
import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  dayButtonRecipe,
  dayCellRecipe,
  dayGridStyle,
  monthHeaderStyle,
  monthTitleStyle,
  navButtonStyle,
  rootStyle,
  summaryBoxStyle,
  summaryPlaceholderStyle,
  weekdayRowStyle,
  weekdayStyle,
} from './InlineRangeCalendar.css.ts'

const DISPLAY_FORMAT = 'yyyy.MM.dd'
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export type InlineRangeCalendarProps = {
  /** `yyyy.MM.dd` 형식 */
  startDate: string | null
  endDate: string | null
  onChange: (startDate: string, endDate: string | null) => void
  /** true면 날짜를 볼 수만 있고 고를 수 없다 (저장된 계획은 날짜 수정 불가) */
  readOnly?: boolean
}

/** STEP 01-2: 인라인 월 캘린더 range 선택 (오늘 이전 날짜 비활성화) */
export function InlineRangeCalendar({
  startDate,
  endDate,
  onChange,
  readOnly = false,
}: InlineRangeCalendarProps) {
  const start = useMemo(() => (startDate ? parse(startDate, DISPLAY_FORMAT, new Date()) : null), [startDate])
  const end = useMemo(() => (endDate ? parse(endDate, DISPLAY_FORMAT, new Date()) : null), [endDate])
  const [viewMonth, setViewMonth] = useState(() => start ?? new Date())
  const today = startOfDay(new Date())

  // 수정 화면에서는 기존 계획의 startDate가 마운트 이후(비동기 조회)에 채워지므로,
  // useState 초기값만으로는 처음 보여줄 달을 못 맞춘다 — 값이 들어오면 그 달로 맞춰준다.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (start) setViewMonth(start)
  }, [start])

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 })
    const gridEnd = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 0 })
    return eachDayOfInterval({ start: gridStart, end: gridEnd })
  }, [viewMonth])

  const handleSelectDay = (day: Date) => {
    if (readOnly) return
    if (!start || end) {
      onChange(format(day, DISPLAY_FORMAT), null)
      return
    }
    if (isBefore(day, start)) {
      onChange(format(day, DISPLAY_FORMAT), null)
      return
    }
    onChange(format(start, DISPLAY_FORMAT), format(day, DISPLAY_FORMAT))
  }

  const nights = start && end ? differenceInCalendarDays(end, start) : null
  const dateRangeLabel =
    start && end && nights !== null
      ? `${format(start, 'M.d(EEE)', { locale: ko })} - ${format(end, 'M.d(EEE)', { locale: ko })} · ${nights}박 ${nights + 1}일`
      : null

  return (
    <div className={rootStyle}>
      <div className={monthHeaderStyle}>
        <button
          type="button"
          className={navButtonStyle}
          onClick={() => setViewMonth((month) => subMonths(month, 1))}
          aria-label="이전 달"
        >
          <ChevronLeft size={16} />
        </button>
        <span className={monthTitleStyle}>{format(viewMonth, 'yyyy년 M월', { locale: ko })}</span>
        <button
          type="button"
          className={navButtonStyle}
          onClick={() => setViewMonth((month) => addMonths(month, 1))}
          aria-label="다음 달"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={weekdayRowStyle}>
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className={weekdayStyle}>
            {weekday}
          </span>
        ))}
      </div>

      <div className={dayGridStyle}>
        {days.map((day) => {
          const inMonth = isSameMonth(day, viewMonth)
          if (!inMonth) {
            return (
              <div key={day.toISOString()} className={dayCellRecipe({})}>
                <button type="button" className={dayButtonRecipe({ empty: true })} disabled tabIndex={-1} />
              </div>
            )
          }

          const disabled = readOnly || isBefore(day, today)
          const isStart = start ? isSameDay(day, start) : false
          const isEnd = end ? isSameDay(day, end) : false
          const inRange = start && end ? day > start && day < end : false

          return (
            <div
              key={day.toISOString()}
              className={dayCellRecipe({
                inRange: inRange || isStart || isEnd,
                rangeStart: isStart,
                rangeEnd: isEnd,
              })}
            >
              <button
                type="button"
                className={dayButtonRecipe({ disabled, endpoint: isStart || isEnd })}
                disabled={disabled}
                aria-pressed={isStart || isEnd}
                onClick={() => handleSelectDay(day)}
              >
                {format(day, 'd')}
              </button>
            </div>
          )
        })}
      </div>

      <div className={summaryBoxStyle}>
        {dateRangeLabel ?? <span className={summaryPlaceholderStyle}>여행 날짜를 선택해 주세요</span>}
      </div>
    </div>
  )
}
