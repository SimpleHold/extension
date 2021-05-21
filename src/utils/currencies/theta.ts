import * as thetajs from '@thetalabs/theta-js'

// Utils
import { fromWei } from '@utils/web3'

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
      return fromWei(coins.thetawei, 'ether')
    }

    return fromWei(coins.tfuelwei, 'ether')
  } catch {
    return null
  }
}
