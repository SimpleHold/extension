import * as React from 'react'
import SVG from 'react-inlinesvg'
import { BigNumber } from 'bignumber.js'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import TextInput from '@components/TextInput'
import Tooltip from '@components/Tooltip'
import Spinner from '@components/Spinner'
import Button from '@components/Button'

// Hooks
import useState from '@hooks/useState'
import useDebounce from '@hooks/useDebounce'

// Config
import { getCurrency, ICurrency } from '@config/currencies'
import { getToken, IToken } from '@config/tokens'

// Utils
import {
  generateExtraId,
  formatUnit,
  getNewNetworkFee,
  validateAddress,
  getNetworkFeeSymbol,
} from '@utils/currencies'
import { toUpper, toLower } from '@utils/format'
import { getUnspentOutputs } from '@utils/api'
import { getWallets, IWallet } from '@utils/wallet'
import * as bitcoinLike from '@utils/currencies/bitcoinLike'

// Types
import { TList } from '@components/CurrenciesDropdown/CurrenciesDropdown'
import { TCardanoUnspentTxOutput } from '@utils/currencies/cardano/types'

// Styles
import Styles from './styles'

interface IProps {
  renderRow: React.ReactElement<any, any> | null
  withCover?: boolean
  withHeader?: boolean
  goBack?: () => void
  currency?: ICurrency | IToken
  styles: {
    wrapper: React.CSSProperties
    container: React.CSSProperties
    form: React.CSSProperties
  }
  balance: null | number
  withExtraid: boolean
  extraIdName: string
  selectedAddress: string
  onCancel: () => void
  onConfirm: (params: TConfirmParams) => void
  openFrom?: string
  tokenChain?: string
  chain?: string
  dropDown: {
    label?: string
    value: string
    currencySymbol: string
    background?: string
    list: TList[]
    onSelect: (index: number) => void
    disabled: boolean
    tokenChain?: string
    tokenName?: string
  }
  onBlurAddressInput: (address: string) => void
  addressErrorLabel: null | string
}

interface IState {
  balance: null | number
  estimated: null | number
  address: string
  extraId: string
  amount: string
  amountErrorLabel: null | string
  isNetworkFeeLoading: boolean
  networkFee: number
  networkFeeSymbol: string
  currencyBalance: number | null
  selectedWallet: IWallet | null
  utxosList: UnspentOutput[] | TCardanoUnspentTxOutput[]
  outputs: UnspentOutput[]
  walletsList: IWallet[]
}

export type TConfirmParams = {
  amount: number
  networkFee: number
  networkFeeSymbol: string
  addressTo: string
  outputs: UnspentOutput[] | TCardanoUnspentTxOutput[]
  extraId: string
}

const initialState: IState = {
  balance: null,
  estimated: null,
  address: '',
  extraId: '',
  amount: '',
  amountErrorLabel: null,
  isNetworkFeeLoading: false,
  networkFee: 0,
  networkFeeSymbol: '',
  currencyBalance: null,
  selectedWallet: null,
  utxosList: [],
  outputs: [],
  walletsList: [],
}

