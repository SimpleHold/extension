import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { BigNumber } from 'bignumber.js'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'

import SendFormShared from '@shared/SendForm'

// Drawers
import WalletsDrawer from '@drawers/Wallets'
import AboutFeeDrawer from '@drawers/AboutFee'

// Utils
import { toLower, toUpper } from '@utils/format'
import { getBalance, getUnspentOutputs } from '@utils/api'
import { THardware, updateBalance, getWallets, IWallet } from '@utils/wallet'
import {
  getExtraIdName,
  checkWithOuputs,
  getNetworkFeeSymbol,
  validateAddress,
  formatUnit,
  getNetworkFee,
  generateExtraId,
  getFee,
  getStandingFee,
} from '@utils/currencies'
import { logEvent } from '@utils/amplitude'

// Hooks
import useDebounce from '@hooks/useDebounce'
import useState from '@hooks/useState'

// Config
import { getToken } from '@config/tokens'
import { ADDRESS_SEND, ADDRESS_SEND_CANCEL } from '@config/events'

// Types
import { ILocationState, IState, TFees } from './types'

// Styles
import Styles from './styles'

const initialState: IState = {
  balance: null,
  estimated: null,
  selectedAddress: '',
  address: '',
  wallets: [],
  activeDrawer: null,
  walletName: '',
  hardware: undefined,
  amount: '',
  extraIdName: null,
  extraId: '',
  outputs: [],
  isFeeLoading: false,
  fee: 0,
  feeSymbol: '',
  feeType: 'slow',
  addressErrorLabel: null,
  amountErrorLabel: null,
  currencyBalance: null,
  utxosList: [],
  backTitle: '',
  customFee: {
    slow: 0,
    average: 0,
    fast: 0,
  },
  selectedFee: 0,
  isIncludeFee: false,
  isStandingFee: false,
}

