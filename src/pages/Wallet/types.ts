// Types
import { TAddressTxGroup } from 'utils/history'
import { THardware } from '@utils/wallet'

export interface ILocationState {
  name?: string
  symbol: string
  address: string
  uuid: string
  chain?: string
  contractAddress?: string
  tokenName?: string
  decimals?: number
  isHidden?: boolean
  isRedirect?: string
  hardware: THardware
}

export interface IState {
  balance: null | number
  estimated: null | number
  txHistory: TAddressTxGroup[] | null
  activeDrawer: null | 'confirm' | 'privateKey' | 'renameWallet' | 'success' | 'txsReceivedSuccess'
  isBalanceRefreshing: boolean
  password: string
  passwordErrorLabel: null | string
  privateKey: null | string
  walletName: string
  isHiddenWallet: boolean
  warning: null | string
  confirmDrawerTitle: string
  confirmDrawerType: 'showPhrase' | 'showPrivateKey' | 'activateWallet' | 'receivePendingTxs' | null
  isDrawerButtonLoading: boolean
  isNotActivated: boolean
  address: string
}
