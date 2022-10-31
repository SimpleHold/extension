// Types
import { TUnspentOutput } from '@coins/types'
import { TFeeTypes } from '@utils/api/types'

export type TTabInfo = {
  favIconUrl: string
  url: string
}

export type TFeeValue = {
  utxos?: TUnspentOutput[]
  type: TFeeTypes
  value: number
}
