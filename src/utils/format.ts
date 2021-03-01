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

export const numberFriendly = (amount: number): number | string => {
  const abbrev = 'KMB'

  const round = (n: number, precision: number) => {
    var prec = Math.pow(10, precision)
    return Math.round(n * prec) / prec
  }

  let base = Math.floor(Math.log(Math.abs(amount)) / Math.log(1000))
  const suffix = abbrev[Math.min(2, base - 1)]
  base = abbrev.indexOf(suffix) + 1
  return suffix ? round(amount / Math.pow(1000, base), 2) + suffix : '' + amount
}

export const limitBalance = (amount: number, max: number): string | number => {
  const stringAmount = amount.toString()
  if (stringAmount.length > max) {
    const toFixed = stringAmount.split('.')[0].length + 1

    return Number(amount).toFixed(10 - toFixed)
  }

  return amount
}

export const price = (price: number, toFixed = 2): string => {
  return Number(price)
    .toFixed(toFixed)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
