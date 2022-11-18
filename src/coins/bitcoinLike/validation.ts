export type TValidateItem = {
  symbol: string;
  pattern: string;
};

const validation: TValidateItem[] = [
  {
    symbol: 'btc',
    pattern: '^[13][a-km-zA-HJ-NP-Z1-9]{25,80}$|^(bc1)[0-9A-Za-z]{25,80}$',
  },
  {
    symbol: 'ltc',
    pattern: '^(L|M|3)[A-Za-z0-9]{33}$|^(ltc1)[0-9A-Za-z]{39}$',
  },
  {
    symbol: 'dash',
    pattern: '^[X|7][0-9A-Za-z]{33}$',
  },
  {
    symbol: 'doge',
    pattern: '^(D|A|9)[a-km-zA-HJ-NP-Z1-9]{33,34}$',
  },
  {
    symbol: 'bch',
    pattern:
      '^([13][a-km-zA-HJ-NP-Z1-9]{25,34})$|^((bitcoincash:)?(q|p)[a-z0-9]{41})$|^((BITCOINCASH:)?(Q|P)[A-Z0-9]{41})$',
  },
  {
    symbol: 'bsv',
    pattern: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$',
  },
];

export default validation;
