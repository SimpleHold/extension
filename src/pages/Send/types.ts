// Types
import { THardware, IWallet } from '@utils/wallet'
import { ICardanoUnspentTxOutput } from '@utils/currencies/cardano'
import { ICurrency } from '@config/currencies'
import { IToken } from '@config/tokens'

export type TFees = 'slow' | 'average' | 'fast'

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

export interface IState {
  balance: number | null
  estimated: number | null
  selectedAddress: string
  address: string
  wallets: IWallet[]
  activeDrawer: 'wallets' | null
  walletName: string
  hardware?: THardware
  amount: string
  extraIdName: string | null
  extraId: string
  outputs: UnspentOutput[]
  isFeeLoading: boolean
  fee: number
  feeSymbol: string
  feeType: TFees
  addressErrorLabel: null | string
  amountErrorLabel: null | string
  currencyBalance: null | number
  utxosList: UnspentOutput[] | ICardanoUnspentTxOutput[]
  backTitle: string
}
