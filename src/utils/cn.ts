import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`)
}
