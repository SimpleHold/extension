export type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum'

export type TChain = {
  chain: string
  ss58Format: number
  keypairType: KeypairType
  wsUrl: string
  decimals: number
  symbol: string
  path?: string
}
