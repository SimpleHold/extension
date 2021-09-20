type TCurrency = {
  coins: string[]
  mask: string
}

const currencies: TCurrency[] = [
  {
    coins: ['btc'],
    mask: '^[13][a-km-zA-HJ-NP-Z1-9]{25,80}$|^(bc1)[0-9A-Za-z]{25,80}$',
  },
  {
    coins: ['bch'],
    mask:
      '^([13][a-km-zA-HJ-NP-Z1-9]{25,34})$|^((bitcoincash:)?(q|p)[a-z0-9]{41})$|^((BITCOINCASH:)?(Q|P)[A-Z0-9]{41})$',
  },
  {
    coins: ['bsv'],
    mask: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$',
  },
  {
    coins: ['ltc'],
    mask: '^(L|M|3)[A-Za-z0-9]{33}$|^(ltc1)[0-9A-Za-z]{39}$',
  },
  {
    coins: ['doge'],
    mask: '^(D|A|9)[a-km-zA-HJ-NP-Z1-9]{33,34}$',
  },
  {
    coins: ['dash'],
    mask: '^[X|7][0-9A-Za-z]{33}$',
  },
  {
    coins: ['eth', 'etc', 'bsc', 'bnb'],
    mask: '^(0x)[0-9A-Fa-f]{40}$',
  },
  {
    coins: ['ada'],
    mask: '^(([1-9A-HJ-NP-Za-km-z]{59})|([0-9A-Za-z]{100,104}))$|^(addr)[0-9A-Za-z]{45,65}$',
  },
  {
    coins: ['theta', 'tfuel'],
    mask: '^(0x)[0-9A-Fa-f]{40}$',
  },
]

export default (symbol: string, address: string, chain?: string): boolean => {
  try {
    if (chain) {
      return new RegExp('^(0x)[0-9A-Fa-f]{40}$')?.test(address)
    }

    const findCurrency = currencies.find(
      (currency: TCurrency) => currency.coins.indexOf(symbol) !== -1
    )

    if (findCurrency) {
      return new RegExp(findCurrency.mask).test(address)
    }

    return false
  } catch {
    return false
  }
}
