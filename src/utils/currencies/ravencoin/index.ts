import { Buffer } from 'buffer'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import * as Devkit from 'ravencore-lib'

// Utils
import { getBalance, getVechainParams, getVechainFee } from '@utils/api'
import { toLower, toUnit } from '@utils/format'

// Config
import contractABI from '@config/contractABI'

// Types
import { TGetFeeData } from '../types'
import axios from 'axios'

const ten18 = new BigNumber(10).pow(18)
// const providerUrl = 'https://mainnet.veblocks.net/'

export const coins: string[] = ['rvn']

export const generateWallet = (): TGenerateAddress | null => {
  try {


    // return {
    //   privateKey: privKey.toString('hex'),
    //   address,
    // }
    return null
  } catch {
    return null
  }
}

export const importPrivateKey = (privateKey: string): string | null => {
  try {


    return ''
  } catch {
    return null
  }
}
export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten18))
  }

  return Number(new BigNumber(value).multipliedBy(ten18))
}

export const getExplorerLink = (address: string): string => {
  return `https://rvn.tokenview.com/en/address/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://rvn.tokenview.com/en/tx/${hash}`
}

export const getNetworkFee = async (
  from: string,
  to: string,
  amount: string,
  chain: string
): Promise<TGetFeeData> => {
  try {

    return {
      // networkFee: fee,
      // currencyBalance,
    }
  } catch {
    return {
      networkFee: 0,
    }
  }
}



export const createTransaction = async (
  from: string,
  to: string,
  value: string,
  privateKey: string,
  symbol: string
): Promise<string | null> => {
  try {

    // return `0x${tx.encode().toString('hex')}`
    return ''
  } catch {
    return null
  }
}
