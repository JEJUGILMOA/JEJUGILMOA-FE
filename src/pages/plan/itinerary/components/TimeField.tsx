import { useRef, useState } from 'react'
import { timeFieldStyle } from './TimeField.css.ts'
import { TimeWheelPopover, type AnchorRect } from './TimeWheelPopover'

export type TimeFieldProps = {
  /** "HH:mm" 24시간제 */
  value: string
  onChange: (next: string) => void
  label: string
}

/** 알람 앱처럼 탭하면 시/분 휠 피커가 뜨는 시간 입력. 휠은 드래그하거나 마우스 휠로 조정한다. */
export function TimeField({ value, onChange, label }: TimeFieldProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [anchorRect, setAnchorRect] = useState<AnchorRect | null>(null)

  const openPicker = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    setAnchorRect({ top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width })
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={timeFieldStyle}
        onClick={openPicker}
        aria-haspopup="dialog"
        aria-expanded={anchorRect !== null}
        aria-label={`${label} ${value}. 눌러서 시간 휠로 조정하세요`}
      >
        {value}
      </button>
      {anchorRect ? (
        <TimeWheelPopover
          value={value}
          onChange={onChange}
          anchorRect={anchorRect}
          onClose={() => setAnchorRect(null)}
        />
      ) : null}
    </>
  )
}
