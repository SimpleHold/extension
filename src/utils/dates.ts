import { getItem } from 'utils/storage'

export const msToMin = (ms: number): number => {
  return Math.round(((ms % 86400000) % 3600000) / 60000)
}

export type TTime = {
  weeks? : number
  days? : number
  hours?: number
  minutes?: number
  seconds?: number
}

export const toMs = ({ weeks, days, hours, minutes, seconds }: TTime) => {
  const parseZero = (n: number | undefined) => n ? n : 0
  const w = parseZero(weeks) * 60 * 60 * 24 * 7
  const d = parseZero(days) * 60 * 60 * 24
  const h = parseZero(hours) * 60 * 60
  const m = parseZero(minutes) * 60
  const s = parseZero(seconds)
  return ( w + d + h + m + s ) * 1000
}

export const checkIfTimeHasPassed = (timestamp: number, time: TTime) => {
  if (!timestamp) return false;
  const diff = Date.now() - Number(timestamp)
  return diff < toMs(time)
}