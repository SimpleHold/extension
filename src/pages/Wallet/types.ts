// Types
import { TAddressTxGroup } from '@utils/txs'
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
  hardware: THardware
}

export interface IState {
  balance: null | number
  estimated: null | number
  txHistory: TAddressTxGroup[] | null
  activeDrawer: null | 'confirm' | 'privateKey' | 'renameWallet'
  isBalanceRefreshing: boolean
  password: string
  passwordErrorLabel: null | string
  privateKey: null | string
  walletName: string
  isHiddenWallet: boolean
}
