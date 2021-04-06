export default {
  btc: '^[13][a-km-zA-HJ-NP-Z1-9]{25,80}$|^(bc1)[0-9A-Za-z]{25,80}$',
  bch:
    '^([13][a-km-zA-HJ-NP-Z1-9]{25,34})$|^((bitcoincash:)?(q|p)[a-z0-9]{41})$|^((BITCOINCASH:)?(Q|P)[A-Z0-9]{41})$',
  bsv: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$',
  ltc: '^(L|M|3)[A-Za-z0-9]{33}$|^(ltc1)[0-9A-Za-z]{39}$',
  doge: '^(D|A|9)[a-km-zA-HJ-NP-Z1-9]{33,34}$',
  dash: '^[X|7][0-9A-Za-z]{33}$',
  eth: '^(0x)[0-9A-Fa-f]{40}$',
  etc: '^(0x)[0-9A-Fa-f]{40}$',
  bsc: '^(0x)[0-9A-Fa-f]{40}$',
}
