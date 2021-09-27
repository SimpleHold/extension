import * as React from 'react'
import { render } from 'react-dom'
import { BigNumber } from 'bignumber.js'
import { browser } from 'webextension-polyfill-ts'
import SVG from 'react-inlinesvg'

// Components
import Button from '@components/Button'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Drawers
import WalletsDrawer from '@drawers/Wallets'
import AboutFeeDrawer from '@drawers/AboutFee'

// Shared
import WalletCardShared from '@shared/WalletCard'
import SendFormShared from '@shared/SendForm'
import NetworkFeeShared from '@shared/NetworkFee'

// Utils
import { getWallets, IWallet, getWalletName } from '@utils/wallet'
import { getBalance, getUnspentOutputs } from '@utils/api'
import { getCurrentTab, updateTab, getUrl } from '@utils/extension'
import { toLower, toUpper, plus } from '@utils/format'
import {
  validateAddress,
  formatUnit,
  getNetworkFeeSymbol,
  getExtraIdName,
  generateExtraId,
  getNetworkFee,
  getFee,
  getStandingFee,
  checkWithOutputs,
  isEthereumLike,
  checkWithZeroFee,
} from '@utils/currencies'
import { getItem, setItem, removeItem } from '@utils/storage'
import { getDogeUtxos } from '@utils/currencies/bitcoinLike'
import { logEvent } from '@utils/amplitude'
import { getUtxos as getVergeUtxos } from '@utils/currencies/verge'

// Config
import { getCurrency, ICurrency } from '@config/currencies'
import { getToken } from '@config/tokens'
import { TRANSACTION_AUTO_FILL, TRANSACTION_START, TRANSACTION_CANCEL } from '@config/events'

// Hooks
import useDebounce from '@hooks/useDebounce'
import useState from '@hooks/useState'

// Types
import { IState } from './types'
import { TFeeValue } from '@shared/types'

// Styles
import Styles from './styles'

const initialState: IState = {
  address: '',
  amount: '',
  walletsList: [],
  selectedWallet: null,
  currencyInfo: null,
  balance: null,
  estimated: null,
  addressErrorLabel: null,
  tabInfo: null,
  props: {},
  fee: 0,
  isFeeLoading: false,
  amountErrorLabel: null,
  outputs: [],
  feeSymbol: '',
  utxosList: [],
  currencyBalance: 0,
  extraId: '',
  extraIdName: '',
  isDraggable: false,
  isIncludeFee: false,
  feeType: 'average',
  customFee: {
    slow: 0,
    average: 0,
    fast: 0,
  },
  selectedFee: 0,
  activeDrawer: null,
  feeValues: [],
  walletName: '',
  walletsNotFound: false,
  isStandingFee: false,
  timer: null,
}

