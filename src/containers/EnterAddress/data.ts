export type TCheckEmptyBalance = {
  chain: string
  minAmount: number
  symbol: string
  warning: string
}

export const checkEmptyBalances: TCheckEmptyBalance[] = [
  {
    chain: 'polkadot',
    minAmount: 1,
    symbol: 'dot',
    warning:
      "You are sending funds to an inactive account. According to the network's requirements, the minimum transfer amount to an inactive account is 1 DOT",
  },
  {
    chain: 'near',
    minAmount: 0.02,
    symbol: 'near',
    warning:
      "You are sending funds to an inactive account. According to the network's requirements, the minimum transfer amount to an inactive account is 0.02 NEAR",
  },
]

export const warnings = {
  dot: 'Balance after the operation: less than 1 DOT. Polkadot archives addresses with a balance of less than 1 DOT with a loss of funds. We recommend changing the amount',
}
