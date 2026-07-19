import { useId, useState, type ChangeEvent, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { fieldChromeRecipe, fieldInputReset } from '@/styles/fieldChrome.css.ts'
import {
  affixStyle,
  countStyle,
  errorMessage,
  footerRow,
  labelStyle,
  leftIconClass,
  leftIconStyle,
  textFieldRoot,
  togglePasswordButton,
} from './TextField.css.ts'
import { cn } from '@/utils/cn'

export type TextFieldProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  maxLength?: number
  showCount?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  leftIcon?: ReactNode
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'
  togglePassword?: boolean
  className?: string
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  maxLength,
  showCount = false,
  prefix,
  suffix,
  leftIcon,
  type = 'text',
  togglePassword = false,
  className,
}: TextFieldProps) {
  const inputId = useId()
  const errorId = useId()
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const hasError = Boolean(error)
  const isPasswordField = type === 'password'
  const resolvedType =
    isPasswordField && togglePassword ? (isPasswordVisible ? 'text' : 'password') : type

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const showFooter = hasError || (showCount && maxLength !== undefined)

  return (
    <div className={cn(textFieldRoot, className)}>
      {label ? (
        <label htmlFor={inputId} className={labelStyle}>
          {label}
        </label>
      ) : null}

      <div
        className={fieldChromeRecipe({
          focused: isFocused && !hasError,
          error: hasError,
        })}
      >
        {leftIcon ? (
          <span className={cn(leftIconStyle, leftIconClass)}>{leftIcon}</span>
        ) : null}
        {prefix ? <span className={affixStyle}>{prefix}</span> : null}
        <input
          id={inputId}
          type={resolvedType}
          className={fieldInputReset}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
        />
        {suffix ? <span className={affixStyle}>{suffix}</span> : null}
        {isPasswordField && togglePassword ? (
          <button
            type="button"
            className={togglePasswordButton}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {isPasswordVisible ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
          </button>
        ) : null}
      </div>

      {showFooter ? (
        <div className={footerRow}>
          {hasError ? (
            <span id={errorId} className={errorMessage} role="alert">
              {error}
            </span>
          ) : (
            <span />
          )}
          {showCount && maxLength !== undefined ? (
            <span className={countStyle}>
              {value.length} / {maxLength}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
