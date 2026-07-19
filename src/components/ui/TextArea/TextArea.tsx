import { useState, type ChangeEvent } from 'react'
import { countStyle, textAreaRecipe, textAreaRoot } from './TextArea.css.ts'
import { cn } from '@/utils/cn'

export type TextAreaProps = {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  placeholder?: string
  className?: string
}

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
