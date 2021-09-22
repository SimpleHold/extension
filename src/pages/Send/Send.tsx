import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { BigNumber } from 'bignumber.js'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'

// Shared
import WalletCardShared from '@shared/WalletCard'
import SendFormShared from '@shared/SendForm'
import NetworkFeeShared from '@shared/NetworkFee'

// Drawers
import WalletsDrawer from '@drawers/Wallets'
import AboutFeeDrawer from '@drawers/AboutFee'

// Utils
import { toLower, toUpper, plus } from '@utils/format'
import { getBalance, getUnspentOutputs } from '@utils/api'
import { THardware, updateBalance, getWallets, IWallet } from '@utils/wallet'
import {
  getExtraIdName,
  checkWithOutputs,
  getNetworkFeeSymbol,
  validateAddress,
  formatUnit,
  getNetworkFee,
  generateExtraId,
  getFee,
  getStandingFee,
  isEthereumLike,
  checkWithZeroFee,
} from '@utils/currencies'
import { logEvent } from '@utils/amplitude'
import { setItem } from '@utils/storage'
import { getUrl, openWebPage } from '@utils/extension'
import { getDogeUtxos } from '@utils/currencies/bitcoinLike'
import { getUtxos as getVergeUtxos } from '@utils/currencies/verge'

// Hooks
import useDebounce from '@hooks/useDebounce'
import useState from '@hooks/useState'

// Config
import { getToken } from '@config/tokens'
import {
  ADDRESS_SEND,
  TRANSACTION_AUTO_FILL,
  TRANSACTION_START,
  TRANSACTION_CANCEL,
} from '@config/events'

