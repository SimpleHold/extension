import axios from 'axios'

export interface IUnspentOutput {
  tx_hash_big_endian: string
  tx_hash: string
  tx_output_n: number
  script: string
  value: number
  value_hex: string
  confirmations: number
  tx_index: number
}

export const getBalance = (address: string): Promise<number> | number => {
  try {
    return fetch(`https://blockchain.info/balance?active=${address}`)
      .then((response) => response.json())
      .then((data) => {
        return data[address].final_balance / 100000000
      })
  } catch {
    return 0
  }
}

export const getEstimated = (amount: number): Promise<number> | number => {
  try {
    if (amount === 0) {
      return 0
    }
    return fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
      .then((response) => response.json())
      .then((data) => {
        return data['USD'] * amount
      })
  } catch {
    return 0
  }
}

export const getUnspentOutputs = async (address: string): Promise<IUnspentOutput[]> => {
  try {
    const { data } = await axios.get(`https://blockchain.info/unspent?active=${address}`)

    return data?.unspent_outputs
  } catch {
    return []
  }
}

export const createTransaction = (
  outputs: any[],
  to: string,
  amount: number,
  fee: number,
  changeAddress: string,
  privateKey: string
) => {
  try {
    // const transaction = new bitcore.Transaction()
    //   .from(outputs)
    //   .to(to, amount)
    //   .fee(fee)
    //   .change(changeAddress)
    //   .sign(privateKey)

    // return {
    //   raw: transaction.serialize(),
    //   hash: transaction.hash,
    // }
    return null
  } catch (err) {
    console.log('err', err)
    return null
  }
}

export const getTransactionOutputsSize = (): number => {
  try {
    return 0 //new bitcore.Transaction().from(outputs).toString().length
  } catch {
    return 0
  }
}

export const sendRawTransaction = async (transaction: string): Promise<string | null> => {
  try {
    const { data } = await axios.post(
      'https://btc.getblock.io',
      {
        jsonrpc: '2.0',
        id: +new Date(),
        method: 'sendrawtransaction',
        params: [transaction],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '51cbe972-73ce-4b49-a602-651ee065dd3f',
        },
      }
    )

    return data?.result || null
  } catch {
    return null
  }
}

export const getFees = async (): Promise<number> => {
  try {
    const { data } = await axios.get('https://api.blockchain.info/mempool/fees')

    return data.regular || 0
  } catch {
    return 0
  }
}

export const btcToSat = (amount: number): number => {
  return 0 //Unit.fromBTC(amount).toSatoshis()
}
