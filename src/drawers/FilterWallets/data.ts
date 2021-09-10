import { IState, TSortButton } from './types'

export const initialState: IState = {
  activeSortKey: null,
  activeSortType: null,
  totalHiddenWallets: 0,
  totalZeroBalancesWallets: 0,
  isShowHiddenAddress: false,
  isShowZeroBalances: true,
  isShowPrevHiddenAddress: false,
  isShowPrevZeroBalances: true,
  selectedCurrencies: [],
  prevSelectedCurrencies: [],
  currenciesList: [],
}

export const sortButtons: TSortButton[] = [
  {
    title: 'Balance',
    key: 'balances',
    width: 110,
    values: {
      asc: 'Ascending',
      desc: 'Descending',
    },
  },
  {
    title: 'Created',
    key: 'date',
    width: 100,
    values: {
      asc: 'Older',
      desc: 'Newer',
    },
  },
  {
    title: 'Alphabet',
    key: 'alphabet',
    width: 90,
    values: {
      asc: 'A-Z',
      desc: 'Z-A',
    },
  },
]
