import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import CurrenciesDropdown from '@components/CurrenciesDropdown'
import TextInput from '@components/TextInput'
import Button from '@components/Button'

// Utils
import { getWallets } from '@utils/backup'
import { toUpper } from '@utils/format'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: string
  address: string
}

const Send: React.FC = () => {
  const history = useHistory()
  const { state: locationState } = useLocation<LocationState>()

  const [address, setAddress] = React.useState<string>('')
  const [amount, setAmount] = React.useState<string>('')
  const [addresses, setAddresses] = React.useState<string[]>([])
  const [selectedAddress, setSelectedAddress] = React.useState<string>(locationState.address)
  const [networkFee, setNetworkFee] = React.useState<number>(0.0001)

  React.useEffect(() => {
    getWalletsList()
  }, [])

  const getWalletsList = (): void => {
    const walletsList = getWallets(locationState.symbol)

    if (walletsList) {
      setAddresses(walletsList)
    }
  }

  const onSend = (): void => {
    history.push('/send-confirm', {
      amount: 0.002,
      symbol: 'btc',
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
          <Styles.Balance>0.16823857 BTC</Styles.Balance>
          <Styles.USDEstimated>$5,712.75 USD</Styles.USDEstimated>
        </Styles.Row>
        <Styles.Form>
          {addresses?.length ? (
            <CurrenciesDropdown
              symbol={locationState.symbol}
              isDisabled={addresses?.length < 2}
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
            label="Amount (BTC)"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setAmount(e.target.value)}
          />
          <Styles.NetworkFeeBlock>
            <Styles.NetworkFeeLabel>Network fee:</Styles.NetworkFeeLabel>
            <Styles.NetworkFee>
              {networkFee} {toUpper(locationState.symbol)}
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
