export type TPayment = {
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
