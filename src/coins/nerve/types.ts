export type TTransferInfo = {
  fromAddress: string
  toAddress: string
  amount: number
}

export type TBalanceInfo = {
  totalBalance: number
  balance: number
  timeLock: number
  consensusLock: number
  freeze: number
  nonce: string
  nonceType: number
}