const Send: React.FC = () => {
  const { state, updateState } = useState<IState>(initialState)
  const debounced = useDebounce(state.amount, 1000)

  React.useEffect(() => {
    getWalletsList(getItem('sendPageProps'))
    getStorageData()
    getQueryParams()
  }, [])

  React.useEffect(() => {
    if (state.selectedWallet) {
      getCurrencyInfo()
      getCurrencyBalance()
      checkAddress()
      onGetNetworkFeeSymbol()
      getExtraId()
      setWalletName()
      checkStangindFee()
      getCustomFee()
    }
  }, [state.selectedWallet])

  React.useEffect(() => {
    if (state.balance && state.balance > 0 && Number(state.amount) > 0 && state.fee === 0) {
      onGetNetworkFee()
    }
  }, [state.balance])

  React.useEffect(() => {
    checkProps()
  }, [state.props])

  React.useEffect(() => {
    if (
      state.amount.length &&
      Number(state.balance) > 0 &&
      !state.amountErrorLabel &&
      state.selectedWallet
    ) {
      if (!state.isStandingFee) {
        onGetNetworkFee()
      }

      if (toLower(state.selectedWallet.symbol) === 'doge') {
        onGetDogeUtxos()
      }

      if (toLower(state.selectedWallet.symbol) === 'xvg') {
        onGetVergeUtxos()
      }
    }
  }, [debounced])

  React.useEffect(() => {
    if (state.balance !== null) {
      checkAmount()
      checkAddress()
    }
  }, [state.balance])

  React.useEffect(() => {
    if (state.isFeeLoading && state.amountErrorLabel) {
      updateState({ isFeeLoading: false })
    }
  }, [state.isFeeLoading, state.amountErrorLabel])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event

      if (key === 'Escape' || key === 'Esc') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  React.useEffect(() => {
    checkAmount()
  }, [state.isIncludeFee, state.fee])

  const checkStangindFee = (): void => {
    if (state.selectedWallet) {
      const { symbol } = state.selectedWallet

      const data = getStandingFee(symbol)

      if (data) {
        updateState({ fee: data, isStandingFee: true })
      }
    }
  }

  const getQueryParams = (): void => {
    const searchParams = new URLSearchParams(location.search)

    const queryDraggable = searchParams.get('isDraggable')

    if (queryDraggable === 'true') {
      updateState({ isDraggable: true })
    }
  }

  const getExtraId = (): void => {
    if (state.selectedWallet) {
      const extraIdName = getExtraIdName(state.selectedWallet.symbol)

      if (extraIdName) {
        updateState({ extraIdName })
      }
    }
  }

  const getOutputs = async (info: ICurrency): Promise<void> => {
    if (state.selectedWallet) {
      const { symbol, address } = state.selectedWallet
      const { chain } = info

      const withOutputs = checkWithOutputs(symbol)

      if (withOutputs) {
        const outputs = await getUnspentOutputs(address, chain)

        updateState({ outputs })
      }
    }
  }

  const onGetNetworkFeeSymbol = () => {
    if (state.selectedWallet) {
      const { chain, symbol } = state.selectedWallet

      const feeSymbol = getNetworkFeeSymbol(symbol, chain)

      updateState({ feeSymbol })
    }
  }

  const getCustomFee = async (): Promise<void> => {
    if (state.selectedWallet) {
      const { symbol, chain } = state.selectedWallet

      const currencyInfo = chain ? getToken(symbol, chain) : getCurrency(symbol)

      if (currencyInfo) {
        const customFee = await getFee(symbol, currencyInfo.chain)

        if (customFee) {
          updateState({ customFee })
        }
      }
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
    if (!state.selectedWallet) {
      return
    }

    if (state.amountErrorLabel) {
      updateState({ amountErrorLabel: null })
    }

    const { symbol, chain, decimals, contractAddress, address } = state.selectedWallet

    if (toLower(symbol) === 'doge') {
      onGetDogeUtxos()
    }

    if (toLower(symbol) === 'xvg') {
      onGetVergeUtxos()
    }

    if (state.isStandingFee || !state.amount.length) {
      return
    }

    const currencyInfo = chain ? getToken(symbol, chain) : getCurrency(symbol)

    if (currencyInfo) {
      updateState({ isFeeLoading: true })
      const withOutputs = checkWithOutputs(symbol)

      if (withOutputs) {
        updateState({ utxosList: [] })
      }

      const data = await getNetworkFee({
        symbol,
        addressFrom: address,
        addressTo: state.address,
        chain: currencyInfo.chain,
        amount: state.amount,
        tokenChain: chain,
        btcLikeParams: {
          outputs: state.outputs,
          customFee: state.customFee,
        },
        ethLikeParams: {
          contractAddress,
          decimals,
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
                utxosList: getFee.utxos || [],
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

        if (isEthereumLike(symbol, chain)) {
          const timer = setTimeout(() => {
            onGetNetworkFee()
          }, 5000)

          updateState({ timer })
        }
      }
    }
  }

  const setInsufficientError = (): void => {
    updateState({ amountErrorLabel: 'Insufficient funds' })
  }

  const checkProps = () => {
    if (Object.keys(state.props).length) {
      const { amount: propsAmount, recipientAddress } = state.props

      if (propsAmount && !isNaN(Number(propsAmount)) && Number(propsAmount) > 0) {
        updateState({ amount: `${propsAmount}` })
      }

      if (recipientAddress?.length) {
        updateState({ address: recipientAddress })
      }

      if (state.props?.extraId) {
        updateState({ extraId: state.props.extraId })
      }
    }
  }

  const getStorageData = (): void => {
    const tabInfo = getItem('tab')
    const getProps = getItem('sendPageProps')

    if (tabInfo) {
      const { favIconUrl = undefined, url = undefined } = JSON.parse(tabInfo)

      if (favIconUrl && url) {
        updateState({
          tabInfo: {
            favIconUrl,
            url: new URL(url).host,
          },
        })
      }
      removeItem('tab')
    }

    if (getProps) {
      const parseProps = JSON.parse(getProps)

      updateState({ props: parseProps })
    }
  }

  const getCurrencyInfo = (): void => {
    if (state.selectedWallet) {
      const info = state.selectedWallet?.chain
        ? getToken(state.selectedWallet?.symbol, state.selectedWallet.chain)
        : getCurrency(state.selectedWallet?.symbol)

      if (info) {
        updateState({ currencyInfo: info })
        getOutputs(info)
      }
    }
  }

  const getCurrencyBalance = async (): Promise<void> => {
    updateState({ balance: null, estimated: null })

    if (state.selectedWallet) {
      const { address, symbol, chain, contractAddress } = state.selectedWallet

      const getCurrencyInfo = chain ? getToken(symbol, chain) : getCurrency(symbol)

      if (getCurrencyInfo) {
        const { balance, balance_usd } = await getBalance(
          address,
          getCurrencyInfo?.chain,
          chain ? symbol : undefined,
          contractAddress,
          true
        )

        updateState({ balance, estimated: balance_usd })
      }
    }
  }

  const getWalletsList = (sendPageProps: string | null): void => {
    const wallets = getWallets()

    let currency: undefined | string = undefined
    let chain: undefined | string = undefined

    if (sendPageProps) {
      const parsePageProps = JSON.parse(sendPageProps)

      if (parsePageProps?.currency) {
        currency = parsePageProps.currency
      }

      if (parsePageProps?.chain) {
        chain = parsePageProps.chain
      }
    }

    if (wallets?.length && currency) {
      const filterWallets = wallets.filter(
        (wallet: IWallet) =>
          toLower(wallet.symbol) === toLower(currency) && toLower(wallet.chain) === toLower(chain)
      )

      if (filterWallets.length) {
        updateState({ walletsList: filterWallets, selectedWallet: filterWallets[0] })
      } else {
        updateState({ walletsNotFound: true })
      }
    }
  }

  const onClose = (): void => {
    if (getItem('sendPageProps')) {
      removeItem('sendPageProps')
    }

    logEvent({
      name: TRANSACTION_CANCEL,
      properties: {
        stage: 'send',
      },
    })

    browser.runtime.sendMessage({
      type: 'close_select_address_window',
    })

    window.close()
  }

  const onConfirm = async (): Promise<void> => {
    const currenctTab = await getCurrentTab()

    const url = getUrl('send-confirmation.html')

    if (currenctTab?.id && state.selectedWallet) {
      const currency = state.selectedWallet?.chain
        ? getToken(state.selectedWallet.symbol, state.selectedWallet.chain)
        : getCurrency(state.selectedWallet.symbol)

      const data = {
        amount: Number(state.amount),
        symbol: state.selectedWallet.symbol,
        addressFrom: state.selectedWallet.address,
        addressTo: state.address,
        networkFee: state.fee,
        tabInfo: state.tabInfo,
        chain: currency?.chain,
        networkFeeSymbol: state.feeSymbol,
        outputs: state.utxosList,
        contractAddress: state.selectedWallet?.contractAddress,
        tokenChain: state.selectedWallet?.chain,
        decimals: state.selectedWallet?.decimals,
        extraId: state.extraId,
        hardware: state.selectedWallet?.hardware,
        isIncludeFee: state.isIncludeFee,
      }

      logEvent({
        name: TRANSACTION_START,
        properties: {
          fee: state.isIncludeFee ? 'incl' : 'excl',
          speed: currency?.isCustomFee ? 'fixed' : state.feeType,
        },
      })

      if (state.timer) {
        clearTimeout(state.timer)
      }

      setItem('sendConfirmationData', JSON.stringify(data))

      if (state.isDraggable) {
        location.href = `${url}?isDraggable=true`
      } else {
        await updateTab(currenctTab.id, {
          url,
        })
      }
    }
  }

  const checkAddress = (): void => {
    if (state.addressErrorLabel) {
      updateState({ addressErrorLabel: null })
    }

    if (state.selectedWallet && state.currencyInfo) {
      if (
        state.address.length &&
        !validateAddress(state.selectedWallet.symbol, state.address, state.selectedWallet?.chain)
      ) {
        return updateState({ addressErrorLabel: 'Address is not valid' })
      }

      if (state.address === state.selectedWallet.address) {
        return updateState({ addressErrorLabel: 'Address same as sender' })
      }
    }

    if (!state.fee && Number(state.amount) > 0 && !state.amountErrorLabel) {
      onGetNetworkFee()
    }
  }

  const getAvailableBalance = (): number => {
    if (state.balance && state.selectedWallet) {
      if (toLower(state.selectedWallet?.symbol) === 'xrp') {
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

    if (state.currencyInfo && state.selectedWallet) {
      let amount = getAmount()
      let minAmount: number = 0
      const getMinAmountWithFee = state.isIncludeFee ? state.fee : 0

      if (state.selectedWallet?.chain) {
        minAmount = state.currencyInfo.minSendAmount || 0.001
      } else {
        amount = formatUnit(
          state.selectedWallet.symbol,
          getAmount(),
          'to',
          state.currencyInfo.chain,
          'ether'
        )
        minAmount = formatUnit(
          state.selectedWallet.symbol,
          state.currencyInfo.minSendAmount,
          'from',
          state.currencyInfo.chain,
          'ether'
        )
      }

      const minAmountWithFee = plus(minAmount, getMinAmountWithFee)

      if (amount < state.currencyInfo.minSendAmount) {
        return updateState({
          amountErrorLabel: `Min amount is ${minAmountWithFee} ${toUpper(
            state.selectedWallet.symbol
          )}`,
        })
      }
    }
  }

  const isCurrencyBalanceError =
    state.selectedWallet !== null &&
    (state.selectedWallet?.chain !== undefined ||
      toLower(state.selectedWallet.symbol) === 'theta') &&
    state.currencyBalance !== null &&
    !state.isFeeLoading &&
    state.fee > 0 &&
    state.fee > state.currencyBalance

  const isButtonDisabled = (): boolean => {
    if (state.selectedWallet && state.currencyInfo) {
      const getAmount = state.isIncludeFee ? Number(state.amount) - state.fee : Number(state.amount)

      if (
        validateAddress(state.selectedWallet.symbol, state.address, state.selectedWallet?.chain) &&
        state.amount.length &&
        getAmount > 0 &&
        state.addressErrorLabel === null &&
        state.amountErrorLabel === null &&
        Number(state.balance) > 0 &&
        !state.isFeeLoading &&
        !isCurrencyBalanceError
      ) {
        if (!state.utxosList?.length) {
          const withOuputs = checkWithOutputs(state.currencyInfo.symbol)

          return withOuputs
        }

        if (state.fee === 0) {
          return !checkWithZeroFee(state.currencyInfo.symbol)
        }

        return false
      }
    }
    return true
  }

  const onGenerateExtraId = (): void => {
    if (state.selectedWallet) {
      const extraId = generateExtraId(state.selectedWallet.symbol)

      if (extraId) {
        updateState({ extraId })
      }
    }
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

  const onSendAll = (): void => {
    if (state.balance) {
      updateState({ amount: `${state.balance}`, isIncludeFee: true })

      logEvent({
        name: TRANSACTION_AUTO_FILL,
        properties: {
          king: 'allFunds',
        },
      })
    }
  }

  const changeWallet = (selectedAddress: string) => {
    const findWallet = state.walletsList.find(
      (wallet: IWallet) => toLower(wallet.address) === toLower(selectedAddress)
    )

    if (findWallet) {
      updateState({ selectedWallet: findWallet })

      if (!state.isStandingFee) {
        updateState({ fee: 0 })
      }
    }
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

  const setFeeType = (feeType: TFeeTypes): void => {
    if (state.amountErrorLabel) {
      updateState({ amountErrorLabel: null })
    }

    updateState({ feeType, selectedFee: state.customFee[feeType] })

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

  const onCloseDrawer = (): void => {
    updateState({ activeDrawer: null })
  }

  const onClickDrawerWallet = (address: string) => (): void => {
    updateState({ address })
    onCloseDrawer()
  }

  const setWalletName = (): void => {
    if (state.walletsList && state.selectedWallet) {
      const { symbol, uuid, hardware, chain, name } = state.selectedWallet

      const walletName =
        state.selectedWallet.walletName ||
        getWalletName(state.walletsList, symbol, uuid, hardware, chain, name)

      updateState({ walletName })
    }
  }

  const getCurrencyName = (): string => {
    if (state.props?.currency) {
      const { currency } = state.props

      const getInfo = getCurrency(currency)

      if (getInfo) {
        return getInfo.name
      }
    }

    return ''
  }

  return (
    <ExternalPageContainer onClose={onClose} headerStyle="green" isDraggable={state.isDraggable}>
      <>
        <Styles.Container>
          {state.walletsNotFound ? (
            <Styles.NotFound>
              <SVG src="../../assets/icons/notFound.svg" width={60} height={60} />
              <Styles.NotFoundText>{getCurrencyName()} addresses was not found</Styles.NotFoundText>
            </Styles.NotFound>
          ) : (
            <>
              <Styles.Row>
                <WalletCardShared
                  balance={state.balance}
                  estimated={state.estimated}
                  symbol={state.selectedWallet?.symbol}
                  hardware={state.selectedWallet?.hardware}
                  walletName={state.walletName}
                  address={state.selectedWallet?.address}
                  name={state.currencyInfo?.name}
                  wallets={state.walletsList}
                  changeWallet={changeWallet}
                  tokenChain={state.props?.chain}
                  openFrom="browser"
                />
                <SendFormShared
                  balance={state.balance}
                  symbol={state.selectedWallet?.symbol}
                  wallets={state.walletsList}
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
                  openFrom="browser"
                />
                <NetworkFeeShared
                  isLoading={state.isFeeLoading}
                  fee={state.fee}
                  symbol={state.selectedWallet?.symbol || ''}
                  feeSymbol={state.feeSymbol}
                  type={state.feeType}
                  setType={setFeeType}
                  isBalanceError={isCurrencyBalanceError && state.currencyBalance !== null}
                  withButton={state?.currencyInfo?.isCustomFee}
                  isIncludeFee={state.isIncludeFee}
                  toggleIncludeFee={toggleIncludeFee}
                  showFeeDrawer={showFeeDrawer}
                  values={state.feeValues}
                  openFrom="browser"
                />
              </Styles.Row>
              <Styles.Actions>
                <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
                <Button label="Send" onClick={onConfirm} disabled={isButtonDisabled()} ml={7.5} />
              </Styles.Actions>
            </>
          )}
        </Styles.Container>
        <WalletsDrawer
          isActive={state.activeDrawer === 'wallets'}
          onClose={onCloseDrawer}
          selectedAddress={state.selectedWallet?.address}
          wallets={state.walletsList}
          onClickWallet={onClickDrawerWallet}
        />
        <AboutFeeDrawer
          isActive={state.activeDrawer === 'aboutFee'}
          onClose={onCloseDrawer}
          openFrom="browser"
        />
      </>
    </ExternalPageContainer>
  )
}

render(<Send />, document.getElementById('send'))
