// Types
import { TFeeResponse } from '@utils/api/types'

export type TProvider = {
  generateAddress: (
    symbol: string,
    chain: string,
    tokenChain?: string
  ) => Promise<TGenerateAddress | null>
  importPrivateKey?: (privateKey: string, symbol: string) => Promise<string | null>
  getExplorerLink: (
    address: string,
    chain: string,
    tokenChain?: string,
    contractAddress?: string,
    symbol?: string
  ) => string
  getTransactionLink: (hash: string, chain: string) => string
  getStandingFee?: (symbol: string, chain: string, tokenChain?: string) => number
  createInternalTx?: (props: TInternalTxProps) => Promise<string | null>
  validateAddress: (address: string, symbol: string, chain: string) => boolean
  createTx?: (props: TCreateTxProps) => Promise<string | null>
  formatValue: (value: string | number, type: 'from' | 'to', symbol: string) => number
  importRecoveryPhrase?: (
    recoveryPhrase: string,
    symbol: string,
    chain: string
  ) => Promise<TGenerateAddress | null>
  generateExtraId?: () => string
  config: TCurrencyConfig
  getNetworkFee?: (props: TFeeProps) => Promise<TFeeResponse | null>
}

export type TFeeProps = {
  symbol: string
  amount: string
  from: string
  chain: string
  outputs: TUnspentOutput[]
  addressFrom: string
  tokenChain?: string
  contractAddress?: string
  decimals?: number
  extraId?: string
}

export type TCurrencyConfig = {
  coins: string[]
  isInternalTx?: boolean
  isWithOutputs?: boolean
  isZeroFee?: boolean
  extraIdName?: string
  isWithPhrase?: boolean
  wordsSize?: number[]
  isGenerateExtraId?: boolean
  isFeeApproximate?: boolean
}

export type TInternalTxProps = {
  symbol: string
  addressFrom: string
  addressTo: string
  amount: string
  privateKey?: string
  networkFee: number
  outputs?: TUnspentOutput[]
  extraId?: string
  mnemonic?: string
  tokenChain?: string
  contractAddress?: string
  decimals?: number
  chain: string
}

export type TUnspentOutput = {
  txId: string
  outputIndex: number
  script: string
  satoshis: number
  address: string
}

export type TCreateTxProps = {
  symbol: string
  chain: string
  addressFrom: string
  addressTo: string
  amount: string
  privateKey?: string | null
  utxos: TUnspentOutput[]
  fee: number
  tokenChain?: string
  contractAddress?: string
  extraId?: string
  decimals?: number
  mnemonic?: string
  minCurrencyAmount?: number
}

export type TGenerateAddress = {
  address: string
  privateKey: string
  mnemonic?: string
  extra?: any
  isNotActivated?: boolean
}

// // Types
// import { TCustomFee } from '@utils/api/types'

// export type TProvider = {
//   generateWallet: () => Promise<TGenerateAddress | null> | TGenerateAddress | null
//   validateAddress?: (address: string) => boolean
//   importPrivateKey?: (privateKey: string) => string | null | Promise<string | null>
//   getExplorerLink?: (address: string) => string
//   getTransactionLink?: (hash: string) => string
//   importRecoveryPhrase?: (recoveryPhrase: string) => Promise<TGenerateAddress | null>
//   generateExtraId?: () => string
//   getStandingFee?: () => number | null
//   formatValue: (value: string | number, type: 'from' | 'to') => number | string
//   isInternalTx?: boolean
//   createInternalTx?: (props: TInternalTxProps) => Promise<string | null>
//   isWithOutputs?: boolean
//   extraIdName?: string
// }

// export type TCreateTransactionProps = {
//   from: string
//   to: string
//   amount: string
//   privateKey: string
//   symbol: string
//   tokenChain?: string
//   outputs?: UnspentOutput[]
//   networkFee?: number
//   gas?: number
//   chainId?: number
//   gasPrice?: string
//   nonce?: number
//   contractAddress?: string
//   xrpTxData?: {
//     fee: string
//     sequence: number
//     maxLedgerVersion: number
//   }
//   extraId?: string
// }

// export type TCreateInternalTxProps = {
//   symbol: string,
//   addressFrom: string,
//   addressTo: string,
//   amount: number,
//   privateKey: string,
//   networkFee: number,
//   outputs?: UnspentOutput[],
//   extraId?: string,
//   tokenChain?: string
// }

// export interface IGetFeeParams {
//   symbol: string
//   addressFrom: string
//   addressTo: string
//   chain: string
//   amount: string
//   tokenChain?: string
//   btcLikeParams: TBtcLikeFeeParams
//   ethLikeParams: TEthLikeFeeParams
// }

// export type TBtcLikeFeeParams = {
//   outputs: UnspentOutput[]
//   customFee: TCustomFee
// }

// export type TEthLikeFeeParams = {
//   contractAddress?: string
//   decimals?: number
//   fees: TCustomFee
// }

// export type TCustomFees = {
//   utxos?: UnspentOutput[]
//   type: TFeeTypes
//   value: number
// }

// export type TGetFeeData = {
//   networkFee?: number
//   utxos?: UnspentOutput[] | CardanoUnspentTxOutput[]
//   currencyBalance?: number
//   fees?: TCustomFees[]
// }

// export type TInternalTxProps = {
//   symbol: string
//   addressFrom: string
//   addressTo: string
//   amount: number
//   privateKey: string
//   networkFee: number
//   outputs?: UnspentOutput[]
//   extraId?: string
// }
