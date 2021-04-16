export interface IContract {
  constant: boolean
  inputs: {
    internalType: 'address' | 'uint256'
    name: string
    type: 'address' | 'uint256'
  }[]
  name: string
  outputs: {
    internalType: 'bool'
    name: string
    type: 'bool'
  }[]
  payable: boolean
  stateMutability: string
  type: string
}

const contract: IContract[] = [
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export default contract
