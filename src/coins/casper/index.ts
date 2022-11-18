import BigNumber from 'bignumber.js'
import { Keys, decodeBase16, CasperClient, DeployUtil, CLPublicKey } from 'casper-js-sdk'

// Types
import { TGenerateAddress, TCurrencyConfig, TInternalTxProps } from '@coins/types'

export const config: TCurrencyConfig = {
  coins: ['cspr'],
  isInternalTx: true,
  extraIdName: 'Transfer ID',
}

const ten9 = new BigNumber(10).pow(9)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten9))
  }

  return Number(new BigNumber(value).multipliedBy(ten9))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const newKeys = Keys.Ed25519.new()
  const address = newKeys.publicKey.toHex()
  const privateKey = Keys.Ed25519.parsePrivateKey(newKeys.privateKey).toString('hex')

  return {
    address,
    privateKey,
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  const privateToPublicKey = Keys.Ed25519.privateToPublicKey(decodeBase16(privateKey))
  const { publicKey } = Keys.Ed25519.parseKeyPair(privateToPublicKey, decodeBase16(privateKey))

  return publicKey.toHex()
}

export const getExplorerLink = (address: string): string => {
  return `https://cspr.live/account/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://cspr.live/deploy/${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    CLPublicKey.fromHex(address)

    return true
  } catch {
    return false
  }
}

export const getStandingFee = (): number => {
  return 0.1
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { amount, privateKey, addressTo, extraId } = props

  if (!privateKey || !extraId) {
    return null
  }

  const casperClient = new CasperClient('https://node-clarity-mainnet.make.services/rpc')

  const privateToPublicKey = Keys.Ed25519.privateToPublicKey(decodeBase16(privateKey))
  const signKeyPair = Keys.Ed25519.parseKeyPair(privateToPublicKey, decodeBase16(privateKey))

  const deployParams = new DeployUtil.DeployParams(signKeyPair.publicKey, 'casper', 1, 1800000)

  const session = DeployUtil.ExecutableDeployItem.newTransfer(
    formatValue(amount, 'to'),
    CLPublicKey.fromHex(addressTo),
    null,
    extraId
  )

  const payment = DeployUtil.standardPayment(100000000)
  const deploy = DeployUtil.makeDeploy(deployParams, session, payment)
  const signedDeploy = DeployUtil.signDeploy(deploy, signKeyPair)

  return await casperClient.putDeploy(signedDeploy)
}
