export type TTabInfo = {
  favIconUrl: string
  url: string
}

export type TFeeValue = {
  utxos?: UnspentOutput[]
  type: TFeeTypes
  value: number
}
