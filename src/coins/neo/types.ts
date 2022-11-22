export type SendEntryType = {
  amount: number | string
  address: string
  symbol: string
}

export type TokenBalanceType = {
  scriptHash: string
}

export type TTxConfig = {
  account: any
  address: string
  fees: number
  net: string
  privateKey: string
  publicKey: string
  url: string
  intents: any[]
  script?: string
  gas?: number
}
