import BigNumber from 'bignumber.js'
import { AptosAccount, CoinClient, AptosClient } from 'aptos'

// Types
import { TGenerateAddress, TCurrencyConfig, TInternalTxProps } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: ['apt'],
  isInternalTx: true,
  isFeeApproximate: true,
}

const ten8 = new BigNumber(10).pow(8)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten8))
  }

  return Number(new BigNumber(value).multipliedBy(ten8))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const account = new AptosAccount()

  const { address, privateKeyHex: privateKey } = account.toPrivateKeyObject()

  if (address) {
    return {
      address,
      privateKey,
    }
  }

  return null
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  const account = AptosAccount.fromAptosAccountObject({
    privateKeyHex: privateKey,
  })

  return account.address().hex()
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.aptoslabs.com/account/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.aptoslabs.com/txn/${hash}`
}

export const validateAddress = (address: string): boolean => {
  return new RegExp('^(0x)[0-9A-Za-z]{64}$').test(address)
}

export const getStandingFee = (): number => {
  return 0.005
}

const getAddressBalance = async (address: string, coinClient: CoinClient): Promise<number> => {
  try {
    const checkBalance = await coinClient.checkBalance(new AptosAccount(undefined, address))

    return Number(checkBalance)
  } catch {
    return 0
  }
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { amount, privateKey, addressTo, addressFrom } = props

  if (!privateKey) {
    return null
  }

  const aptosClient = new AptosClient('https://fullnode.mainnet.aptoslabs.com')
  const coinClient = new CoinClient(aptosClient)

  const from = AptosAccount.fromAptosAccountObject({
    privateKeyHex: privateKey,
  })
  const to = new AptosAccount(undefined, addressTo)

  const checkBalance = await getAddressBalance(addressTo, coinClient)

  if (Number(checkBalance) === 0) {
    const rawTx = await aptosClient.generateTransaction(addressFrom, {
      function: '0x1::aptos_account::transfer',
      type_arguments: [],
      arguments: [addressTo, formatValue(amount, 'to')],
    })

    const signTx = await aptosClient.signTransaction(from, rawTx)
    const { hash } = await aptosClient.submitTransaction(signTx)

    return hash
  } else {
    return await coinClient.transfer(from, to, formatValue(amount, 'to'), {
      gasUnitPrice: BigInt(100),
    })
  }
}
