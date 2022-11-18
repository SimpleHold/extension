import { Ecc } from '@fioprotocol/fiojs'
import { FIOSDK } from '@fioprotocol/fiosdk'
import fetch from 'node-fetch'
import { Transactions } from '@fioprotocol/fiosdk/lib/transactions/Transactions'
import BigNumber from 'bignumber.js'

// Utils
import { getNetworkFeeRequest, sendRequest } from '@utils/api'
import { toLower } from '@utils/format'

// Types
import { TGenerateAddress, TCurrencyConfig, TFeeProps, TInternalTxProps } from '@coins/types'
import { TFeeResponse } from '@utils/api/types'
import { TPubKeyResponse } from './types'

export const config: TCurrencyConfig = {
  coins: ['fio'],
  isInternalTx: true,
}

const ten9 = new BigNumber(10).pow(9)
const baseUrl = 'https://fio.blockpane.com/v1/'

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten9))
  }

  return Number(new BigNumber(value).multipliedBy(ten9))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const privateKey = await Ecc.randomKey()
  const address = Ecc.PrivateKey.fromString(privateKey).toPublic().toString()

  return {
    address,
    privateKey,
  }
}

export const importPrivateKey = async (privateKey: string): Promise<string | null> => {
  return Ecc.PrivateKey.fromString(privateKey).toPublic().toString()
}

export const getExplorerLink = (address: string): string => {
  return `https://fio.bloks.io/key/${address}`
}

export const getTransactionLink = (hash: string): string => {
  return `https://fio.bloks.io/transaction/${hash}`
}

const isFioAddress = (address: string): boolean => {
  return new RegExp(
    '^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))@[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))$)'
  ).test(address)
}

export const validateAddress = (address: string): boolean => {
  return Ecc.PublicKey.isValid(address) || isFioAddress(`${toLower(address)}`)
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse | null> => {
  const { addressFrom, amount, chain } = props

  return await getNetworkFeeRequest(chain, addressFrom, amount)
}

const fetchJson = async (uri: string, opts = {}) => {
  return fetch(uri, opts)
}

const getPubKey = async (fio_address: string): Promise<string | null> => {
  try {
    const request = await sendRequest<TPubKeyResponse | null>({
      url: `${baseUrl}chain/get_pub_address`,
      method: 'POST',
      data: {
        chain_code: 'FIO',
        token_code: 'FIO',
        fio_address,
      },
      skipNestedData: true,
    })

    if (request?.public_address) {
      return request.public_address
    }

    return null
  } catch {
    return null
  }
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { addressFrom, amount, privateKey, networkFee } = props

  let addressTo = props.addressTo

  if (privateKey) {
    if (isFioAddress(`${toLower(addressTo)}`)) {
      const fromPubKey = await getPubKey(addressTo)

      if (fromPubKey) {
        addressTo = fromPubKey
      } else {
        return null
      }
    }

    const data = {
      payee_public_key: addressTo,
      amount: formatValue(amount, 'to'),
      max_fee: formatValue(networkFee, 'to'),
      tpid: '',
    }

    const user = new FIOSDK('', '', baseUrl, fetchJson)

    const chainData = await user.transactions.getChainDataForTx()

    const transaction = await user.transactions.createRawTransaction({
      action: 'trnsfiopubky',
      account: 'fio.token',
      data: data,
      publicKey: addressFrom,
      chainData,
    })

    const { serializedContextFreeData, serializedTransaction } = await user.transactions.serialize({
      chainId: chainData.chain_id,
      transaction,
    })

    const transactions = new Transactions()

    const signedTransaction = await transactions.sign({
      chainId: chainData.chain_id,
      privateKeys: [privateKey],
      transaction,
      serializedTransaction,
      serializedContextFreeData,
    })

    const { transaction_id } = await user.executePreparedTrx(
      'transfer_tokens_pub_key',
      signedTransaction
    )

    return transaction_id
  }

  return null
}
