import { useState, type ChangeEvent } from 'react'
import { countStyle, textAreaRecipe, textAreaRoot } from './TextArea.css.ts'
import { cn } from '@/utils/cn'

export type TextAreaProps = {
  /** 제어 값 */
  value: string
  /** 값 변경 핸들러 */
  onChange: (value: string) => void
  /** 최대 글자 수. 지정 시 하단에 카운터 표시 */
  maxLength?: number
  /** 플레이스홀더 */
  placeholder?: string
  className?: string
}

/**
 * 여러 줄 텍스트 입력. 글자 수 제한 표시를 지원합니다.
 *
 * @example
 * <TextArea value={bio} onChange={setBio} maxLength={200} placeholder="소개를 입력하세요" />
 */
export function TextArea({
  value,
  onChange,
  maxLength,
  placeholder,
  className,
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className={cn(textAreaRoot, className)}>
      <textarea
        className={textAreaRecipe({ focused: isFocused })}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {maxLength !== undefined ? (
        <span className={countStyle} aria-live="polite">
          {value.length} / {maxLength}
        </span>
      ) : null}
    </div>
  )
}
