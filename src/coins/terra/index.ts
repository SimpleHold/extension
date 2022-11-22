import {
  MnemonicKey,
  AccAddress,
  LCDClient,
  MsgSend,
  Fee,
  Coins,
  Coin,
} from '@terra-money/terra.js'
import { readAmount } from '@terra.kitchen/utils'
import BigNumber from 'bignumber.js'

// Utils
import { getTxParams } from '@utils/api'

// Types
import { TGenerateAddress, TInternalTxProps, TCurrencyConfig, TFeeProps } from '@coins/types'
import { TFeeResponse } from '@utils/api/types'

export const config: TCurrencyConfig = {
  coins: ['luna', 'lunc'],
  isWithPhrase: true,
  extraIdName: 'Memo',
  isInternalTx: true,
}

const ten6 = new BigNumber(10).pow(6)

export const formatValue = (value: string | number, type: 'from' | 'to'): number => {
  if (type === 'from') {
    return Number(new BigNumber(value).div(ten6))
  }

  return Number(new BigNumber(value).multipliedBy(ten6))
}

export const generateAddress = async (): Promise<TGenerateAddress | null> => {
  const { accAddress: address, mnemonic, privateKey } = new MnemonicKey()

  return {
    address,
    mnemonic,
    privateKey: privateKey.toString('hex'),
  }
}

export const importRecoveryPhrase = async (
  recoveryPhrase: string
): Promise<TGenerateAddress | null> => {
  const {
    accAddress: address,
    mnemonic,
    privateKey,
  } = new MnemonicKey({
    mnemonic: recoveryPhrase,
  })

  return {
    address,
    mnemonic,
    privateKey: privateKey.toString('hex'),
  }
}

export const getExplorerLink = (address: string, chain: string): string => {
  const network = chain === 'terra' ? 'mainnet' : 'classic'

  return `https://finder.terra.money/${network}/address/${address}`
}

export const getTransactionLink = (hash: string, chain: string): string => {
  const network = chain === 'terra' ? 'mainnet' : 'classic'

  return `https://finder.terra.money/${network}/tx/${hash}`
}

export const validateAddress = (address: string): boolean => {
  try {
    return AccAddress.validate(address)
  } catch {
    return false
  }
}

const getLCDClient = async (
  denom: string,
  chain: string,
  gasPrices: { [denom: string]: string }
): Promise<LCDClient> => {
  const chainID = chain === 'terra' ? 'phoenix-1' : 'columbus-5'
  const URL = chain === 'terra' ? 'https://phoenix-lcd.terra.dev' : 'https://columbus-lcd.terra.dev'

  return new LCDClient({
    URL,
    chainID,
    gasAdjustment: 2,
    gasPrices: { [denom]: gasPrices[denom] || 0 },
    isClassic: chain === 'terra-classic',
  })
}

const getGasAmount = (
  denom: string,
  gasPrices: { [denom: string]: string },
  estimatedGas: number
): string => {
  const gasPrice = gasPrices[denom]

  if (!gasPrice) {
    return '0'
  }

  return new BigNumber(estimatedGas).times(gasPrice).integerValue(BigNumber.ROUND_CEIL).toString()
}

export const getNetworkFee = async (props: TFeeProps): Promise<TFeeResponse | null> => {
  try {
    const { symbol, from, amount, chain } = props

    const denom = symbol === 'ustc' ? 'uusd' : 'uluna'
    const wallet = await generateAddress()

    const txParams = await getTxParams(chain)

    if (wallet && txParams) {
      const lcd = await getLCDClient(denom, chain, txParams.gasPrices)

      const unsignedTx = await lcd.tx.create([{ address: from }], {
        msgs: [
          new MsgSend(from, wallet.address, {
            [denom]: formatValue(amount, 'to'),
          }),
        ],
        feeDenoms: [denom],
      })

      return {
        networkFee: +readAmount(
          getGasAmount(denom, txParams.gasPrices, unsignedTx.auth_info.fee.gas_limit)
        ),
      }
    }

    return {
      networkFee: 0,
    }
  } catch {
    return {
      networkFee: 0,
    }
  }
}

export const createInternalTx = async (props: TInternalTxProps): Promise<string | null> => {
  const { mnemonic, addressFrom, addressTo, amount, extraId, symbol, chain } = props
  const denom = symbol === 'ustc' ? 'uusd' : 'uluna'

  const txParams = await getTxParams(chain)

  if (txParams && mnemonic) {
    const provider = await getLCDClient(denom, chain, txParams.gasPrices)

    const wallet = provider.wallet(
      new MnemonicKey({
        mnemonic,
      })
    )

    const lcd = await getLCDClient(denom, chain, txParams.gasPrices)

    const unsignedTx = await lcd.tx.create([{ address: addressFrom }], {
      msgs: [
        new MsgSend(addressFrom, addressTo, {
          [denom]: formatValue(amount, 'to'),
        }),
      ],
      feeDenoms: [denom],
    })

    const gasCoins = new Coins([
      Coin.fromData({
        amount: getGasAmount(denom, txParams.gasPrices, unsignedTx.auth_info.fee.gas_limit),
        denom,
      }),
    ])

    const tx = await wallet.createAndSignTx({
      msgs: [
        new MsgSend(addressFrom, addressTo, {
          [denom]: formatValue(amount, 'to'),
        }),
      ],
      memo: extraId,
      fee: new Fee(unsignedTx.auth_info.fee.gas_limit, gasCoins),
    })

    const { txhash } = await provider.tx.broadcast(tx)

    return txhash
  }

  return null
}
