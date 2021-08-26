// Types
import { THardware } from '@utils/wallet'
import type Transport from '@ledgerhq/hw-transport-webusb'

export type TTabInfo = {
  favIconUrl: string
  url: string
}

export interface Props {
  amount: number
  symbol: string
  networkFee: number
  addressFrom: string
  addressTo: string
  outputs: UnspentOutput[]
  chain: string
  networkFeeSymbol: string
  contractAddress?: string
  tokenChain?: string
  decimals?: number
  extraId?: string
  name?: string
  hardware?: THardware
  tabInfo?: TTabInfo
  isIncludeFee?: string
}

export interface IState {
  props: Props | null
  activeDrawer: null | 'confirm' | 'success' | 'fail' | 'ledger' | 'wrongDevice' | 'feedback'
  password: string
  inputErrorLabel: null | string
  isDrawerButtonLoading: boolean
  transactionLink: string
  failText: string
  isButtonLoading: boolean
  ledgerTransport: Transport | null
  ledgerDrawerState: 'wrongDevice' | 'wrongApp' | 'connectionFailed' | 'reviewTx' | null
  isDraggable: boolean
}

export type TLedgerTxParams = {
  transport: Transport
  symbol: string
  path: string
  addressFrom: string
  addressTo: string
  amount: number
  chain: string
  fee: number
  outputs?: UnspentOutput[]
  extraId?: string
}
