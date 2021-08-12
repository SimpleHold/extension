import * as React from 'react'
import { render } from 'react-dom'
import { BigNumber } from 'bignumber.js'
import { browser } from 'webextension-polyfill-ts'

// Container
import ExternalPageContainer from '@containers/ExternalPage'

// Shared
import SendFormShared from '@shared/SendForm'

// Utils
import { getWallets, IWallet } from '@utils/wallet'
import { getBalance, getUnspentOutputs } from '@utils/api'
import { getCurrentTab, updateTab, getUrl } from '@utils/extension'
import { price, toLower, toUpper, formatEstimated } from '@utils/format'
import {
  validateAddress,
  formatUnit,
  getNetworkFeeSymbol,
  getExtraIdName,
  generateExtraId,
} from '@utils/currencies'
import * as bitcoinLike from '@utils/currencies/bitcoinLike'
import { getItem, setItem, removeItem } from '@utils/storage'

// Config
import { getCurrency, getCurrencyByChain, ICurrency } from '@config/currencies'
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
  networkFee: 0,
  isNetworkFeeLoading: false,
  amountErrorLabel: null,
  outputs: [],
  networkFeeSymbol: '',
  utxosList: [],
  currencyBalance: 0,
  extraId: '',
  extraIdName: '',
  isDraggable: false,
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
      checkValidAddress()
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
      getNetworkFee()
    }
  }, [debounced])

  React.useEffect(() => {
    if (state.balance !== null) {
      onBlurAmountInput()
      checkValidAddress()
    }
  }, [state.balance])

  React.useEffect(() => {
    if (state.isNetworkFeeLoading && state.amountErrorLabel) {
      updateState({ isNetworkFeeLoading: false })
    }
  }, [state.isNetworkFeeLoading, state.amountErrorLabel])

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
        bitcoinLike.coins.indexOf(info.chain) !== -1 ||
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

      const networkFeeSymbol = getNetworkFeeSymbol(symbol, chain)
      updateState({ networkFeeSymbol })
    }
  }

  const getNetworkFee = async (): Promise<void> => {
    if (state.selectedWallet) {
      updateState({ isNetworkFeeLoading: true })

      const { symbol, chain, decimals, contractAddress } = state.selectedWallet

      const currencyInfo = chain ? getToken(symbol, chain) : getCurrency(symbol)

      if (currencyInfo) {
        const data = {
          utxos: [],
          networkFee: 0,
          currencyBalance: 0,
        }

        updateState({ isNetworkFeeLoading: false })

        if (data) {
          if (data?.utxos) {
            updateState({ utxosList: data.utxos })
          }
          if (data.networkFee) {
            updateState({ networkFee: data.networkFee })
          } else {
            if (Number(state.amount) > 0 && Number(state.balance) > 0) {
              updateState({ amountErrorLabel: 'Insufficient funds' })
            }
          }
          if (typeof data.currencyBalance !== 'undefined' && !isNaN(data.currencyBalance)) {
            updateState({ currencyBalance: data.currencyBalance })
          }
        }
      }
    }
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
        networkFee: state.networkFee,
        tabInfo: state.tabInfo,
        chain: currency?.chain,
        networkFeeSymbol: state.networkFeeSymbol,
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

  const dropdownList = state.walletsList
    ?.filter(
      (wallet: IWallet) =>
        toLower(wallet.address) !== toLower(state.selectedWallet?.address) ||
        toLower(wallet?.chain) !== toLower(state.selectedWallet?.chain)
    )
    .map((wallet: IWallet) => {
      const currencyInfo = wallet?.chain
        ? getCurrencyByChain(wallet.chain)
        : getCurrency(wallet?.symbol)

      return {
        logo: {
          symbol: wallet.symbol,
          width: 40,
          height: 40,
          br: 13,
          background: currencyInfo?.background,
          chain: wallet?.chain,
        },
        label: wallet?.name || currencyInfo?.name,
        value: wallet.address,
        chain: wallet?.chain,
      }
    })

  const onSelectDropdown = (index: number) => {
    const currency = dropdownList[index]

    const findWallet = state.walletsList.find(
      (wallet: IWallet) =>
        toLower(wallet.address) === toLower(currency.value) &&
        toLower(wallet?.chain) === toLower(currency?.chain)
    )

    if (findWallet) {
      updateState({ selectedWallet: findWallet })
    }
  }

  const checkValidAddress = (): void => {
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

    if (!state.networkFee && Number(state.amount) > 0 && !state.amountErrorLabel) {
      getNetworkFee()
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

  const onBlurAmountInput = (): void => {
    if (state.amountErrorLabel) {
      updateState({ amountErrorLabel: null })
    }

    const availableBalance = getAvailableBalance()

    if (
      state.amount.length &&
      Number(state.amount) + Number(state.networkFee) >= Number(availableBalance)
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
    state.selectedWallet &&
    (state.selectedWallet?.chain || toLower(state.selectedWallet.symbol) === 'theta') &&
    state.currencyBalance !== null &&
    !state.isNetworkFeeLoading &&
    state.networkFee &&
    state.networkFee > state.currencyBalance

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
        state.networkFee > 0 &&
        !state.isNetworkFeeLoading &&
        !isCurrencyBalanceError
      ) {
        if (!state.outputs.length) {
          if (
            bitcoinLike.coins.indexOf(state.currencyInfo.chain) !== -1 ||
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

  const createExtraId = (): void => {
    if (state.selectedWallet) {
      const extraId = generateExtraId(state.selectedWallet.symbol)

      if (extraId) {
        updateState({ extraId })
      }
    }
  }

  // const extraIdInputButton = () => (
  //   <Tooltip text="Generate destination tag" direction="right">
  //     <Styles.InputButton onClick={createExtraId} withHover>
  //       <SVG src="../../assets/icons/generateExtraid.svg" width={16} height={16} />
  //     </Styles.InputButton>
  //   </Tooltip>
  // )

  // const amountInputButton = () => {
  //   if (state.selectedWallet) {
  //     if (
  //       toLower(state.selectedWallet.symbol) === 'xrp' &&
  //       state.amountErrorLabel === 'Insufficient funds'
  //     ) {
  //       return (
  //         <Tooltip
  //           text="The network requires at least 20 XRP balance at all times."
  //           direction="right"
  //           maxWidth={195}
  //           textSpace="pre-wrap"
  //         >
  //           <Styles.InputButton disabled>
  //             <SVG src="../../assets/icons/info.svg" width={16} height={16} />
  //           </Styles.InputButton>
  //         </Tooltip>
  //       )
  //     }
  //   }

  //   return null
  // }

  const withExtraid = state.extraIdName.length > 0

  const setAddress = (address: string): void => {
    updateState({ address })
  }

  const setAmount = (amount: string): void => {
    updateState({ amount })
  }

  const setExtraId = (extraId: string): void => {
    updateState({ extraId })
  }

  return (
    <ExternalPageContainer onClose={onClose} headerStyle="green" isDraggable={state.isDraggable}>
      <Styles.Body>
        {/* <SendFormShared
        balance={state.balance}
        estimated={state.estimated}
        symbol={state.selectedWallet?.symbol}
      /> */}
        {/* <Styles.Heading withExtraid={withExtraid}>
          <Styles.TitleRow>
            <Styles.Title>Send it on</Styles.Title>
            {state.tabInfo ? (
              <Styles.SiteInfo>
                <Styles.SiteFavicon src={state.tabInfo.favIconUrl} />
                <Styles.SiteUrl>{state.tabInfo.url}</Styles.SiteUrl>
              </Styles.SiteInfo>
            ) : null}
          </Styles.TitleRow>
          <Skeleton
            width={250}
            height={42}
            type="gray"
            mt={31}
            isLoading={state.balance === null || !state.selectedWallet}
          >
            <Styles.Balance>
              {numeral(state.balance).format('0.[000000]')} {toUpper(state.selectedWallet?.symbol)}
            </Styles.Balance>
          </Skeleton>
          <Skeleton
            width={130}
            height={23}
            mt={10}
            type="gray"
            isLoading={state.estimated === null || !state.selectedWallet}
          >
            <Styles.Estimated>{`$ ${formatEstimated(
              state.estimated,
              price(state.estimated, 2)
            )}`}</Styles.Estimated>
          </Skeleton>
        </Styles.Heading>
        <Styles.Form>
          {state.walletsList.length ? (
            <CurrenciesDropdown
              list={dropdownList}
              onSelect={onSelectDropdown}
              currencyBr={13}
              label="Select address"
              value={state.selectedWallet?.address}
              currencySymbol={state.selectedWallet?.symbol}
              background={state.currencyInfo?.background}
              disabled={state.walletsList.length < 2}
              tokenChain={state.props?.chain}
            />
          ) : null}
          <TextInput
            label="Recipient Address"
            value={state.address}
            onChange={setAddress}
            openFrom="browser"
            errorLabel={state.addressErrorLabel}
            onBlurInput={checkValidAddress}
            disabled={state.balance === null || state.props?.readOnly}
            type="text"
          />
          {withExtraid ? (
            <TextInput
              label={`${state.extraIdName} (optional)`}
              value={state.extraId}
              onChange={setExtraId}
              disabled={state.balance === null}
              button={extraIdInputButton()}
              type="text"
            />
          ) : null}
          <TextInput
            label={`Amount ${
              state.selectedWallet ? `(${toUpper(state.selectedWallet?.symbol)})` : ''
            }`}
            value={state.amount}
            onChange={setAmount}
            type="number"
            openFrom="browser"
            errorLabel={state.amountErrorLabel}
            onBlurInput={onBlurAmountInput}
            disabled={state.props?.readOnly}
            button={amountInputButton()}
          />
          <Styles.NetworkFeeBlock>
            <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
            {state.isNetworkFeeLoading ? (
              <Spinner ml={10} size={16} />
            ) : (
              <>
                {state.networkFee === 0 ? (
                  <Styles.NetworkFee>-</Styles.NetworkFee>
                ) : (
                  <Styles.NetworkFee>
                    {state.networkFee} {toUpper(state.networkFeeSymbol)}
                  </Styles.NetworkFee>
                )}
              </>
            )}
            {isCurrencyBalanceError ? (
              <Styles.NetworkFeeError>
                Insufficient funds {Number(state.networkFee - state.currencyBalance)}{' '}
                {toUpper(state.networkFeeSymbol)}
              </Styles.NetworkFeeError>
            ) : null}
          </Styles.NetworkFeeBlock>

          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onClose} mr={7.5} />
            <Button label="Send" disabled={isButtonDisabled()} onClick={onConfirm} ml={7.5} />
          </Styles.Actions>
        </Styles.Form> */}
      </Styles.Body>
    </ExternalPageContainer>
  )
}

render(<Send />, document.getElementById('send'))