const SendPageContainer: React.FC<IProps> = (props) => {
  const {
    renderRow,
    withCover,
    withHeader,
    goBack,
    styles,
    currency,
    balance,
    withExtraid,
    extraIdName,
    selectedAddress,
    onCancel,
    onConfirm,
    openFrom,
    tokenChain,
    chain,
    dropDown,
    onBlurAddressInput,
    addressErrorLabel,
  } = props

  const {
    state: {
      address,
      extraId,
      amount,
      amountErrorLabel,
      isNetworkFeeLoading,
      networkFee,
      networkFeeSymbol,
      currencyBalance,
      selectedWallet,
      utxosList,
      outputs,
      walletsList,
    },
    updateState,
  } = useState<IState>(initialState)

  const debounced = useDebounce(amount, 1000)

  React.useEffect(() => {
    getWalletsList()
  }, [])

  React.useEffect(() => {
    getOutputs()
  }, [selectedAddress])

  React.useEffect(() => {
    if (selectedWallet) {
      checkValidAddress()
      onGetNetworkFeeSymbol()
    }
  }, [selectedWallet])

  React.useEffect(() => {
    if (amount.length && Number(balance) > 0 && !amountErrorLabel) {
      getNetworkFee()
    }
  }, [debounced])

  React.useEffect(() => {
    if (networkFee > 0 && !amountErrorLabel) {
      if (amount.length && Number(amount) + Number(networkFee) >= Number(balance)) {
        updateState({ amountErrorLabel: 'Insufficient funds' })
      }
    }
  }, [networkFee])

  const onGetNetworkFeeSymbol = () => {
    if (selectedWallet) {
      const { chain, symbol } = selectedWallet

      const data = getNetworkFeeSymbol(symbol, chain)
      updateState({ networkFeeSymbol: data })
    }
  }

  const getWalletsList = (): void => {
    const wallets = getWallets()

    if (wallets?.length) {
      if (currency) {
        const filterWallets = wallets.filter(
          (wallet: IWallet) => toLower(wallet.symbol) === toLower(currency.symbol)
        )

        updateState({
          walletsList: filterWallets.length ? filterWallets : wallets,
          selectedWallet: filterWallets.length ? filterWallets[0] : null,
        })
      } else {
        updateState({
          walletsList: wallets,
          selectedWallet: wallets[0],
        })
      }
    }
  }

  const getNetworkFee = async (): Promise<void> => {
    if (selectedWallet) {
      updateState({ utxosList: [], isNetworkFeeLoading: true })

      const { symbol, chain, decimals, contractAddress } = selectedWallet

      const currencyInfo = chain ? getToken(symbol, chain) : getCurrency(symbol)

      if (currencyInfo) {
        const data = await getNewNetworkFee({
          address: selectedWallet.address,
          symbol,
          amount,
          chain: currencyInfo.chain,
          from: selectedWallet.address,
          to: address,
          web3Params: {
            tokenChain: chain,
            decimals,
            contractAddress,
          },
          outputs,
        })

        updateState({ isNetworkFeeLoading: false })

        if (data) {
          updateState({
            utxosList: data.utxos || [],
            networkFee: data.networkFee || 0,
            currencyBalance:
              typeof data.currencyBalance !== 'undefined' && !isNaN(data.currencyBalance)
                ? data.currencyBalance
                : null,
          })
        }
      }
    }
  }

  const getOutputs = async (): Promise<void> => {
    if (selectedWallet && currency) {
      const { address } = selectedWallet
      const { chain } = currency

      if (bitcoinLike.chains.indexOf(chain) !== -1 || toLower(selectedWallet?.symbol) === 'ada') {
        const unspentOutputs = await getUnspentOutputs(address, chain)
        updateState({ outputs: unspentOutputs })
      }
    }
  }

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const setAddress = (value: string): void => {
    updateState({ address: value })
  }

  const checkValidAddress = (): void => {
    onBlurAddressInput(address)
  }

  const setExtraId = (value: string): void => {
    updateState({ extraId: value })
  }

  const setAmount = (value: string): void => {
    updateState({ amount: value })
  }

  const isInputDisabled = balance === null

  const createExtraId = (): void => {
    if (selectedWallet) {
      const newExtraId = generateExtraId(selectedWallet.symbol)

      if (newExtraId) {
        setExtraId(newExtraId)
      }
    }
  }

  const getAvailableBalance = (): number => {
    if (balance && selectedWallet) {
      if (toLower(selectedWallet.symbol) === 'xrp') {
        return new BigNumber(balance).minus(20).toNumber()
      }
      return Number(balance)
    }
    return 0
  }

  const onBlurAmountInput = (): void => {
    if (amountErrorLabel) {
      updateState({ amountErrorLabel: null })
    }

    const availableBalance = getAvailableBalance()

    if (amount.length && Number(amount) + Number(networkFee) >= Number(availableBalance)) {
      return updateState({ amountErrorLabel: 'Insufficient funds' })
    }

    if (currency && selectedWallet) {
      const { symbol } = selectedWallet

      let parseAmount: number = Number(amount)
      let parseMinAmount: number = 0

      if (tokenChain) {
        parseMinAmount = currency.minSendAmount || 0.001
      } else {
        parseAmount = formatUnit(symbol, amount, 'to', chain, 'ether')
        parseMinAmount = formatUnit(symbol, currency.minSendAmount, 'from', chain, 'ether')
      }

      if (parseAmount < currency.minSendAmount) {
        return updateState({
          amountErrorLabel: `Min amount is ${parseMinAmount} ${toUpper(symbol)}`,
        })
      }
    }
  }

  const onConfirmSend = (): void => {
    const params: TConfirmParams = {
      amount: Number(amount),
      networkFee,
      networkFeeSymbol,
      addressTo: address,
      outputs,
      extraId,
    }

    onConfirm(params)
  }

  const extraIdInputButton = () => (
    <Tooltip text="Generate destination tag" direction="right">
      <Styles.InputButton onClick={createExtraId} withHover>
        <SVG src="../../assets/icons/generateExtraid.svg" width={16} height={16} />
      </Styles.InputButton>
    </Tooltip>
  )

  const amountInputButton = () => {
    if (selectedWallet) {
      const { symbol } = selectedWallet

      if (toLower(symbol) === 'xrp' && amountErrorLabel === 'Insufficient funds') {
        return (
          <Tooltip
            text="The network requires at least 20 XRP balance at all times."
            direction="right"
            maxWidth={195}
            textSpace="pre-wrap"
          >
            <Styles.InputButton disabled>
              <SVG src="../../assets/icons/info.svg" width={16} height={16} />
            </Styles.InputButton>
          </Tooltip>
        )
      }
    }
    return null
  }

  const isCurrencyBalanceError =
    selectedWallet &&
    (selectedWallet?.chain || toLower(selectedWallet.symbol) === 'theta') &&
    currencyBalance !== null &&
    !isNetworkFeeLoading &&
    networkFee &&
    networkFee > currencyBalance

  const isButtonDisabled = (): boolean => {
    if (selectedWallet && currency) {
      if (
        validateAddress(selectedWallet.symbol, currency.chain, address, selectedWallet?.chain) &&
        amount.length &&
        Number(amount) > 0 &&
        addressErrorLabel === null &&
        amountErrorLabel === null &&
        Number(balance) > 0 &&
        networkFee > 0 &&
        !isNetworkFeeLoading &&
        !isCurrencyBalanceError
      ) {
        if (!outputs.length) {
          if (
            bitcoinLike.chains.indexOf(currency.chain) !== -1 ||
            toLower(selectedWallet.symbol) === 'ada'
          ) {
            return true
          }
        }
        return false
      }
    }
    return true
  }

  return (
    <Styles.Wrapper style={styles.wrapper}>
      {withCover ? <Cover /> : null}
      {withHeader && goBack ? <Header withBack backTitle="Wallet" onBack={goBack} /> : null}
      <Styles.Container style={styles.container}>
        {renderRow}
        <Styles.Form onSubmit={onSubmitForm} style={styles.form}>
          <CurrenciesDropdown
            label={dropDown.label}
            value={dropDown.value}
            currencySymbol={dropDown.currencySymbol}
            background={dropDown.background}
            list={dropDown.list}
            onSelect={dropDown.onSelect}
            disabled={dropDown.disabled}
            tokenChain={dropDown.tokenChain}
            tokenName={dropDown.tokenName}
          />
          <TextInput
            label="Recipient Address"
            value={address}
            onChange={setAddress}
            openFrom={openFrom}
            errorLabel={addressErrorLabel}
            onBlurInput={checkValidAddress}
            disabled={isInputDisabled}
          />
          {withExtraid ? (
            <TextInput
              label={`${extraIdName} (optional)`}
              value={extraId}
              onChange={setExtraId}
              openFrom={openFrom}
              disabled={balance === null}
              button={extraIdInputButton()}
            />
          ) : null}
          <TextInput
            label={`Amount (${toUpper(selectedWallet?.symbol)})`}
            value={amount}
            onChange={setAmount}
            openFrom={openFrom}
            type="number"
            errorLabel={amountErrorLabel}
            onBlurInput={onBlurAmountInput}
            disabled={balance === null}
            button={amountInputButton()}
          />
          <Styles.NetworkFeeBlock>
            <Styles.NetworkFeeLabel withExtraid={withExtraid}>Network fee:</Styles.NetworkFeeLabel>
            {isNetworkFeeLoading ? (
              <Spinner ml={10} size={16} />
            ) : (
              <Styles.NetworkFee withExtraid={withExtraid}>
                {networkFee === 0 ? '-' : `${networkFee} ${toUpper(networkFeeSymbol)}`}
              </Styles.NetworkFee>
            )}
            {isCurrencyBalanceError && currencyBalance !== null ? (
              <Styles.NetworkFeeError>
                Insufficient funds {Number(networkFee - currencyBalance)}{' '}
                {toUpper(networkFeeSymbol)}
              </Styles.NetworkFeeError>
            ) : null}
          </Styles.NetworkFeeBlock>

          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onCancel} mr={7.5} isSmall />
            <Button
              label="Send"
              onClick={onConfirmSend}
              disabled={isButtonDisabled()}
              ml={7.5}
              isSmall
            />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default SendPageContainer
