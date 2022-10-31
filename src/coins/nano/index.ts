import * as nano from 'nanocurrency'
import { BlockRepresentation, ConvertParams } from 'nanocurrency'

// Utils
import { activateAccount, getNanoPow, sendNanoRpcRequest } from '@utils/api'

// Types
import { TGenerateAddress, TCurrencyConfig } from '@coins/types'
import {
  TAccountInfo,
  TActivateData,
  TBlockInfo,
  TProcessBlock,
  TReceivableResponse,
  TReceiveBlock,
} from './types'

export const config: TCurrencyConfig = {
  coins: ['xno'],
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  try {
    const seed = await nano.generateSeed()
    const privateKey = nano.deriveSecretKey(seed, 0)
    const publicKey = nano.derivePublicKey(privateKey)
    const address = nano.deriveAddress(publicKey)
    const formatAddress = getFormatAddress(address)
    if (address) {
      return {
        address: formatAddress,
        privateKey,
        isNotActivated: true,
      }
    }
    return null
  } catch {
    return null
  }
}

const getFormatAddress = (address: string) => {
  if (address.slice(0, 3).toLowerCase() === 'xrb') {
    return 'nano' + address.slice(3)
  }
  return address
}

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  return +nano.convert(`${value}`, <ConvertParams>{
    from: type === 'from' ? 'raw' : 'Nano',
    to: type === 'from' ? 'Nano' : 'raw',
  })
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {
    const publicKey = nano.derivePublicKey(privateKey)
    const address = nano.deriveAddress(publicKey)

    if (address) {
      return address
    }

    return null
  } catch {
    return null
  }
}

export const validateAddress = (address: string): boolean => nano.checkAddress(address)

export const getExplorerLink = (address: string): string => {
  return `https://nanocrawler.cc/explorer/account/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://nanocrawler.cc/explorer/block/${hash}`
}

export const getPubKeyFromPriv = (privateKey: string): string | null => {
  try {
    const publicKey = nano.derivePublicKey(privateKey)

    if (publicKey) {
      return publicKey
    }

    return null
  } catch {
    return null
  }
}

export const receiveAllPendingTxs = async (address: string, privKey: string): Promise<boolean> => {
  try {
    let isReceived = false
    const pubKey = nano.derivePublicKey(privKey)
    const response = await getReceivableBlocks(address)

    if (!response) return false

    const receivableBlocks = response.blocks

    for (const link of receivableBlocks) {
      let response = await receiveBlock({ address, pubKey, privKey, blockHash: link })
      if (response && response.hash !== undefined) {
        isReceived = true
      }
    }
    return isReceived
  } catch {
    return false
  }
}

export const getStandingFee = (): number => {
  return 0
}

const processBlock = async (
  block: BlockRepresentation,
  subtype: string
): Promise<TProcessBlock | null> => {
  const input = {
    action: 'process',
    json_block: true,
    subtype,
    block,
  }
  return await sendNanoRpcRequest<TProcessBlock>(input)
}

const getBlockInfo = async (hash: string): Promise<TBlockInfo | null> => {
  const input = {
    action: 'block_info',
    json_block: true,
    hash,
  }
  return await sendNanoRpcRequest<TBlockInfo>(input)
}

const getAccountInfo = async (
  address: string,
  representative = true
): Promise<TAccountInfo | null> => {
  const input = {
    action: 'account_info',
    account: address,
    representative,
  }
  return await sendNanoRpcRequest<TAccountInfo>(input)
}

const getReceivableBlocks = async (
  address: string,
  count = undefined,
  threshold = undefined
): Promise<TReceivableResponse | null> => {
  const input = {
    action: 'receivable',
    account: address,
    count,
    threshold,
  }
  return await sendNanoRpcRequest<TReceivableResponse>(input)
}

export const activateWallet = async (
  chain: string,
  pubKey: string,
  privKey: string
): Promise<string | null> => {
  try {
    const pubKeyFromPriv = nano.derivePublicKey(privKey)

    const data = await activateAccount<TActivateData>(chain, pubKeyFromPriv)

    if (data) {
      const { hash, representative } = data
      const address = nano.deriveAddress(pubKeyFromPriv)
      const formatAddress = getFormatAddress(address)
      const result = await receiveBlock({
        address: formatAddress,
        pubKey: pubKeyFromPriv,
        privKey,
        blockHash: hash,
        walletActivation: { representative },
      })
      if (result) {
        return address
      }
    }
    return null
  } catch {
    return null
  }
}

export const getActivationStatus = async (address: string): Promise<boolean> => {
  try {
    const account = await getAccountInfo(address)
    if (account) {
      return account.balance !== undefined
    }
    return false
  } catch {
    return false
  }
}

const receiveBlock = async ({
  address,
  pubKey,
  privKey,
  blockHash,
  walletActivation,
}: TReceiveBlock): Promise<TProcessBlock | null> => {
  try {
    const link = blockHash
    const blockInfo = await getBlockInfo(link)
    let subtype = 'receive'

    if (!blockInfo) return null

    let representative: string
    let previous: string
    let oldBalance: string
    let workInput: string

    if (walletActivation) {
      representative = walletActivation.representative
      workInput = pubKey
      oldBalance = '0'
      previous = '0'.padStart(64, '0')
    } else {
      const account = await getAccountInfo(address)
      if (!account) return null
      representative = account.representative
      previous = account.frontier
      oldBalance = account.balance
      workInput = account.frontier
    }

    const work = await getNanoPow(workInput, subtype)
    const balance = stringAdd(oldBalance, blockInfo.amount)
    const block = nano.createBlock(privKey, {
      work,
      previous,
      representative,
      balance,
      link,
    })
    return await processBlock(block.block, subtype)
  } catch {
    return null
  }
}

export const stringSub = (n1: string, n2: string, pad = 0) => {
  return (BigInt(n1) - BigInt(n2)).toString().padStart(pad, '0')
}

export const stringAdd = (n1: string, n2: string, pad = 0) => {
  return (BigInt(n1) + BigInt(n2)).toString().padStart(pad, '0')
}

export const createTransaction = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  privateKey: string
): Promise<string | null> => {
  try {
    const account = await getAccountInfo(fromAddress)
    if (!account) return null
    const subtype = 'send'
    const link = toAddress
    const representative = account.representative
    const previous = account.frontier
    const oldBalance = account.balance
    const workInput = account.frontier
    const work = await getNanoPow(workInput, subtype)
    const balance = stringSub(oldBalance, amount)
    const block = nano.createBlock(privateKey, {
      work,
      previous,
      representative,
      balance,
      link,
    })

    const response = await processBlock(block.block, subtype)
    if (response) {
      const { hash } = response
      return hash
    }
    return null
  } catch {
    return null
  }
}
