import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import TextInput from '@components/TextInput'
import Button from '@components/Button'
import Skeleton from '@components/Skeleton'

// Utils
import { getWallets, IWallet } from '@utils/wallet'
import { toUpper, price } from '@utils/format'
import {
  getBalance,
  getEstimated,
  getUnspentOutputs,
  IUnspentOutput,
  getTransactionFeeBytes,
  getFees,
} from '@utils/bitcoin'
import { validateBitcoinAddress, validateNumbersDot } from '@utils/validate'

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

  const debounced = useDebounce(amount, 1000)

  React.useEffect(() => {
    getWalletsList()
  }, [])

  React.useEffect(() => {
    getOutputs()
    loadBalance()
  }, [selectedAddress])

  React.useEffect(() => {
    if (amount.length && balance !== null && balance > 0) {
      getNetworkFee()
    }
  }, [debounced])

  const getOutputs = async (): Promise<void> => {
    const unspentOutputs = await getUnspentOutputs(selectedAddress)
    setOutputs(unspentOutputs)
  }

  const getNetworkFee = async (): Promise<void> => {
    if (outputs && amount != null && Number(amount) > 0) {
      const utxos = []

      for (const output of outputs) {
        const getUtxosValue = utxos.reduce((a, b) => a + b.satoshis, 0)

        if (getUtxosValue >= Number(amount) * 100000000) {
          break
        }

        utxos.push({
          txId: output.tx_hash,
          outputIndex: output.tx_output_n,
          script: output.script,
          satoshis: output.value,
          address: selectedAddress,
        })
      }

      const fee = await getFees()

      const transactionFeeBytes = getTransactionFeeBytes(utxos)
      setNetworkFee((transactionFeeBytes * fee) / 100000000)
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
    history.push('/send-confirm', {
      amount: Number(amount),
      symbol,
      networkFee,
      addressFrom: selectedAddress,
      addressTo: address,
    })
  }

  const onBlurAddressInput = (): void => {
    if (addressErrorLabel) {
      setAddressErrorLabel(null)
    }

    if (address.length && !validateBitcoinAddress(address)) {
      setAddressErrorLabel('Address is not valid')
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
    return false
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
            <Styles.NetworkFee>
              {networkFee} {toUpper(symbol)}
            </Styles.NetworkFee>
          </Styles.NetworkFeeBlock>

          <Styles.Actions>
            <Button label="Cancel" isLight onClick={history.goBack} mr={7.5} />
            <Button label="Send" onClick={onSend} disabled={isButtonDisabled()} ml={7.5} />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Send
