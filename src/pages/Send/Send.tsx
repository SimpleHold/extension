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
import { getWallets } from '@utils/wallet'
import { toUpper, price } from '@utils/format'
import { getBalance, getEstimated } from '@utils/bitcoin'

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
  const [networkFee, setNetworkFee] = React.useState<number>(0.0001)
  const [balance, setBalance] = React.useState<null | number>(null)
  const [estimated, setEstimated] = React.useState<null | number>(null)

  React.useEffect(() => {
    getWalletsList()
    loadBalance()
  }, [])

  const getWalletsList = (): void => {
    const walletsList = getWallets(symbol)

    if (walletsList) {
      setAddresses(walletsList)
    }
  }

  const loadBalance = async (): Promise<void> => {
    const fetchBalance = await getBalance(locationAddress)
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
          />
          <TextInput
            label={`Amount (${toUpper(symbol)})`}
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setAmount(e.target.value)}
            type="number"
          />
          <Styles.NetworkFeeBlock>
            <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
            <Styles.NetworkFee>
              {networkFee} {toUpper(symbol)}
            </Styles.NetworkFee>
          </Styles.NetworkFeeBlock>

          <Styles.Actions>
            <Button label="Cancel" isLight onClick={() => null} mr={7.5} />
            <Button label="Send" onClick={onSend} ml={7.5} />
          </Styles.Actions>
        </Styles.Form>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Send
