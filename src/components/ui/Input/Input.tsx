import type { InputHTMLAttributes } from 'react'
import { inputStyle } from './Input.css.ts'
import { cn } from '@/utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(inputStyle, className)} {...props} />
}
