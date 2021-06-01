export const getItem = (key: string): string | null => {
  return localStorage.getItem(key)
}

export const setItem = (key: string, value: string): void => {
  return localStorage.setItem(key, value)
}

export const removeItem = (key: string): void => {
  return localStorage.removeItem(key)
}

export const removeMany = (keys: string[]): void => {
  for (const key of keys) {
    removeItem(key)
  }
}

export const clear = (): void => {
  localStorage.clear()
}
