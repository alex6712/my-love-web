export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue
    try {
      return JSON.parse(item) as T
    } catch {
      return item as T
    }
  },
  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove: (key: string): void => {
    localStorage.removeItem(key)
  },
}
