export const msToMin = (ms: number): number => {
  return Math.round(((ms % 86400000) % 3600000) / 60000)
}
