import BigNumber from 'bignumber.js'

bitcore.Networks.add({
  name: 'reddcoin',
  alias: 'rdd',
  pubkeyhash: 0x3d,
  privatekey: 0xbd,
  scripthash: 0x05,
  dnsSeeds: ['seed.reddcoin.com'],
})

const ten8 = new BigNumber(10).pow(8)

const network = bitcore.Networks.get('reddcoin')

export const coins: string[] = ['rdd']

export const generateWallet = (): TGenerateAddress | null => {
  try {
    const privateKey = new bitcore.PrivateKey(network)

    return {
      address: privateKey.toAddress().toString(),
      privateKey: privateKey.toWIF(),
    }
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    return new bitcore.PrivateKey(privateKey, network).toAddress().toString()
  } catch {
    return null
  }
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten8))
  }

  return Number(new BigNumber(value).multipliedBy(ten8))
}
