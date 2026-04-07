const PREFIX = 'dangbibi:'

export function storageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function storageSet<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

export function storageRemove(key: string): void {
  localStorage.removeItem(PREFIX + key)
}
