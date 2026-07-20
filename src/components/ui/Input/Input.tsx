import type { InputHTMLAttributes } from 'react'
import { inputStyle } from './Input.css.ts'
import { cn } from '@/utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

/**
 * 기본 텍스트 입력 필드. 네이티브 `<input>` 속성을 그대로 받습니다.
 *
 * @param props - `type`, `value`, `onChange`, `placeholder`, `disabled` 등 표준 input 속성
 *
 * @example
 * <Input type="email" placeholder="이메일" value={email} onChange={onEmailChange} />
 */
export function Input({ className, ...props }: InputProps) {
  return <input className={cn(inputStyle, className)} {...props} />
}
