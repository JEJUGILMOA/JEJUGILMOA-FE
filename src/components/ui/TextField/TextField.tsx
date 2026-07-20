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
  /** 필드 라벨 */
  label?: string
  /** 제어 값 */
  value: string
  /** 값 변경 핸들러 */
  onChange: (value: string) => void
  /** 플레이스홀더 */
  placeholder?: string
  /** 에러 메시지. 있으면 에러 스타일 적용 */
  error?: string
  /** 최대 글자 수 */
  maxLength?: number
  /** true면 글자 수(현재/최대) 표시. maxLength와 함께 사용 */
  showCount?: boolean
  /** 입력란 앞쪽 접두 콘텐츠 */
  prefix?: ReactNode
  /** 입력란 뒤쪽 접미 콘텐츠 */
  suffix?: ReactNode
  /** 입력란 왼쪽 아이콘 */
  leftIcon?: ReactNode
  /** input type. 기본값 text */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'
  /** password일 때 표시/숨김 토글 버튼. 기본값 false */
  togglePassword?: boolean
  className?: string
}

/**
 * 라벨·에러·글자 수·아이콘을 지원하는 폼 입력 필드.
 *
 * @example
 * <TextField label="닉네임" value={name} onChange={setName} error={error} />
 */
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
