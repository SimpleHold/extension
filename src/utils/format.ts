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
    var prec = Math.pow(10, precision)
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
