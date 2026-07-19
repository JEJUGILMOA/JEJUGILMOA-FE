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
  id: string
  label: string
  type?: 'history' | 'place'
}

export type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
  suggestions?: SearchSuggestion[]
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void
  onRemoveSuggestion?: (suggestion: SearchSuggestion) => void
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = '어디로 떠나고 싶으신가요?',
  onClear,
  suggestions,
  onSelectSuggestion,
  onRemoveSuggestion,
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
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
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
