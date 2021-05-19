import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import numeral from 'numeral'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Skeleton from '@components/Skeleton'
import Spinner from '@components/Spinner'
import CurrenciesDropdown from '@components/CurrenciesDropdown'

// Utils
import { getWallets, IWallet, updateBalance } from '@utils/wallet'
import { toUpper, price } from '@utils/format'
import { getBalance, getUnspentOutputs, getFees } from '@utils/api'
import { logEvent } from '@utils/amplitude'
import { validateAddress, getAddressNetworkFee, formatUnit, isEthereumLike } from '@utils/address'

// Config
import { ADDRESS_SEND, ADDRESS_SEND_CANCEL } from '@config/events'
import { getCurrency, getCurrencyByChain } from '@config/currencies'
import { getToken } from '@config/tokens'

// Hooks
import useDebounce from '@hooks/useDebounce'

// Styles
import Styles from './styles'

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
  const getCurrencySymbol = tokenChain
    ? getCurrencyByChain(tokenChain)?.symbol
    : getCurrency(symbol)?.symbol

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
  const [utxosList, setUtxosList] = React.useState<UnspentOutput[]>([])
  const [isNetworkFeeLoading, setNetworkFeeLoading] = React.useState<boolean>(false)
  const [currencyBalance, setCurrencyBalance] = React.useState<number>(0)

  const debounced = useDebounce(amount, 1000)

  React.useEffect(() => {
    getWalletsList()
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

  const getOutputs = async (): Promise<void> => {
    if (contractAddress || isEthereumLike(symbol, chain)) {
      return
    }
    const unspentOutputs = await getUnspentOutputs(selectedAddress, chain)
    setOutputs(unspentOutputs)
  }

  const getNetworkFee = async (): Promise<void> => {
    const fee = await getFees(symbol, chain)
    setUtxosList([])

    const getTokenDecimals = tokenChain ? getToken(symbol, tokenChain)?.decimals : decimals

    const data = await getAddressNetworkFee(
      symbol,
      fee,
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

      if (data.currencyBalance) {
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
      networkFeeSymbol: getCurrencySymbol,
      addressFrom: selectedAddress,
      addressTo: address,
      outputs: utxosList,
      chain,
      contractAddress: tokenContractAddress || contractAddress,
      tokenChain,
      decimals: getTokenDecimals || decimals,
    })
  }

  const onBlurAddressInput = (): void => {
    if (addressErrorLabel) {
      setAddressErrorLabel(null)
    }

    if (address.length && !validateAddress(symbol, address, chain)) {
      setAddressErrorLabel('Address is not valid')
    }

    if (address === selectedAddress) {
      setAddressErrorLabel('Address same as sender')
    }
  }

  const onBlurAmountInput = (): void => {
    if (amountErrorLabel) {
      setAmountErrorLabel(null)
    }

    if (amount.length && Number(amount) + Number(networkFee) >= Number(balance)) {
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

  const isButtonDisabled = (): boolean => {
    if (
      validateAddress(symbol, address) &&
      amount.length &&
      Number(amount) > 0 &&
      addressErrorLabel === null &&
      amountErrorLabel === null &&
      Number(balance) > 0 &&
      networkFee > 0 &&
      !isNetworkFeeLoading
    ) {
      if (!outputs.length) {
        if (contractAddress || isEthereumLike(symbol, chain)) {
          return false
        }
        return true
      }
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

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack backTitle="Wallet" onBack={history.goBack} />
      <Styles.Container>
        <Styles.Row>
          <Styles.PageTitle>Send</Styles.PageTitle>
          <Skeleton width={250} height={42} type="gray" mt={21} isLoading={balance === null}>
            <Styles.Balance>
              {numeral(balance).format('0.[000000]')} {toUpper(symbol)}
            </Styles.Balance>
          </Skeleton>
          <Skeleton width={130} height={23} mt={5} type="gray" isLoading={estimated === null}>
            <Styles.USDEstimated>{`$${price(estimated, 2)} USD`}</Styles.USDEstimated>
          </Skeleton>
        </Styles.Row>
        <Styles.Form onSubmit={onSubmitForm}>
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
            <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
            {isNetworkFeeLoading ? (
              <Spinner ml={10} size={16} />
            ) : (
              <>
                {networkFee === 0 ? (
                  <Styles.NetworkFee>-</Styles.NetworkFee>
                ) : (
                  <Styles.NetworkFee>
                    {networkFee} {toUpper(getCurrencySymbol)}
                  </Styles.NetworkFee>
                )}
              </>
            )}
            {tokenChain && !isNetworkFeeLoading && networkFee && networkFee > currencyBalance ? (
              <Styles.NetworkFeeError>Insufficient funds</Styles.NetworkFeeError>
            ) : null}
          </Styles.NetworkFeeBlock>

          <Styles.Actions>
            <Button label="Cancel" isLight onClick={onCancel} mr={7.5} />
            <Button label="Send" onClick={onSend} disabled={isButtonDisabled()} ml={7.5} />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Send
