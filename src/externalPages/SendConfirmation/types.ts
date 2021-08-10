import { THardware } from '@utils/wallet'

export type TTabInfo = {
  favIconUrl: string
  url: string
}

export interface Props {
  amount: number
  symbol: TSymbols
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
}
