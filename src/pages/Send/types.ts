// Types
import { THardware, IWallet } from '@utils/wallet'
import { ICurrency } from '@config/currencies'
import { IToken } from '@config/tokens'
import { TCustomFee } from '@utils/api/types'

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
  currency: ICurrency | IToken
}

export type TFeeValue = {
  utxos?: UnspentOutput[]
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
  outputs: UnspentOutput[]
  isFeeLoading: boolean
  fee: number
  feeSymbol: string
  feeType: TFeeTypes
  addressErrorLabel: null | string
  amountErrorLabel: null | string
  currencyBalance: null | number
  utxosList: UnspentOutput[] | CardanoUnspentTxOutput[]
  backTitle: string
  customFee: TCustomFee
  isIncludeFee: boolean
  isStandingFee: boolean
  feeValues: TFeeValue[]
  timer: null | ReturnType<typeof setTimeout>
}
