import * as React from 'react'
import { makeAutoObservable } from 'mobx'

// Utils
import { toLower } from '@utils/format'
import { IWallet } from '@utils/wallet'
import { getItem } from '@utils/storage'

// Config
import { getCurrencyInfo, getCurrencyByChain } from '@config/currencies/utils'
import { fees } from './data'

// Types
import { TFee, TFeeTypes } from '@utils/api/types'
import { TWarning, TSendCurrency, TDrawerTypes, TExternalStoreData } from './types'
import { TUnspentOutput } from '@coins/types'

class SendStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  activeDrawer: TDrawerTypes = null
  fee: number = 0
  isCurrencyBalanceError: boolean = false
  wallet: IWallet | null = null
  feeSymbol: string = ''
  currencyBalance: number | null = null
  isFeeLoading: boolean = false
  isZeroFee: boolean = false
  feeType: TFeeTypes = 'average'
  amount: string = ''
  balance: string = ''
  warning: TWarning | null = null
  currencyInfo: TSendCurrency | null = null
  drawerWallets: IWallet[] = []
  fees: TFee[] = fees
  utxos: TUnspentOutput[] = []
  coinPrice: number = 0
  isBalanceLoading: boolean = false

  setBalanceLoading(isBalanceLoading: boolean) {
    this.isBalanceLoading = isBalanceLoading
  }

  setCoinPrice(coinPrice: number) {
    this.coinPrice = coinPrice
  }

  setStoreData(data: TExternalStoreData) {
    const { fee, feeSymbol, balance, utxos, coinPrice } = data

    this.fee = fee
    this.feeSymbol = feeSymbol
    this.balance = balance
    this.utxos = utxos
    this.coinPrice = coinPrice
  }

  setBalance(balance: string) {
    this.balance = balance
  }

  getDrawerWallets() {
    const walletsList = getItem('wallets')
    const activeWallet = this.wallet

    if (walletsList && activeWallet) {
      const parsedWallets: IWallet[] = JSON.parse(walletsList)

      const filter = parsedWallets.filter(
        (item) =>
          !item.isNotActivated &&
          toLower(item.symbol) === toLower(activeWallet.symbol) &&
          toLower(item.chain) === toLower(activeWallet.chain)
      )

      this.drawerWallets = filter
    }
  }

  setWallet(wallet: IWallet) {
    this.wallet = wallet

    this.checkCurrencyBalance()
    this.getCoinInfo()
    this.getDrawerWallets()
  }

  getCoinInfo() {
    if (this.wallet) {
      const { chain, symbol } = this.wallet

      const coinInfo = chain ? getCurrencyByChain(chain) : getCurrencyInfo(symbol)

      if (coinInfo) {
        const { minSendAmount } = coinInfo

        this.currencyInfo = {
          minSendAmount,
          symbol,
          chain: coinInfo.chain,
          tokenChain: chain,
        }
      }
    }
  }

  setWarning(warning: TWarning | null) {
    this.warning = warning
  }

  setAmount(amount: string) {
    this.amount = amount.replace(',', '.')

    this.checkCurrencyBalance()
  }

  setFeeType(feeType: TFeeTypes) {
    this.feeType = feeType
  }

  setZeroFee(isZeroFee: boolean) {
    this.isZeroFee = isZeroFee
  }

  setActiveDrawer(activeDrawer: TDrawerTypes) {
    this.activeDrawer = activeDrawer
  }

  checkCurrencyBalance() {
    const isError =
      this.wallet !== null &&
      toLower(this.feeSymbol) !== toLower(this.wallet.symbol) &&
      this.currencyBalance !== null &&
      !this.isFeeLoading &&
      this.fee > 0 &&
      this.fee > this.currencyBalance

    this.isCurrencyBalanceError = isError
  }

  setFee(fee: number) {
    this.fee = fee

    this.checkCurrencyBalance()
  }

  setFees(fees: TFee[]) {
    this.fees = fees

    this.checkCurrencyBalance()
  }

  setFeeSymbol(feeSymbol: string) {
    this.feeSymbol = feeSymbol

    this.checkCurrencyBalance()
  }

  setUtxos(utxos: TUnspentOutput[]) {
    this.utxos = utxos
  }

  setFeeLoading(isFeeLoading: boolean) {
    this.isFeeLoading = isFeeLoading

    this.checkCurrencyBalance()
  }

  setCurrencyBalance(currencyBalance: number | null) {
    this.currencyBalance = currencyBalance

    this.checkCurrencyBalance()
  }
}

export const sendStore = new SendStore()
export const useSendStore = () => React.useContext(React.createContext(sendStore))
