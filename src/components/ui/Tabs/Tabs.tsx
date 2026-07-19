import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { tabPanelStyle, tabRecipe, tabsRoot } from './Tabs.css.ts'

export type TabItem = {
  value: string
  label: string
  content?: ReactNode
  disabled?: boolean
}

export type TabsProps = {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
}

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
