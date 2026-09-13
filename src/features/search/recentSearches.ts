const STORAGE_KEY = 'gilmoa-recent-searches'
const MAX_RECENT = 8

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

export function loadRecentSearches(): string[] {
  if (!canUseStorage()) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, MAX_RECENT)
  } catch {
    return []
  }
}

export function saveRecentSearches(terms: string[]) {
  if (!canUseStorage()) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(terms.slice(0, MAX_RECENT)))
  } catch {
    // quota / private mode — ignore
  }
}

export function addRecentSearch(terms: string[], term: string): string[] {
  const next = term.trim()
  if (!next) return terms
  return [next, ...terms.filter((item) => item !== next)].slice(0, MAX_RECENT)
}
