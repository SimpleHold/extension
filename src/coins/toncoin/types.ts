export type TExplorerTx = {
  '@type': string
  utime: number
  data: string
  transaction_id: TLastWalletTx
  fee: string
  storage_fee: string
  other_fee: string
  in_msg: TTxMsg
  out_msgs: TTxMsg[]
}

export type TTxMsg = {
  '@type': string
  source: string
  destination: string
  value: string
  fwd_fee: string
  ihr_fee: string
  created_lt: string
  body_hash: string
  msg_data: {
    '@type': string
    body: string
    init_state: string
  }
  message: string
}

export type TLastWalletTx = {
  '@type': string
  hash: string
  lt: string
}