// Types
import { ILocationState, IState, TFeeValue } from './types'

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
  feeType: 'average',
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
  isIncludeFee: false,
  isStandingFee: false,
  feeValues: [],
  timer: null,
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
    if (state.balance !== null && Number(state.amount) > 0) {
      checkAmount()
    }
  }, [state.balance, state.amount])

  React.useEffect(() => {
    loadBalance()
    getOutputs()
    checkAddress()
    checkAmount()
    onGetNetworkFee()
  }, [state.selectedAddress])

  React.useEffect(() => {
    if (state.balance && state.balance > 0 && Number(state.amount) > 0 && state.fee === 0) {
      onGetNetworkFee()
    }
  }, [state.balance])

  React.useEffect(() => {
    if (state.amount.length && Number(state.balance) > 0 && !state.amountErrorLabel) {
      if (!state.isStandingFee) {
        onGetNetworkFee()
      }

      if (symbol === 'doge') {
        onGetDogeUtxos()
      }

      if (symbol === 'xvg') {
        onGetVergeUtxos()
      }
    }
  }, [debounced])

  React.useEffect(() => {
    if (state.fee > 0 && !state.amountErrorLabel) {
      if (state.amount.length && Number(state.amount) + getNormalFee() > Number(state.balance)) {
        updateState({ amountErrorLabel: 'Insufficient funds' })
      }
    }
  }, [state.fee])

  React.useEffect(() => {
    checkAmount()
  }, [state.isIncludeFee, state.fee])

  const getCustomFee = async (): Promise<void> => {
    const customFee = await getFee(symbol, chain)

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

  const onGetDogeUtxos = (): void => {
    const utxosList = getDogeUtxos(state.outputs, state.address, state.amount)

    updateState({ utxosList })
  }

  const onGetVergeUtxos = (): void => {
    const utxosList = getVergeUtxos(state.outputs, state.address, state.amount)

    updateState({ utxosList })
  }

  const onGetNetworkFee = async (): Promise<void> => {
    if (symbol === 'doge') {
      onGetDogeUtxos()
    }

    if (symbol === 'xvg') {
      onGetVergeUtxos()
    }

    if (state.amountErrorLabel) {
      updateState({ amountErrorLabel: null })
    }

    if (state.isStandingFee || !state.amount.length) {
      return
    }

    updateState({ isFeeLoading: true })

    const withOutputs = checkWithOutputs(symbol)

    if (withOutputs) {
      updateState({ utxosList: [] })
    }

    const getTokenDecimals = tokenChain ? getToken(symbol, tokenChain)?.decimals : decimals

    const data = await getNetworkFee({
      symbol,
      addressFrom: state.selectedAddress,
      addressTo: state.address,
      chain,
      amount: state.amount,
      tokenChain,
      btcLikeParams: {
        outputs: state.outputs,
        customFee: state.customFee,
      },
      ethLikeParams: {
        contractAddress,
        decimals: getTokenDecimals,
        fees: state.customFee,
      },
    })

    updateState({ isFeeLoading: false })

    if (data) {
      if (data?.utxos && withOutputs) {
        updateState({ utxosList: data.utxos })
      }

      if (data.networkFee || data.fees?.length) {
        if (data.networkFee) {
          updateState({ fee: data.networkFee })
        }

        if (data.fees?.length) {
          const getFee = data.fees.find((value: TFeeValue) => value.type === state.feeType)

          updateState({ feeValues: data.fees })

          if (getFee) {
            updateState({
              feeValues: data.fees,
              utxosList: getFee.utxos,
              fee: getFee.value,
            })
          }
        }
      } else {
        if (Number(state.amount) > 0 && Number(state.balance) > 0) {
          setInsufficientError()
        }
      }

      if (!isNaN(Number(data.currencyBalance))) {
        updateState({ currencyBalance: data.currencyBalance })
      }

      if (isEthereumLike(symbol, tokenChain)) {
        const timer = setTimeout(() => {
          onGetNetworkFee()
        }, 5000)

        updateState({ timer })
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
    const withOutputs = checkWithOutputs(symbol)

    if (withOutputs) {
      const outputs = await getUnspentOutputs(state.selectedAddress, chain)
      updateState({ outputs })
    }
  }

  const getExtraId = (): void => {
    updateState({ extraIdName: getExtraIdName(symbol) })
  }

  const loadBalance = async (): Promise<void> => {
    updateState({
      balance: null,
      estimated: null,
    })

    const { balance, balance_usd, balance_btc } = await getBalance(
      state.selectedAddress,
      currency?.chain || tokenChain,
      tokenChain ? symbol : undefined,
      contractAddress,
      true
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
      name: TRANSACTION_CANCEL,
      properties: {
        stage: 'send',
      },
    })

    history.goBack()
  }

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const openWalletsDrawer = (): void => {
    updateState({ activeDrawer: 'wallets' })

    logEvent({
      name: TRANSACTION_AUTO_FILL,
      properties: {
        king: 'myWallet',
      },
    })
  }

  const onClickDrawerWallet = (address: string) => (): void => {
    updateState({ address })
    onCloseDrawer()
  }

  const changeWallet = (selectedAddress: string, walletName: string, hardware?: THardware) => {
    updateState({
      selectedAddress,
      walletName,
      hardware,
      utxosList: [],
      currencyBalance: null,
      outputs: [],
      feeValues: [],
    })

    if (!state.isStandingFee) {
      updateState({ fee: 0 })
    }
  }

  const onConfirm = (): void => {
    logEvent({
      name: ADDRESS_SEND,
    })

    if (state.timer) {
      clearTimeout(state.timer)
    }

    if (hardware) {
      openWebPage(getUrl('send-confirmation.html'))

      setItem(
        'sendConfirmationData',
        JSON.stringify({
          amount: Number(state.amount),
          symbol,
          networkFee: state.fee,
          networkFeeSymbol: state.feeSymbol,
          addressFrom: state.selectedAddress,
          addressTo: address,
          outputs: state.utxosList,
          chain,
          hardware,
          extraId: state.extraId,
        })
      )
    }

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
      isIncludeFee: state.isIncludeFee,
    })

    logEvent({
      name: TRANSACTION_START,
      properties: {
        fee: state.isIncludeFee ? 'incl' : 'excl',
        speed: currency?.isCustomFee ? 'fixed' : state.feeType,
      },
    })
  }

  const onGenerateExtraId = (): void => {
    const newExtraId = generateExtraId(symbol)

    if (newExtraId) {
      updateState({ extraId: newExtraId })
    }
  }

  const getNormalFee = (): number => {
    return state.isIncludeFee ? 0 : state.fee
  }

  const onSendAll = (): void => {
    if (state.balance) {
      updateState({ amount: `${getAvailableBalance()}`, isIncludeFee: true })

      logEvent({
        name: TRANSACTION_AUTO_FILL,
        properties: {
          king: 'allFunds',
        },
      })
    }
  }

  const checkAddress = (): void => {
    if (state.addressErrorLabel) {
      updateState({ addressErrorLabel: null })
    }

    if (state.address.length && !validateAddress(symbol, state.address, tokenChain)) {
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

    const getAmount = (): number => {
      let parseAmount = Number(state.amount)

      if (state.isIncludeFee) {
        parseAmount = parseAmount - state.fee
      }

      return parseAmount
    }

    if (currency) {
      let amount = getAmount()
      let minAmount: number = 0
      const getMinAmountWithFee = state.isIncludeFee ? state.fee : 0

      if (tokenChain) {
        minAmount = currency.minSendAmount || 0.001
      } else {
        amount = formatUnit(symbol, getAmount(), 'to', chain, 'ether')
        minAmount = formatUnit(symbol, currency.minSendAmount, 'from', chain, 'ether')
      }

      const minAmountWithFee = plus(minAmount, getMinAmountWithFee)

      if (amount < currency.minSendAmount) {
        return updateState({
          amountErrorLabel: `Min amount is ${minAmountWithFee} ${toUpper(symbol)}`,
        })
      }
    }
  }

  const isButtonDisabled = (): boolean => {
    const getAmount = state.isIncludeFee ? Number(state.amount) - state.fee : Number(state.amount)

    if (
      validateAddress(symbol, state.address, tokenChain) &&
      state.amount.length &&
      getAmount > 0 &&
      state.addressErrorLabel === null &&
      state.amountErrorLabel === null &&
      Number(state.balance) > 0 &&
      !state.isFeeLoading &&
      !isCurrencyBalanceError
    ) {
      if (!state.utxosList.length) {
        const withOuputs = checkWithOutputs(symbol)

        return withOuputs
      }

      if (state.fee === 0) {
        return !checkWithZeroFee(symbol)
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

  const setFeeType = (feeType: TFeeTypes): void => {
    if (state.amountErrorLabel) {
      updateState({ amountErrorLabel: null })
    }
    updateState({ feeType })

    const getFee = state.feeValues.find((value: TFeeValue) => value.type === feeType)

    if (getFee) {
      updateState({ utxosList: getFee.utxos, fee: getFee.value })
    }
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
        <Styles.Container>
          <Styles.Row>
            <WalletCardShared
              balance={state.balance}
              estimated={state.estimated}
              symbol={symbol}
              hardware={hardware}
              walletName={state.walletName}
              address={state.selectedAddress}
              name={tokenName}
              wallets={state.wallets}
              changeWallet={changeWallet}
              tokenChain={tokenChain}
            />
            <SendFormShared
              balance={state.balance}
              symbol={symbol}
              wallets={state.wallets}
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
            />
            <NetworkFeeShared
              isLoading={state.isFeeLoading}
              fee={state.fee}
              feeSymbol={state.feeSymbol}
              symbol={symbol}
              type={state.feeType}
              setType={setFeeType}
              isBalanceError={isCurrencyBalanceError && state.currencyBalance !== null}
              withButton={currency?.isCustomFee || tokenChain !== undefined}
              isIncludeFee={state.isIncludeFee}
              toggleIncludeFee={toggleIncludeFee}
              showFeeDrawer={showFeeDrawer}
              values={state.feeValues}
            />
          </Styles.Row>
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
            <Button label="Send" onClick={onConfirm} disabled={isButtonDisabled()} ml={7.5} />
          </Styles.Actions>
        </Styles.Container>
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
