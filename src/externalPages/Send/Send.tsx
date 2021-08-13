import * as React from 'react'
import { render } from 'react-dom'
import { BigNumber } from 'bignumber.js'
import { browser } from 'webextension-polyfill-ts'

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
import { getWallets, IWallet } from '@utils/wallet'
import { getBalance, getUnspentOutputs } from '@utils/api'
import { getCurrentTab, updateTab, getUrl } from '@utils/extension'
import { toLower, toUpper, minus } from '@utils/format'
import {
  validateAddress,
  formatUnit,
  getNetworkFeeSymbol,
  getExtraIdName,
  generateExtraId,
  getNetworkFee,
  getFee,
} from '@utils/currencies'
import * as bitcoinLike from '@utils/currencies/bitcoinLike'
import { getItem, setItem, removeItem } from '@utils/storage'

// Config
import { getCurrency, ICurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Hooks
import useDebounce from '@hooks/useDebounce'
import useState from '@hooks/useState'

// Types
import { IState } from './types'

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
}

const Send: React.FC = () => {
  const { state, updateState } = useState<IState>(initialState)
  const debounced = useDebounce(state.amount, 1000)

  React.useEffect(() => {
    getWalletsList(getItem('sendPageProps'))
    getStorageData()
    getQueryParams()
    getCustomFee()
  }, [])

  React.useEffect(() => {
    if (state.selectedWallet) {
      getCurrencyInfo()
      getCurrencyBalance()
      checkAddress()
      onGetNetworkFeeSymbol()
      getExtraId()
    }
  }, [state.selectedWallet])

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
      onGetNetworkFee()
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
      if (
        bitcoinLike.coins.indexOf(info.symbol) !== -1 ||
        toLower(state.selectedWallet?.symbol) === 'ada' ||
        toLower(state.selectedWallet?.symbol) === 'nebl'
      ) {
        const outputs = await getUnspentOutputs(state.selectedWallet.address, info.chain)
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

  const onGetNetworkFee = async (): Promise<void> => {}

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
          contractAddress
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

    if (wallets?.length) {
      if (currency) {
        const filterWallets = wallets.filter(
          (wallet: IWallet) =>
            toLower(wallet.symbol) === toLower(currency) && toLower(wallet.chain) === toLower(chain)
        )

        if (filterWallets.length) {
          updateState({ walletsList: filterWallets, selectedWallet: filterWallets[0] })
        } else {
          updateState({ walletsList: wallets, selectedWallet: null })
        }
      } else {
        updateState({ walletsList: wallets, selectedWallet: wallets[0] })
      }
    }
  }

  const onClose = (): void => {
    if (getItem('sendPageProps')) {
      removeItem('sendPageProps')
    }

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
        !validateAddress(
          state.selectedWallet.symbol,
          state.currencyInfo.chain,
          state.address,
          state.selectedWallet?.chain
        )
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

    if (
      state.amount.length &&
      Number(state.amount) + Number(state.fee) >= Number(availableBalance)
    ) {
      return updateState({ amountErrorLabel: 'Insufficient funds' })
    }

    if (state.currencyInfo && state.selectedWallet) {
      let parseAmount: number = Number(state.amount)
      let parseMinAmount: number = 0

      if (state.selectedWallet?.chain) {
        parseMinAmount = state.currencyInfo.minSendAmount || 0.001
      } else {
        parseAmount = formatUnit(
          state.selectedWallet.symbol,
          state.amount,
          'to',
          state.currencyInfo.chain,
          'ether'
        )
        parseMinAmount = formatUnit(
          state.selectedWallet.symbol,
          state.currencyInfo.minSendAmount,
          'from',
          state.currencyInfo.chain,
          'ether'
        )
      }

      if (parseAmount < state.currencyInfo.minSendAmount) {
        return updateState({
          amountErrorLabel: `Min amount is ${parseMinAmount} ${toUpper(
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
      if (
        validateAddress(
          state.selectedWallet.symbol,
          state.currencyInfo.chain,
          state.address,
          state.selectedWallet?.chain
        ) &&
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
          if (
            bitcoinLike.coins.indexOf(state.currencyInfo.symbol) !== -1 ||
            toLower(state.selectedWallet.symbol) === 'ada'
          ) {
            return true
          }
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

  const getNormalFee = (): number => {
    return state.isIncludeFee ? 0 : state.fee
  }

  const onSendAll = (): void => {
    if (state.balance) {
      updateState({ amount: `${minus(state.balance, getNormalFee())}` })
    }
  }

  const changeWallet = (selectedAddress: string) => {
    const findWallet = state.walletsList.find(
      (wallet: IWallet) => toLower(wallet.address) === toLower(selectedAddress)
    )

    if (findWallet) {
      updateState({ selectedWallet: findWallet })
    }
  }

  const openWalletsDrawer = (): void => {}

  const setFeeType = (feeType: TFeeTypes): void => {
    updateState({ feeType, selectedFee: state.customFee[feeType] })
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

  return (
    <ExternalPageContainer onClose={onClose} headerStyle="green" isDraggable={state.isDraggable}>
      <>
        <Styles.Container>
          <Styles.Row>
            <WalletCardShared
              balance={state.balance}
              estimated={state.estimated}
              symbol={state.selectedWallet?.symbol}
              hardware={state.selectedWallet?.hardware}
              walletName="walletName"
              address={state.selectedWallet?.address}
              name={undefined}
              wallets={state.walletsList}
              changeWallet={changeWallet}
              tokenChain={undefined}
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
            />
            <NetworkFeeShared
              isLoading={state.isFeeLoading}
              fee={state.fee}
              symbol={state.feeSymbol}
              type={state.feeType}
              setType={setFeeType}
              isBalanceError={isCurrencyBalanceError && state.currencyBalance !== null}
              withButton={false}
              isIncludeFee={state.isIncludeFee}
              toggleIncludeFee={toggleIncludeFee}
              showFeeDrawer={showFeeDrawer}
              values={state.feeValues}
            />
          </Styles.Row>
          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
            <Button label="Send" onClick={onConfirm} disabled={isButtonDisabled()} ml={7.5} />
          </Styles.Actions>
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
