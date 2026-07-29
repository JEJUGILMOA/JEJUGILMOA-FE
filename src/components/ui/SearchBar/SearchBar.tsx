import { useId, useRef, useState, type ChangeEvent, type FocusEvent } from 'react'
import { Clock, MapPin, Search, X } from 'lucide-react'
import {
  clearButton,
  dropdown,
  removeSuggestionButton,
  searchBarRoot,
  searchIconClass,
  searchIconRecipe,
  suggestionItem,
  suggestionLabel,
  suggestionRow,
  suggestionType,
} from './SearchBar.css.ts'
import { fieldChromeRecipe, fieldInputReset } from '@/styles/fieldChrome.css.ts'
import { cn } from '@/utils/cn'

export type SearchSuggestion = {
  /** 고유 식별자 */
  id: string
  /** 표시 텍스트 */
  label: string
  /** 제안 종류. history=최근 검색, place=장소 */
  type?: 'history' | 'place'
}

export type SearchBarProps = {
  /** 검색어 */
  value: string
  /** 검색어 변경 핸들러 */
  onChange: (value: string) => void
  /** 플레이스홀더. 기본값 "어디로 떠나고 싶으신가요?" */
  placeholder?: string
  /** 지우기 버튼 클릭 시 추가 콜백 (값은 항상 빈 문자열로 초기화) */
  onClear?: () => void
  /** 포커스 시 표시할 제안 목록 */
  suggestions?: SearchSuggestion[]
  /** 제안 항목 선택 */
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void
  /** 제안 항목 삭제 (삭제 버튼 표시) */
  onRemoveSuggestion?: (suggestion: SearchSuggestion) => void
  /** 마운트 시 입력 포커스 */
  autoFocus?: boolean
  /** 입력 포커스 콜백 */
  onFocus?: () => void
  className?: string
}

/**
 * 검색어 입력과 제안 목록을 제공하는 검색바.
 *
 * @example
 * <SearchBar value={q} onChange={setQ} suggestions={items} onSelectSuggestion={select} />
 */
export function SearchBar({
  value,
  onChange,
  placeholder = '어디로 떠나고 싶으신가요?',
  onClear,
  suggestions,
  onSelectSuggestion,
  onRemoveSuggestion,
  autoFocus = false,
  onFocus,
  className,
}: SearchBarProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const showDropdown = isFocused && Boolean(suggestions?.length)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const handleClear = () => {
    onClear?.()
    onChange('')
  }

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = (event: FocusEvent) => {
    if (rootRef.current?.contains(event.relatedTarget as Node)) {
      return
    }
    setIsFocused(false)
  }

  return (
    <div ref={rootRef} className={cn(searchBarRoot, className)} onBlur={handleBlur}>
      <div className={fieldChromeRecipe({ focused: isFocused })}>
        <span className={cn(searchIconRecipe({ focused: isFocused }), searchIconClass)}>
          <Search aria-hidden />
        </span>
        <input
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? listboxId : undefined}
          aria-autocomplete="list"
          className={fieldInputReset}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
        {value ? (
          <button
            type="button"
            className={clearButton}
            onClick={handleClear}
            aria-label="검색어 지우기"
          >
            <X size={12} aria-hidden />
          </button>
        ) : null}
      </div>

      {showDropdown ? (
        <ul id={listboxId} role="listbox" className={dropdown}>
          {suggestions?.map((suggestion) => (
            <li key={suggestion.id} role="option" className={suggestionRow}>
              <button
                type="button"
                className={suggestionItem}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onSelectSuggestion?.(suggestion)
                  setIsFocused(false)
                }}
              >
                {suggestion.type === 'history' ? (
                  <Clock size={16} aria-hidden />
                ) : suggestion.type === 'place' ? (
                  <MapPin size={16} aria-hidden />
                ) : null}
                <span className={suggestionLabel}>{suggestion.label}</span>
                {suggestion.type ? (
                  <span className={suggestionType}>
                    {suggestion.type === 'history' ? '최근 검색' : '장소'}
                  </span>
                ) : null}
              </button>
              {onRemoveSuggestion ? (
                <button
                  type="button"
                  className={removeSuggestionButton}
                  aria-label={`${suggestion.label} 삭제`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={(event) => {
                    event.stopPropagation()
                    onRemoveSuggestion(suggestion)
                  }}
                >
                  <X size={14} aria-hidden />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
