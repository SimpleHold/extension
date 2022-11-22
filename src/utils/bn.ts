import BigNumber from 'bignumber.js'

export const multiplied = (from: BigNumber.Value, to: BigNumber.Value): number => {
  return new BigNumber(from).multipliedBy(to).toNumber()
}

export const minus = (from: BigNumber.Value, to: BigNumber.Value): number => {
  return new BigNumber(from).minus(new BigNumber(to)).toNumber()
}

export const minusString = (from: BigNumber.Value, to: BigNumber.Value): string => {
  return new BigNumber(from).minus(new BigNumber(to)).toString()
}

export const plus = (from: BigNumber.Value, to: BigNumber.Value): number => {
  return new BigNumber(from).plus(new BigNumber(to)).toNumber()
}

export const plusString = (from: BigNumber.Value, to: BigNumber.Value): string => {
  return new BigNumber(from).plus(new BigNumber(to)).toString()
}

export const div = (from: BigNumber.Value, to: BigNumber.Value): string => {
  return new BigNumber(from).div(new BigNumber(to)).toString()
}
