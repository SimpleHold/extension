import { TStatusItem, IState } from './types'

export const statuses: TStatusItem[] = [
  {
    title: 'Sended',
    key: 'sended',
  },
  {
    title: 'Received',
    key: 'received',
  },
  {
    title: 'Pending',
    key: 'pending',
  },
]

export const storageKeys: string[] = [
  'txHistoryStatus',
  'txHistoryCurrencies',
  'txHistoryAddresses',
]

export const initialState: IState = {
  status: null,
  currencies: [],
  selectedCurrencies: [],
  wallets: [],
  selectedWallets: [],
  isWalletsVisible: false,
}
