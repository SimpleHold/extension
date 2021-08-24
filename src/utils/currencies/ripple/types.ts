export interface ITxParams {
  fee: string
  sequence: number
  maxLedgerVersion: number
}

export interface IPayment {
  source: {
    address: string
    maxAmount: {
      value: string
      currency: string
    }
  }
  destination: {
    address: string
    amount: {
      value: string
      currency: string
    }
    tag?: number
  }
}
