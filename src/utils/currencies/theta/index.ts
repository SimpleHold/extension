import * as thetajs from '@thetalabs/theta-js'
import { BigNumber } from 'bignumber.js'

// Utils
import { fromEther } from '@utils/currencies/ethereumLike'

export const coins = ['theta', 'tfuel']

const ten18 = new BigNumber(10).pow(18)

export const toTheta = (value: number | string): number => {
  return Number(new BigNumber(value).multipliedBy(ten18))
}

export const fromTheta = (value: number | string): number => {
  return Number(new BigNumber(value).div(ten18))
}

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const wallet = thetajs.Wallet.createRandom()

    return {
      address: wallet.address,
      privateKey: wallet._signingKey().privateKey,
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    const wallet = new thetajs.Wallet(privateKey)
    return wallet.address
  } catch {
    return null
  }
}

export const getBalance = async (
  address: string,
  coin: 'theta' | 'tfuel'
): Promise<number | null> => {
  try {
    const chainId = thetajs.networks.ChainIds.Mainnet
    const provider = new thetajs.providers.HttpProvider(chainId)

    const { coins } = await provider.getAccount(address)

    if (coin === 'theta') {
      return fromEther(coins.thetawei)
    }

    return fromEther(coins.tfuelwei)
  } catch {
    return null
  }
}

export const createTransaction = async (
  currency: string,
  from: string,
  to: string,
  amount: string | number,
  privateKey: string
): Promise<string | null> => {
  try {
    const thetaWeiToSend =
      currency === 'theta' ? new BigNumber(amount).multipliedBy(ten18) : new BigNumber(0)
    const tfuelWeiToSend =
      currency === 'tfuel' ? new BigNumber(amount).multipliedBy(ten18) : new BigNumber(0)

    const transaction = new thetajs.transactions.SendTransaction({
      from,
      outputs: [
        {
          address: to,
          thetaWei: thetaWeiToSend,
          tfuelWei: tfuelWeiToSend,
        },
      ],
    })

    const provider = new thetajs.providers.HttpProvider(thetajs.networks.ChainIds.Mainnet)
    const wallet = new thetajs.Wallet(privateKey, provider)
    const result = await wallet.sendTransaction(transaction)

    if (result?.hash) {
      return result.hash
    }
    return null
  } catch {
    return null
  }
}

export const getTransactionLink = (hash: string): string => {
  return `https://explorer.thetatoken.org/txs/${hash}`
}

export const getExplorerLink = (address: string): string => {
  return `https://explorer.thetatoken.org/account/${address}`
}
