import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { tabPanelStyle, tabRecipe, tabsRoot } from './Tabs.css.ts'

export type TabItem = {
  /** 탭 고유 값 */
  value: string
  /** 탭 라벨 */
  label: string
  /** 선택 시 표시할 패널 내용. 없으면 탭 목록만 렌더 */
  content?: ReactNode
  /** true면 선택 불가 */
  disabled?: boolean
}

export type TabsProps = {
  /** 탭 항목 목록 */
  items: TabItem[]
  /** 현재 선택된 탭 value */
  value: string
  /** 탭 변경 핸들러 */
  onChange: (value: string) => void
  className?: string
}

/**
 * 탭 목록과 선택 패널을 제어하는 탭 네비게이션.
 *
 * @example
 * <Tabs items={[{ value: 'a', label: '소개', content: <Intro /> }]} value={tab} onChange={setTab} />
 */
export function Tabs({ items, value, onChange, className }: TabsProps) {
  const baseId = useId()
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const activeItem = items.find((item) => item.value === value) ?? items[0]
  const hasPanels = items.some((item) => item.content !== undefined)

  const focusTab = (itemValue: string) => {
    tabRefs.current.get(itemValue)?.focus()
  }

  const moveTo = (index: number) => {
    const enabled = items.filter((item) => !item.disabled)
    if (enabled.length === 0) return
    const next = enabled[(index + enabled.length) % enabled.length]
    onChange(next.value)
    focusTab(next.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled)
    const currentIndex = enabled.findIndex((item) => item.value === value)
    if (currentIndex < 0) return

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        moveTo(currentIndex + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        moveTo(currentIndex - 1)
        break
      case 'Home':
        event.preventDefault()
        moveTo(0)
        break
      case 'End':
        event.preventDefault()
        moveTo(enabled.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div className={className}>
      <div
        className={tabsRoot}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
      >
        {items.map((item) => {
          const isActive = item.value === value
          const tabId = `${baseId}-tab-${item.value}`
          const panelId = `${baseId}-panel-${item.value}`

          return (
            <button
              key={item.value}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={hasPanels ? panelId : undefined}
              tabIndex={isActive ? 0 : -1}
              disabled={item.disabled}
              className={tabRecipe({ active: isActive })}
              ref={(node) => {
                if (node) tabRefs.current.set(item.value, node)
                else tabRefs.current.delete(item.value)
              }}
              onClick={() => {
                if (!item.disabled) onChange(item.value)
              }}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {hasPanels && activeItem ? (
        <div
          id={`${baseId}-panel-${activeItem.value}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeItem.value}`}
          className={tabPanelStyle}
          tabIndex={0}
        >
          {activeItem.content}
        </div>
      ) : null}
    </div>
  )
}