const SendPage: React.FC = () => {
  const {
    state: {
      symbol,
      chain,
      tokenChain,
      contractAddress,
      tokenName,
      decimals,
      address,
      walletName,
      hardware,
      currency,
    },
  } = useLocation<ILocationState>()
  const history = useHistory()

  const { state, updateState } = useState<IState>({
    ...initialState,
    selectedAddress: address,
    walletName,
    hardware,
    backTitle: walletName,
  })

  const debounced = useDebounce(state.amount, 1000)

  React.useEffect(() => {
    getWalletsList()
    getExtraId()
    getFeeSymbol()
    getCustomFee()
    checkStangindFee()
  }, [])

  React.useEffect(() => {
    loadBalance()
    getOutputs()
    checkAddress()
    checkAmount()
  }, [state.selectedAddress])

  React.useEffect(() => {
    if (
      state.amount.length &&
      Number(state.balance) > 0 &&
      !state.amountErrorLabel &&
      !state.isStandingFee
    ) {
      updateState({ isFeeLoading: true })
      onGetNetworkFee()
    }
  }, [debounced])

  React.useEffect(() => {
    if (state.fee > 0 && !state.amountErrorLabel) {
      if (
        state.amount.length &&
        Number(state.amount) + Number(state.fee) >= Number(state.balance)
      ) {
        updateState({ amountErrorLabel: 'Insufficient funds' })
      }
    }
  }, [state.fee])

  React.useEffect(() => {}, [state.feeType])

  const getCustomFee = async (): Promise<void> => {
    const customFee = await getFee(symbol, chain, tokenChain)

    if (customFee) {
      updateState({ customFee })
    }
  }

  const checkStangindFee = (): void => {
    const data = getStandingFee(symbol)

    if (data) {
      updateState({ fee: data, isStandingFee: true })
    }
  }

  const onGetNetworkFee = async (): Promise<void> => {
    updateState({ utxosList: [] })

    const getTokenDecimals = tokenChain ? getToken(symbol, tokenChain)?.decimals : decimals
    const feePrice = state.customFee[state.feeType]

    const data = await getNetworkFee({
      symbol,
      addressFrom: state.selectedAddress,
      addressTo: state.address,
      chain,
      amount: state.amount,
      tokenChain,
      btcLikeParams: {
        outputs: state.outputs,
        feePerByte: feePrice,
      },
      ethLikeParams: {
        contractAddress,
        decimals: getTokenDecimals,
        gasPrice: feePrice,
      },
    })

    updateState({ isFeeLoading: false })

    if (data) {
      if (data?.utxos) {
        updateState({ utxosList: data.utxos })
      }

      if (data.networkFee) {
        updateState({ fee: data.networkFee })
      } else {
        if (Number(state.amount) > 0 && Number(state.balance) > 0) {
          setInsufficientError()
        }
      }

      if (typeof data.currencyBalance !== 'undefined' && !isNaN(data.currencyBalance)) {
        updateState({ currencyBalance: data.currencyBalance })
      }
    } else {
      if (Number(state.amount) > 0 && Number(state.balance) > 0) {
        setInsufficientError()
      }
    }
  }

  const setInsufficientError = (): void => {
    updateState({ amountErrorLabel: 'Insufficient funds' })
  }

  const getFeeSymbol = (): void => {
    updateState({ feeSymbol: getNetworkFeeSymbol(symbol, chain) })
  }

  const getOutputs = async (): Promise<void> => {
    const withOutputs = checkWithOuputs(chain, symbol)

    if (withOutputs) {
      const outputs = await getUnspentOutputs(state.selectedAddress, chain)
      updateState({ outputs })
    }
  }

  const getExtraId = (): void => {
    updateState({ extraIdName: getExtraIdName(symbol) })
  }

  const loadBalance = async (): Promise<void> => {
    const { balance, balance_usd, balance_btc } = await getBalance(
      state.selectedAddress,
      currency?.chain || tokenChain,
      tokenChain ? symbol : undefined,
      contractAddress
    )

    updateState({
      balance,
      estimated: balance_usd,
    })

    updateBalance(state.selectedAddress, symbol, balance, balance_btc)
  }

  const getWalletsList = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const filterWallets = walletsList.filter((wallet: IWallet) => wallet.symbol === symbol)
      updateState({ wallets: filterWallets })
    }
  }

  const onCancel = (): void => {
    logEvent({
      name: ADDRESS_SEND_CANCEL,
    })

    history.goBack()
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const openWalletsDrawer = (): void => {
    updateState({ activeDrawer: 'wallets' })
  }

  const onClickDrawerWallet = (address: string) => (): void => {
    updateState({ address })
    onCloseDrawer()
  }

  const changeWallet = (selectedAddress: string, walletName: string, hardware?: THardware) => {
    updateState({ selectedAddress, walletName, hardware })
  }

  const onConfirm = (): void => {
    logEvent({
      name: ADDRESS_SEND,
    })

    const tokenContractAddress = tokenChain ? getToken(symbol, tokenChain)?.address : undefined
    const getTokenDecimals = tokenChain ? getToken(symbol, tokenChain)?.decimals : undefined

    history.push('/send-confirm', {
      amount: Number(state.amount),
      symbol,
      networkFee: state.fee,
      networkFeeSymbol: state.feeSymbol,
      addressFrom: state.selectedAddress,
      addressTo: state.address,
      outputs: state.utxosList,
      chain,
      contractAddress: tokenContractAddress || contractAddress,
      tokenChain,
      decimals: getTokenDecimals || decimals,
      extraId: state.extraId,
      tokenName,
    })
  }

  const onGenerateExtraId = (): void => {
    const newExtraId = generateExtraId(symbol)

    if (newExtraId) {
      updateState({ extraId: newExtraId })
    }
  }

  const onSendAll = (): void => {
    if (state.balance) {
      const fee = state.isIncludeFee ? 0 : state.fee

      updateState({ amount: `${state.balance - fee}` })
    }
  }

  const checkAddress = (): void => {
    if (state.addressErrorLabel) {
      updateState({ addressErrorLabel: null })
    }

    if (state.address.length && !validateAddress(symbol, chain, state.address, tokenChain)) {
      updateState({ addressErrorLabel: 'Address is not valid' })
    }

    if (toLower(state.address) === toLower(state.selectedAddress)) {
      updateState({ addressErrorLabel: 'Address same as sender' })
    }
  }

  const getAvailableBalance = (): number => {
    if (state.balance) {
      if (toLower(symbol) === 'xrp') {
        return new BigNumber(state.balance).minus(20).toNumber()
      }
      return Number(state.balance)
    }
    return 0
  }

  const checkAmount = (): void => {
    if (state.amountErrorLabel) {
      updateState({ amountErrorLabel: null })
    }

    const availableBalance = getAvailableBalance()

    const fee = state.isIncludeFee ? 0 : state.fee

    if (state.amount.length && Number(state.amount) + Number(fee) > availableBalance) {
      return setInsufficientError()
    }

    if (currency) {
      let parseAmount: number = Number(state.amount)
      let parseMinAmount: number = 0

      if (tokenChain) {
        parseMinAmount = currency.minSendAmount || 0.001
      } else {
        parseAmount = formatUnit(symbol, state.amount, 'to', chain, 'ether')
        parseMinAmount = formatUnit(symbol, currency.minSendAmount, 'from', chain, 'ether')
      }

      if (parseAmount < currency.minSendAmount) {
        return updateState({
          amountErrorLabel: `Min amount is ${parseMinAmount} ${toUpper(symbol)}`,
        })
      }
    }
  }

  const isButtonDisabled = (): boolean => {
    if (
      validateAddress(symbol, chain, state.address, tokenChain) &&
      state.amount.length &&
      Number(state.amount) > 0 &&
      state.addressErrorLabel === null &&
      state.amountErrorLabel === null &&
      Number(state.balance) > 0 &&
      state.fee > 0 &&
      !state.isFeeLoading &&
      !isCurrencyBalanceError
    ) {
      if (!state.outputs.length) {
        const withOuputs = checkWithOuputs(chain, symbol)

        return withOuputs
      }
      return false
    }
    return true
  }

  const setAddress = (address: string): void => {
    updateState({ address })
  }

  const setAmount = (amount: string): void => {
    updateState({ amount })
  }

  const setExtraId = (extraId: string): void => {
    updateState({ extraId })
  }

  const setFeeType = (feeType: TFees): void => {
    updateState({ feeType, selectedFee: state.customFee[feeType] })
  }

  const showFeeDrawer = (): void => {
    updateState({ activeDrawer: 'aboutFee' })
  }

  const toggleIncludeFee = (): void => {
    updateState({ isIncludeFee: !state.isIncludeFee })
  }

  const isCurrencyBalanceError =
    (tokenChain !== undefined || toLower(symbol) === 'theta') &&
    state.currencyBalance !== null &&
    !state.isFeeLoading &&
    state.fee > 0 &&
    state.fee > state.currencyBalance

  return (
    <>
      <Styles.Wrapper>
        <Cover />
        <Header withBack onBack={history.goBack} backTitle={state.backTitle} />
        <SendFormShared
          balance={state.balance}
          estimated={state.estimated}
          symbol={symbol}
          hardware={state.hardware}
          walletName={state.walletName}
          selectedAddress={state.selectedAddress}
          tokenName={tokenName}
          wallets={state.wallets}
          changeWallet={changeWallet}
          tokenChain={tokenChain}
          onCancel={onCancel}
          onConfirm={onConfirm}
          isDisabled={isButtonDisabled()}
          address={state.address}
          setAddress={setAddress}
          addressErrorLabel={state.addressErrorLabel}
          openWalletsDrawer={openWalletsDrawer}
          onGenerateExtraId={onGenerateExtraId}
          checkAddress={checkAddress}
          onSendAll={onSendAll}
          extraIdName={state.extraIdName}
          extraId={state.extraId}
          setExtraId={setExtraId}
          amount={state.amount}
          setAmount={setAmount}
          amountErrorLabel={state.amountErrorLabel}
          checkAmount={checkAmount}
          isFeeLoading={state.isFeeLoading}
          fee={state.fee}
          feeSymbol={state.feeSymbol}
          feeType={state.feeType}
          setFeeType={setFeeType}
          isCurrencyBalanceError={isCurrencyBalanceError}
          currencyBalance={state.currencyBalance}
          isCustomFee={currency.isCustomFee}
          showFeeDrawer={showFeeDrawer}
          isIncludeFee={state.isIncludeFee}
          toggleIncludeFee={toggleIncludeFee}
          customFee={state.customFee}
        />
      </Styles.Wrapper>
      <WalletsDrawer
        isActive={state.activeDrawer === 'wallets'}
        onClose={onCloseDrawer}
        selectedAddress={state.selectedAddress}
        wallets={state.wallets}
        onClickWallet={onClickDrawerWallet}
      />
      <AboutFeeDrawer isActive={state.activeDrawer === 'aboutFee'} onClose={onCloseDrawer} />
    </>
  )
}

export default SendPage
