import { useEffect, useMemo, useRef, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { fieldChromeRecipe } from '@/styles/fieldChrome.css.ts'
import {
  dayButtonRecipe,
  dayCellStyle,
  dayGridStyle,
  iconRecipe,
  monthHeaderStyle,
  monthTitleStyle,
  navButtonStyle,
  popoverStyle,
  rootStyle,
  triggerStyle,
  valueStyle,
  weekdayRowStyle,
  weekdayStyle,
} from './DateField.css.ts'

const DISPLAY_FORMAT = 'yyyy.MM.dd'
const WEEKDAYS = [
  { label: '일', tone: 'sunday' as const },
  { label: '월', tone: 'weekday' as const },
  { label: '화', tone: 'weekday' as const },
  { label: '수', tone: 'weekday' as const },
  { label: '목', tone: 'weekday' as const },
  { label: '금', tone: 'weekday' as const },
  { label: '토', tone: 'saturday' as const },
]

function parseDisplayDate(value: string): Date | null {
  if (!value) return null
  const parsed = parse(value, DISPLAY_FORMAT, new Date())
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function dayTone(date: Date) {
  const day = date.getDay()
  if (day === 0) return 'sunday' as const
  if (day === 6) return 'saturday' as const
  return 'weekday' as const
}

export type DateFieldProps = {
  /** 선택 날짜. `yyyy.MM.dd` 형식 */
  value: string
  /** 날짜 변경 핸들러 (`yyyy.MM.dd`) */
  onChange: (value: string) => void
  /** 미선택 시 표시 문구. 기본값 "날짜를 선택하세요" */
  placeholder?: string
  className?: string
}

/**
 * 캘린더 팝오버로 날짜를 고르는 입력 필드. 값은 `yyyy.MM.dd` 형식입니다.
 *
 * @example
 * <DateField value={date} onChange={setDate} />
 */
export function DateField({
  value,
  onChange,
  placeholder = '날짜를 선택하세요',
  className,
}: DateFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const selectedDate = useMemo(() => parseDisplayDate(value), [value])
  const [viewMonth, setViewMonth] = useState(() => selectedDate ?? new Date())

  const closeAndRestoreFocus = () => {
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleToggleOpen = () => {
    if (open) {
      closeAndRestoreFocus()
      return
    }
    setViewMonth(selectedDate ?? new Date())
    setOpen(true)
  }

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [viewMonth])

  const handleSelectDay = (day: Date) => {
    onChange(format(day, DISPLAY_FORMAT))
    closeAndRestoreFocus()
  }

  return (
    <div ref={rootRef} className={cn(rootStyle, className)}>
      <button
        ref={triggerRef}
        type="button"
        className={cn(fieldChromeRecipe({ focused: open }), triggerStyle)}
        onClick={handleToggleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={iconRecipe({ open, placeholder: !value })}>
          <Calendar aria-hidden />
        </span>
        <span className={valueStyle({ placeholder: !value })}>{value || placeholder}</span>
      </button>

      {open ? (
        <div className={popoverStyle} role="dialog" aria-label="날짜 선택">
          <div className={monthHeaderStyle}>
            <button
              type="button"
              className={navButtonStyle}
              onClick={() => setViewMonth((month) => subMonths(month, 1))}
              aria-label="이전 달"
            >
              <ChevronLeft size={16} />
            </button>
            <span className={monthTitleStyle}>
              {format(viewMonth, 'yyyy년 M월', { locale: ko })}
            </span>
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
              <span key={weekday.label} className={weekdayStyle({ tone: weekday.tone })}>
                {weekday.label}
              </span>
            ))}
          </div>

          <div className={dayGridStyle}>
            {days.map((day) => {
              const inMonth = isSameMonth(day, viewMonth)
              const selected = selectedDate ? isSameDay(day, selectedDate) : false

              return (
                <div key={day.toISOString()} className={dayCellStyle}>
                  {inMonth ? (
                    <button
                      type="button"
                      className={dayButtonRecipe({
                        tone: dayTone(day),
                        selected,
                      })}
                      aria-pressed={selected}
                      onClick={() => handleSelectDay(day)}
                    >
                      {format(day, 'd')}
                    </button>
                  ) : (
                    <span className={dayButtonRecipe({ tone: 'empty' })} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
