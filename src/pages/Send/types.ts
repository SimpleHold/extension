// Types
import { THardware, IWallet } from '@utils/wallet'
import { TCurrency } from '@config/currencies/types'
import { TToken } from '@tokens/types'
import { TCustomFee, TFeeTypes } from '@utils/api/types'
import { TUnspentOutput } from '@coins/types'

export interface ILocationState {
  symbol: string
  address: string
  chain: string
  walletName: string
  tokenChain?: string
  contractAddress?: string
  tokenName?: string
  decimals?: number
  hardware: THardware
  currency: TCurrency | TToken
  isRedirect?: boolean
}

export type TFeeValue = {
  utxos?: TUnspentOutput[]
  type: TFeeTypes
  value: number
}

export interface IState {
  balance: number | null
  estimated: number | null
  selectedAddress: string
  address: string
  wallets: IWallet[]
  activeDrawer: 'wallets' | 'aboutFee' | null
  walletName: string
  hardware?: THardware
  amount: string
  extraIdName: string | null
  extraId: string
  outputs: TUnspentOutput[]
  isFeeLoading: boolean
  fee: number
  feeSymbol: string
  feeType: TFeeTypes
  addressErrorLabel: null | string
  amountErrorLabel: null | string
  currencyBalance: null | number
  utxosList: TUnspentOutput[]
  backTitle: string
  customFee: TCustomFee
  isIncludeFee: boolean
  isStandingFee: boolean
  feeValues: TFeeValue[]
  timer: null | ReturnType<typeof setTimeout>
}
