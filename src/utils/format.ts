import BigNumber from 'bignumber.js'
import numeral from 'numeral'

export const minus = (from: number, to: number): number => {
  return new BigNumber(from).minus(new BigNumber(to)).toNumber()
}

export const plus = (from: number, to: number): number => {
  return new BigNumber(from).plus(new BigNumber(to)).toNumber()
}

export const toUpper = (text?: string): string | undefined => {
  if (text?.length) {
    return text.toUpperCase()
  }
  return text
}

export const toLower = (text?: string): string | undefined => {
  if (text?.length) {
    return text.toLowerCase()
  }
  return text
}

export const numberFriendly = (amount: number | null): number | string => {
  if (amount === null) {
    return '0'
  }

  const abbrev = 'KMB'

  const round = (n: number, precision: number) => {
    const prec = Math.pow(10, precision)
    return Math.round(n * prec) / prec
  }

  let base = Math.floor(Math.log(Math.abs(amount)) / Math.log(1000))
  const suffix = abbrev[Math.min(2, base - 1)]
  base = abbrev.indexOf(suffix) + 1
  return suffix
    ? round(amount / Math.pow(1000, base), 2).toFixed(2) + suffix
    : '' + amount.toFixed(2)
}

export const price = (price: number | null, toFixed = 2): string => {
  if (price === null) {
    return Number(0).toFixed(toFixed)
  }

  return Number(price)
    .toFixed(toFixed)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const groupBy = (key: string, array: any[]) =>
  array.reduce(
    (objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj),
    }),
    {}
  )

export const short = (data: string, max: number): string => {
  return data.length > max
    ? data.substring(0, max / 2 - 1) +
        '...' +
        data.substring(data.length - max / 2 + 2, data.length)
    : data
}

export const getFormatEstimated = (
  estimated: number | null,
  value: number | string
): number | string | null => {
  if (estimated === undefined) return null
  if (estimated !== 0 && estimated !== null && estimated < 0.01) {
    return '< 0.01'
  }
  return value
}

export const toUnit = (value: string | number, zeros: number): number => {
  const zerosBN = new BigNumber(10).pow(zeros)
  return Number(new BigNumber(value).div(zerosBN))
}

export const fromUnit = (value: string | number, zeros: number): number => {
  const zerosBN = new BigNumber(10).pow(zeros)
  return Number(new BigNumber(value).multipliedBy(zerosBN))
}

export const getAbsoluteValue = (value: string | number, isPositive: boolean): number => {
  if (isPositive) {
    return Math.abs(+value)
  }

  return -Math.abs(+value)
}

export const getFormatBalance = (balance: string | number | null) => {
  if (balance === null) return null
  if (balance === 0) return '0'
  if (Math.abs(+balance) < 0.000001) {
    return '< 0.000001'
  }
  return numeral(balance).format('0.[000000]')
}

export const toFixedWithoutRound = (n: number, digits: number): number => {
  const regEx = new RegExp('^-?\\d+(?:.\\d{0,' + (digits || -1) + '})?')
  const match = n.toString().match(regEx)
  return match ? +match[0] : n
}

export const padTo2Digits = (n: number) => {
  return n.toString().padStart(2, '0')
}

export const formatFee = (fee: number): string => {
  if (`${fee}` === '0') {
    return '0'
  }

  if (fee < 0.000001) {
    return Number(fee).toFixed(10)
  }

  return `${fee}`
}
