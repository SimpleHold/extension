export type TCardanoUnspentTxOutput = {
  ctaAddress: string
  ctaAmount: {
    getCoin: string
  }
  ctaTxHash: string
  ctaTxIndex: number
}
