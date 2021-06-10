import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import numeral from 'numeral'
import { BigNumber } from 'bignumber.js'
import SVG from 'react-inlinesvg'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Skeleton from '@components/Skeleton'
import Spinner from '@components/Spinner'
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import Tooltip from '@components/Tooltip'

// Utils
import { getWallets, IWallet, updateBalance } from '@utils/wallet'
import { toUpper, price, toLower } from '@utils/format'
import { getBalance, getUnspentOutputs } from '@utils/api'
import { logEvent } from '@utils/amplitude'
import {
  validateAddress,
  getAddressNetworkFee,
  formatUnit,
  getNetworkFeeSymbol,
  getExtraIdName,
  generateExtraId,
} from '@utils/address'
import bitcoinLike from '@utils/bitcoinLike'

// Config
import { ADDRESS_SEND, ADDRESS_SEND_CANCEL } from '@config/events'
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Hooks
import useDebounce from '@hooks/useDebounce'

// Styles
import Styles from './styles'
import { ICardanoUnspentTxOutput } from 'utils/currencies/cardano'

interface LocationState {
  symbol: TSymbols
  address: string
  chain: string
  tokenChain?: string
  contractAddress?: string
  tokenName?: string
  decimals?: number
}

const Send: React.FC = () => {
  const history = useHistory()
  const {
    state: {
      symbol,
      address: locationAddress,
      chain,
      tokenChain = undefined,
      contractAddress = undefined,
      tokenName = undefined,
      decimals = undefined,
    },
  } = useLocation<LocationState>()

  const currency = tokenChain ? getToken(symbol, tokenChain) : getCurrency(symbol)

  const [address, setAddress] = React.useState<string>('')
  const [amount, setAmount] = React.useState<string>('')
  const [addresses, setAddresses] = React.useState<string[]>([])
  const [selectedAddress, setSelectedAddress] = React.useState<string>(locationAddress)
  const [networkFee, setNetworkFee] = React.useState<number>(0)
  const [balance, setBalance] = React.useState<null | number>(null)
  const [estimated, setEstimated] = React.useState<null | number>(null)
  const [addressErrorLabel, setAddressErrorLabel] = React.useState<null | string>(null)
  const [amountErrorLabel, setAmountErrorLabel] = React.useState<null | string>(null)
  const [outputs, setOutputs] = React.useState<UnspentOutput[]>([])
  const [utxosList, setUtxosList] = React.useState<UnspentOutput[] | ICardanoUnspentTxOutput[]>([])
  const [isNetworkFeeLoading, setNetworkFeeLoading] = React.useState<boolean>(false)
  const [currencyBalance, setCurrencyBalance] = React.useState<number | null>(null)
  const [networkFeeSymbol, setNetworkFeeSymbol] = React.useState<string>('')
  const [extraId, setExtraId] = React.useState<string>('')
  const [extraIdName, setExtraIdName] = React.useState<string>('')

  const debounced = useDebounce(amount, 1000)

  React.useEffect(() => {
    getWalletsList()
    onGetNetworkFeeSymbol()
    getExtraId()
  }, [])

  React.useEffect(() => {
    getOutputs()
    loadBalance()
  }, [selectedAddress])

  React.useEffect(() => {
    if (amount.length && Number(balance) > 0 && !amountErrorLabel) {
      setNetworkFeeLoading(true)
      getNetworkFee()
    }
  }, [debounced])

  React.useEffect(() => {
    if (networkFee > 0 && !amountErrorLabel) {
      if (amount.length && Number(amount) + Number(networkFee) >= Number(balance)) {
        setAmountErrorLabel('Insufficient funds')
      }
    }
  }, [networkFee])

  const getExtraId = (): void => {
    const name = getExtraIdName(symbol)

    if (name) {
      setExtraIdName(name)
    }
  }

  const onGetNetworkFeeSymbol = (): void => {
    const data = getNetworkFeeSymbol(symbol, tokenChain)
    setNetworkFeeSymbol(data)
  }

  const getOutputs = async (): Promise<void> => {
    if (bitcoinLike.coins().indexOf(chain) !== -1 || toLower(symbol) === 'ada') {
      const unspentOutputs = await getUnspentOutputs(selectedAddress, chain)
      setOutputs(unspentOutputs)
    }
  }

  const getNetworkFee = async (): Promise<void> => {
    setUtxosList([])

    const getTokenDecimals = tokenChain ? getToken(symbol, tokenChain)?.decimals : decimals

    const data = await getAddressNetworkFee(
      selectedAddress,
      symbol,
      amount,
      selectedAddress,
      address,
      chain,
      outputs,
      tokenChain,
      contractAddress,
      getTokenDecimals || decimals
    )

    setNetworkFeeLoading(false)

    if (data) {
      if (data.utxos) {
        setUtxosList(data?.utxos)
      }

      if (data.networkFee) {
        setNetworkFee(data.networkFee)
      }

      if (typeof data.currencyBalance !== 'undefined' && !isNaN(data.currencyBalance)) {
        setCurrencyBalance(data.currencyBalance)
      }
    }
  }

  const getWalletsList = (): void => {
    const walletsList = getWallets()

    if (walletsList) {
      const filterWallets = walletsList
        .filter((wallet: IWallet) => wallet.symbol === symbol)
        .map((wallet: IWallet) => wallet.address)
      setAddresses(filterWallets)
    }
  }

  const loadBalance = async (): Promise<void> => {
    setBalance(null)
    setEstimated(null)

    if (currency || contractAddress) {
      const { balance, balance_usd, balance_btc } = await getBalance(
        selectedAddress,
        currency?.chain || tokenChain,
        tokenChain ? symbol : undefined,
        contractAddress
      )

      setBalance(balance)
      updateBalance(address, symbol, balance, balance_btc)
      setEstimated(balance_usd)
    }
  }

  const onSend = (): void => {
    logEvent({
      name: ADDRESS_SEND,
    })

    const tokenContractAddress = tokenChain ? getToken(symbol, tokenChain)?.address : undefined
    const getTokenDecimals = tokenChain ? getToken(symbol, tokenChain)?.decimals : undefined

    history.push('/send-confirm', {
      amount: Number(amount),
      symbol,
      networkFee,
      networkFeeSymbol,
      addressFrom: selectedAddress,
      addressTo: address,
      outputs: utxosList,
      chain,
      contractAddress: tokenContractAddress || contractAddress,
      tokenChain,
      decimals: getTokenDecimals || decimals,
      extraId,
    })
  }

  const onBlurAddressInput = (): void => {
    if (addressErrorLabel) {
      setAddressErrorLabel(null)
    }

    if (address.length && !validateAddress(symbol, chain, address, tokenChain)) {
      setAddressErrorLabel('Address is not valid')
    }

    if (address === selectedAddress) {
      setAddressErrorLabel('Address same as sender')
    }
  }

  const getAvailableBalance = (): number => {
    if (balance) {
      if (toLower(symbol) === 'xrp') {
        return new BigNumber(balance).minus(20).toNumber()
      }
      return Number(balance)
    }
    return 0
  }

  const onBlurAmountInput = (): void => {
    if (amountErrorLabel) {
      setAmountErrorLabel(null)
    }

    const availableBalance = getAvailableBalance()

    if (amount.length && Number(amount) + Number(networkFee) >= Number(availableBalance)) {
      return setAmountErrorLabel('Insufficient funds')
    }

    if (currency) {
      let parseAmount: number = Number(amount)
      let parseMinAmount: number = 0

      if (tokenChain) {
        parseMinAmount = currency.minSendAmount || 0.001
      } else {
        parseAmount = formatUnit(symbol, amount, 'to', chain, 'ether')
        parseMinAmount = formatUnit(symbol, currency.minSendAmount, 'from', chain, 'ether')
      }

      if (parseAmount < currency.minSendAmount) {
        return setAmountErrorLabel(`Min amount is ${parseMinAmount} ${toUpper(symbol)}`)
      }
    }
  }

  const isCurrencyBalanceError =
    (tokenChain || toLower(symbol) === 'theta') &&
    currencyBalance !== null &&
    !isNetworkFeeLoading &&
    networkFee &&
    networkFee > currencyBalance

  const isButtonDisabled = (): boolean => {
    if (
      validateAddress(symbol, chain, address, tokenChain) &&
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
        if (bitcoinLike.coins().indexOf(chain) !== -1) {
          return true
        }
      }
      return false
    }
    return true
  }

  const onCancel = (): void => {
    logEvent({
      name: ADDRESS_SEND_CANCEL,
    })

    history.goBack()
  }

  const mapDropDownList = addresses
    .filter((address: string) => address !== selectedAddress)
    .map((address: string) => {
      return {
        logo: {
          symbol: symbol,
          width: 40,
          height: 40,
          br: 10,
          background: currency?.background,
          chain: tokenChain,
        },
        label: currency?.name,
        value: address,
      }
    })

  const onSelectDropDown = (index: number) => {
    setSelectedAddress(mapDropDownList[index].value)
  }

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const createExtraId = (): void => {
    const newExtraId = generateExtraId(symbol)

    if (newExtraId) {
      setExtraId(newExtraId)
    }
  }

  const extraIdInputButton = () => (
    <Tooltip text="Generate destination tag" direction="right">
      <Styles.InputButton onClick={createExtraId}>
        <SVG src="../../assets/icons/generateExtraid.svg" width={16} height={16} />
      </Styles.InputButton>
    </Tooltip>
  )

  const withExtraid = extraIdName?.length > 0

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack backTitle="Wallet" onBack={history.goBack} />
      <Styles.Container>
        <Styles.Row withExtraid={withExtraid}>
          {!extraIdName?.length ? <Styles.PageTitle>Send</Styles.PageTitle> : null}
          <Skeleton width={250} height={42} type="gray" mt={21} isLoading={balance === null}>
            <Styles.Balance>
              {numeral(balance).format('0.[000000]')} {toUpper(symbol)}
            </Styles.Balance>
          </Skeleton>
          <Skeleton width={130} height={23} mt={5} type="gray" isLoading={estimated === null}>
            <Styles.USDEstimated>{`$${price(estimated, 2)}`}</Styles.USDEstimated>
          </Skeleton>
        </Styles.Row>
        <Styles.Form onSubmit={onSubmitForm} withExtraid={withExtraid}>
          {addresses?.length ? (
            <CurrenciesDropdown
              label={currency?.name}
              value={selectedAddress}
              currencySymbol={symbol}
              currencyBr={10}
              background={currency?.background}
              list={mapDropDownList}
              onSelect={onSelectDropDown}
              disabled={addresses.length < 2}
              tokenChain={tokenChain}
              tokenName={tokenName}
            />
          ) : null}
          <TextInput
            label="Recipient Address"
            value={address}
            onChange={setAddress}
            errorLabel={addressErrorLabel}
            onBlurInput={onBlurAddressInput}
            disabled={balance === null}
          />
          {extraIdName?.length ? (
            <TextInput
              label={`${extraIdName} (optional)`}
              value={extraId}
              onChange={setExtraId}
              disabled={balance === null}
              button={extraIdInputButton()}
            />
          ) : null}
          <TextInput
            label={`Amount (${toUpper(symbol)})`}
            value={amount}
            onChange={setAmount}
            type="number"
            errorLabel={amountErrorLabel}
            onBlurInput={onBlurAmountInput}
            disabled={balance === null}
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
            <Button label="Send" onClick={onSend} disabled={isButtonDisabled()} ml={7.5} isSmall />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Send
