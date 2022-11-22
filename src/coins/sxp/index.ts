// import * as bip39 from 'bip39'
// import BigNumber from 'bignumber.js'

// // Utils
// import { getNetworkFeeRequest, getAddressNonce, sendRawTransaction } from '@utils/api'

// // Types
// import { TGenerateAddress, TCurrencyConfig, TFeeProps, TInternalTxProps } from '@coins/types'
// import { TFeeResponse } from '@utils/api/types'

// export const config: TCurrencyConfig = {
//   coins: ['sxp'],
//   wordsSize: [12],
//   isWithPhrase: true,
//   isInternalTx: true,
//   extraIdName: 'Memo',
// }

// const ten8 = new BigNumber(10).pow(8)
// // const { pubKeyHash } = Networks.mainnet.network

// export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
//   if (type === 'from') {
//     return Number(new BigNumber(value).div(ten8))
//   }

//   return Number(new BigNumber(value).multipliedBy(ten8))
// }

// export const generateAddress = async (): Promise<TGenerateAddress | null> => {
//     const x = require('')
//     // import { Identities, Networks, Transactions, Managers } from '@solar-network/crypto'
//   const mnemonic = bip39.generateMnemonic()
//   const { privateKey } = Identities.Keys.fromPassphrase(mnemonic)
//   const address = Identities.Address.fromPassphrase(mnemonic, pubKeyHash)

//   return {
//     address,
//     mnemonic,
//     privateKey,
//   }
// }

// export const importRecoveryPhrase = async (mnemonic: string): Promise<TGenerateAddress | null> => {
//   const { privateKey } = Identities.Keys.fromPassphrase(mnemonic)
//   const address = Identities.Address.fromPassphrase(mnemonic, pubKeyHash)

//   return {
//     address,
//     mnemonic,
//     privateKey,
//   }
// }

// export const getExplorerLink = (address: string): string => {
//   return `https://explorer.solar.org/wallets/${address}`
// }

// export const getTransactionLink = (hash: string): string => {
//   return `https://explorer.solar.org/transactions/${hash}`
// }

// export const validateAddress = (address: string): boolean => {
//   return Identities.Address.validate(address, pubKeyHash)
// }

// export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse | null> => {
//   const { addressFrom, amount, chain } = props

//   return await getNetworkFeeRequest(chain, addressFrom, amount)
// }

// export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
//   const { mnemonic, addressFrom, addressTo, amount, networkFee, extraId } = props

//   if (!mnemonic) {
//     return null
//   }

//   Managers.configManager.setFromPreset('mainnet')

//   Transactions.TransactionRegistry

//   const nonce = await getAddressNonce('sxp', addressFrom)

//   const transaction = Transactions.BuilderFactory.transfer()
//     .version(3)
//     .nonce(nonce)
//     .recipientId(addressTo)
//     .amount(`${formatValue(amount, 'to')}`)
//     .fee(`${formatValue(networkFee, 'to')}`)
//     .memo(extraId || '')
//     .sign(mnemonic)
//     .build()

//   return await sendRawTransaction('', 'sxp', transaction.toJson())
// }

export {}
