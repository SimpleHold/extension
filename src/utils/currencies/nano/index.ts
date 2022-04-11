import * as nano from 'nanocurrency'

// Utils
import { activateAccount, getNanoPow, sendNanoRpcRequest } from '@utils/api'
import { setItem } from '@utils/storage'
import { getWallets } from '@utils/wallet'
import {
  TAccountInfo,
  TActivateData,
  TBlockInfo,
  TProcessBlock,
  TReceivableResponse,
  TReceiveBlock
} from '@utils/currencies/nano/types'
import { IWallet } from '@utils/wallet'


// Types
import { BlockRepresentation, ConvertParams } from 'nanocurrency'

export const coins: string[] = ['xno']

export const generateWallet = async (): Promise<TGenerateAddress | null> => {
  try {
    const seed = await nano.generateSeed()
    const privateKey = nano.deriveSecretKey(seed, 0)
    const publicKey = nano.derivePublicKey(privateKey)
    const address = nano.deriveAddress(publicKey).replace('xrb_', 'nano_')
    if (address) {
      return {
        address,
        privateKey,
        isNotActivated: true
      }
    }
    return null
  } catch {
    return null
  }
}


export const formatValue = (value: string | number, type: 'from' | 'to'): string => {
  return nano.convert(`${value}`, <ConvertParams>{
    from: type === 'from' ? 'raw' : 'Nano',
    to: type === 'from' ? 'Nano' : 'raw'
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

    const blocks_receivable = response.blocks

    for (const link of blocks_receivable) {
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

const processBlock = async (block: BlockRepresentation, subtype: string): Promise<TProcessBlock | null> => {
  const input = {
    action: 'process',
    json_block: true,
    subtype: subtype,
    block: block
  }
  return await sendNanoRpcRequest<TProcessBlock>(input)
}


const getBlockInfo = async (hash: string): Promise<TBlockInfo | null> => {
  const input = {
    action: 'block_info',
    json_block: true,
    hash: hash
  }
  return await sendNanoRpcRequest<TBlockInfo>(input)
}

const getAccountInfo = async (address: string, representative = true): Promise<TAccountInfo | null> => {
  const input = {
    action: 'account_info',
    representative: representative,
    account: address
  }
  return await sendNanoRpcRequest<TAccountInfo>(input)
}

const getReceivableBlocks = async (address: string, count = undefined, threshold = undefined): Promise<TReceivableResponse | null> => {
  const input = {
    action: 'receivable',
    account: address,
    count: count,
    threshold: threshold
  }
  return await sendNanoRpcRequest<TReceivableResponse>(input)
}

export const activateWallet = async (chain: string, pubKey: string, privKey: string): Promise<string | null> => {
  try {
    const pubKeyFromPriv = nano.derivePublicKey(privKey)

    const data = await activateAccount<TActivateData>(chain, pubKeyFromPriv)

    if (data) {
      const { hash, representative } = data
      const address = nano.deriveAddress(pubKeyFromPriv).replace('xrb_', 'nano_')
      const result = await receiveBlock({
        address,
        pubKey: pubKeyFromPriv,
        privKey,
        blockHash: hash,
        walletActivation: { representative }
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

export const updateWalletActivationStatus = async (address: string): Promise<boolean> => {
  try {
    const wallets = getWallets()
    if (wallets?.length) {
      const findWallet = wallets.find(
        (wallet: IWallet) => wallet.address === address
      )
      if (!findWallet || !findWallet.isNotActivated) return false
      const isActivated = await getActivationStatus(address)
      if (isActivated) {
        findWallet.isNotActivated = false
        setItem('wallets', JSON.stringify(wallets))
        return true
      }
    }
    return false
  } catch {
    return false
  }
}

const receiveBlock = async ({ address, pubKey, privKey, blockHash, walletActivation }: TReceiveBlock) => {
  const link = blockHash
  const blockInfo = await getBlockInfo(link)
  const account = await getAccountInfo(address)
  if (!account || !blockInfo) return
  let subtype = 'receive'
  let representative = account.representative
  let previous = account.frontier
  let old_balance = account.balance
  let work_input = account.frontier

  if (walletActivation) {
    old_balance = '0'
    previous = '0'.padStart(64, '0')
    representative = walletActivation.representative
    work_input = pubKey
  }

  const work = await getNanoPow(work_input, subtype)
  const new_balance = stringAdd(old_balance, blockInfo.amount)
  const block = nano.createBlock(privKey, {
    work,
    previous,
    representative,
    balance: new_balance,
    link
  })
  return await processBlock(block.block, subtype)
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
    const old_balance = account.balance
    const workInput = account.frontier
    const work = await getNanoPow(workInput, subtype)
    const new_balance = stringSub(old_balance, amount)
    const block = nano.createBlock(privateKey, {
      work,
      previous,
      representative,
      balance: new_balance,
      link
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