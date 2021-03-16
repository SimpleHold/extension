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

export interface IRawTransaction {
  hash: string
  raw: string
}

export interface IBitcoreUnspentOutput {
  address: string
  txId: string
  outputIndex: number
  script: string
  satoshis: number
}

export const getBalance = (address: string, chain: string): Promise<number> | number | null => {
  try {
    return fetch(`http://localhost:8080/wallet/balance/${chain}/${address}`)
      .then((response) => response.json())
      .then((data) => {
        return data?.data?.balance || 0
      })
  } catch {
    return null
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

export const generateWallet = (provider: any) => {
  const privateKey = new provider.PrivateKey()

  return {
    address: privateKey.toAddress().toString(),
    privateKey: privateKey.toWIF(),
  }
}

export const importAddress = (provider: any, privateKey: string) => {
  try {
    return new provider.PrivateKey(privateKey).toAddress().toString()
  } catch {
    return null
  }
}

// const { Transaction, Unit, PrivateKey } = require('bitcore-lib')

// function createTransaction(outputs, to, amount, fee, changeAddress, privateKey) {
//   try {
//     const transaction = new Transaction()
//       .from(outputs)
//       .to(to, amount)
//       .fee(fee)
//       .change(changeAddress)
//       .sign(privateKey)

//     return {
//       raw: transaction.serialize(),
//       hash: transaction.hash,
//     }
//   } catch {
//     return null
//   }
// }

// function getTransactionSize(outputs) {
//   try {
//     return new Transaction().from(outputs).toString().length
//   } catch (err) {
//     return 0
//   }
// }

// function btcToSat(value) {
//   return Unit.fromBTC(value).toSatoshis()
// }

// function satToBtc(value) {
//   return Unit.fromSatoshis(value).toBTC()
// }
