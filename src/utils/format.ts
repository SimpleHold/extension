export const toUpper = (text: string | null | undefined) => {
  if (text?.length) {
    return text.toUpperCase()
  }
  return text
}

export const toLower = (text: string | null | undefined) => {
  if (text?.length) {
    return text.toLowerCase()
  }
  return text
}
