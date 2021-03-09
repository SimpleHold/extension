import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Skeleton from '@components/Skeleton'
import Spinner from '@components/Spinner'

// Utils
import { getWallets, IWallet } from '@utils/wallet'
import { toUpper, price } from '@utils/format'
import {
  getBalance,
  getEstimated,
  getUnspentOutputs,
  getFees,
  IBitcoreUnspentOutput,
  IUnspentOutput,
} from '@utils/bitcoin'
import { validateBitcoinAddress, validateNumbersDot } from '@utils/validate'
import { logEvent } from '@utils/amplitude'

// Config
import { ADDRESS_SEND, ADDRESS_SEND_CANCEL } from '@config/events'

// Hooks
import useDebounce from '@hooks/useDebounce'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: string
  address: string
}

const Send: React.FC = () => {
  const history = useHistory()
  const {
    state: { symbol, address: locationAddress },
  } = useLocation<LocationState>()

  const [address, setAddress] = React.useState<string>('')
  const [amount, setAmount] = React.useState<string>('')
  const [addresses, setAddresses] = React.useState<string[]>([])
  const [selectedAddress, setSelectedAddress] = React.useState<string>(locationAddress)
  const [networkFee, setNetworkFee] = React.useState<number>(0)
  const [balance, setBalance] = React.useState<null | number>(null)
  const [estimated, setEstimated] = React.useState<null | number>(null)
  const [addressErrorLabel, setAddressErrorLabel] = React.useState<null | string>(null)
  const [amountErrorLabel, setAmountErrorLabel] = React.useState<null | string>(null)
  const [outputs, setOutputs] = React.useState<IUnspentOutput[]>([])
  const [utxosList, setUtxosList] = React.useState<IBitcoreUnspentOutput[]>([])
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
    const unspentOutputs = await getUnspentOutputs(selectedAddress)
    setOutputs(unspentOutputs)
  }

  const getNetworkFee = async (): Promise<void> => {
    const fee = await getFees()
    setUtxosList([])

    const sortOutputs = outputs.sort((a, b) => a.value - b.value)
    const utxos: IBitcoreUnspentOutput[] = []

    for (const output of sortOutputs) {
      const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)
      const transactionFeeBytes = window.getTransactionSize(utxos) * fee

      if (getUtxosValue >= window.btcToSat(Number(amount)) + transactionFeeBytes) {
        break
      }

      utxos.push({
        txId: output.tx_hash_big_endian,
        outputIndex: output.tx_output_n,
        script: output.script,
        satoshis: output.value,
        address: selectedAddress,
      })
    }

    setUtxosList(utxos)

    const transactionFeeBytes = window.getTransactionSize(utxos)
    setNetworkFee((transactionFeeBytes * fee) / 100000000)
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

    const fetchBalance = await getBalance(selectedAddress)
    setBalance(fetchBalance)

    if (fetchBalance !== 0) {
      const fetchEstimated = await getEstimated(fetchBalance)
      setEstimated(fetchEstimated)
    } else {
      setEstimated(0)
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

    if (address.length && !validateBitcoinAddress(address)) {
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
  }

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target

    if (validateNumbersDot(value)) {
      setAmount(value)
    }
  }

  const isButtonDisabled = (): boolean => {
    return (
      !validateBitcoinAddress(address) ||
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

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack backTitle="Wallet" onBack={history.goBack} />
      <Styles.Container>
        <Styles.Row>
          <Styles.PageTitle>Send</Styles.PageTitle>
          {balance !== null ? (
            <Styles.Balance>{`${balance} ${toUpper(symbol)}`}</Styles.Balance>
          ) : (
            <Skeleton width={250} height={42} type="gray" mt={21} />
          )}

          {estimated !== null ? (
            <Styles.USDEstimated>{`$${price(estimated, 2)} USD`}</Styles.USDEstimated>
          ) : (
            <Skeleton width={130} height={23} mt={5} type="gray" />
          )}
        </Styles.Row>
        <Styles.Form>
          {addresses?.length ? (
            <CurrenciesDropdown
              symbol={symbol}
              isDisabled={addresses.length < 2}
              selectedAddress={selectedAddress}
              addresses={addresses}
              setAddress={setSelectedAddress}
            />
          ) : null}
          <TextInput
            label="Recipient Address"
            value={address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setAddress(e.target.value)}
            errorLabel={addressErrorLabel}
            onBlurInput={onBlurAddressInput}
          />
          <TextInput
            label={`Amount (${toUpper(symbol)})`}
            value={amount}
            onChange={onChangeAmount}
            type="number"
            errorLabel={amountErrorLabel}
            onBlurInput={onBlurAmountInput}
          />
          <Styles.NetworkFeeBlock>
            <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
            {isNetworkFeeLoading ? (
              <Spinner ml={10} />
            ) : (
              <Styles.NetworkFee>
                {networkFee} {toUpper(symbol)}
              </Styles.NetworkFee>
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
