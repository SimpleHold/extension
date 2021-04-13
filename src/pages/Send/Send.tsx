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
import { getWallets, IWallet } from '@utils/wallet'
import { toUpper, price } from '@utils/format'
import { getBalance, getUnspentOutputs, getFees } from '@utils/api'
import { logEvent } from '@utils/amplitude'
import bitcoinLike from '@utils/bitcoinLike'

// Config
import { ADDRESS_SEND, ADDRESS_SEND_CANCEL } from '@config/events'
import { getCurrency } from '@config/currencies'

// Hooks
import useDebounce from '@hooks/useDebounce'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: TSymbols
  address: string
  chain: string
}

const Send: React.FC = () => {
  const history = useHistory()
  const {
    state: { symbol, address: locationAddress, chain },
  } = useLocation<LocationState>()

  const currency = getCurrency(symbol)

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

  const debounced = useDebounce(amount, 1000)

  React.useEffect(() => {
    getWalletsList()
  }, [])

  React.useEffect(() => {
    getOutputs()
    loadBalance()
  }, [selectedAddress])

  React.useEffect(() => {
    if (amount.length && Number(balance) > 0 && outputs.length) {
      setNetworkFeeLoading(true)
      getNetworkFee()
    }
  }, [debounced])

  const getOutputs = async (): Promise<void> => {
    const unspentOutputs = await getUnspentOutputs(selectedAddress, chain)
    setOutputs(unspentOutputs)
  }

  const getNetworkFee = async (): Promise<void> => {
    const fee = await getFees(chain)
    setUtxosList([])

    const { networkFee, utxos } = new bitcoinLike(symbol).getNetworkFee(outputs, fee, amount)

    setUtxosList(utxos)
    setNetworkFee(networkFee)
    setNetworkFeeLoading(false)
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

    if (currency) {
      const { balance, balance_usd } = await getBalance(selectedAddress, currency?.chain)

      setBalance(balance)
      setEstimated(balance_usd)
    }
  }

  const onSend = (): void => {
    logEvent({
      name: ADDRESS_SEND,
    })

    history.push('/send-confirm', {
      amount: Number(amount),
      symbol,
      networkFee,
      addressFrom: selectedAddress,
      addressTo: address,
      outputs: utxosList,
    })
  }

  const onBlurAddressInput = (): void => {
    if (addressErrorLabel) {
      setAddressErrorLabel(null)
    }

    if (address.length && !new bitcoinLike(symbol).validate(address)) {
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

    if (
      `${amount}`.length &&
      balance !== null &&
      Number(amount) + Number(networkFee) > Number(balance)
    ) {
      setAmountErrorLabel('Insufficient funds')
    }

    if (currency) {
      const parseAmount = new bitcoinLike(symbol).toSat(Number(amount))
      const parseMinAmount = new bitcoinLike(symbol).fromSat(currency.minSendAmount)

      if (parseAmount < currency.minSendAmount) {
        setAmountErrorLabel(`Min. amount: ${parseMinAmount} ${toUpper(symbol)}`)
      }
    }
  }

  const isButtonDisabled = (): boolean => {
    return (
      !new bitcoinLike(symbol).validate(address) ||
      !amount.length ||
      Number(amount) <= 0 ||
      !outputs.length ||
      addressErrorLabel !== null ||
      amountErrorLabel !== null ||
      Number(balance) <= 0 ||
      networkFee === 0 ||
      isNetworkFeeLoading
    )
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
        },
        label: currency?.name,
        value: address,
      }
    })

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
        <Styles.Form>
          {addresses?.length ? (
            <CurrenciesDropdown
              label={currency?.name}
              value={selectedAddress}
              currencySymbol={symbol}
              currencyBr={10}
              background={currency?.background}
              list={mapDropDownList}
              onSelect={setSelectedAddress}
              disabled={addresses.length < 2}
            />
          ) : null}
          <TextInput
            label="Recipient Address"
            value={address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setAddress(e.target.value)}
            errorLabel={addressErrorLabel}
            onBlurInput={onBlurAddressInput}
            disabled={balance === null || Number(balance) <= 0}
          />
          <TextInput
            label={`Amount (${toUpper(symbol)})`}
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setAmount(e.target.value)}
            type="number"
            errorLabel={amountErrorLabel}
            onBlurInput={onBlurAmountInput}
            disabled={balance === null || Number(balance) <= 0}
          />
          <Styles.NetworkFeeBlock>
            <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
            {isNetworkFeeLoading ? (
              <Spinner ml={10} />
            ) : (
              <>
                {networkFee === 0 ? (
                  <Styles.NetworkFee>-</Styles.NetworkFee>
                ) : (
                  <Styles.NetworkFee>
                    {networkFee} {toUpper(symbol)}
                  </Styles.NetworkFee>
                )}
              </>
            )}
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
