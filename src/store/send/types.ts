// Types
import { TUnspentOutput } from '@coins/types'

export type TWarning = {
  value: string
  pressableValue?: string
  pressable?: string
}

export type TSendCurrency = {
  symbol: string
  minSendAmount: string
  chain: string
  tokenChain?: string
}

export type TDrawerTypes = 'networkFee' | 'wallets' | 'insufficientFee' | null

export type TExternalStoreData = {
  fee: number
  feeSymbol: string
  balance: string
  utxos: TUnspentOutput[]
  coinPrice: number
}
