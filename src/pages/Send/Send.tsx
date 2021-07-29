import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import SendForm from './components/SendForm'

// Utils
import { toUpper } from '@utils/format'
import { getBalance } from '@utils/api'
import { THardware, updateBalance } from '@utils/wallet'

// Config
import { getCurrency } from '@config/currencies'
import { getToken } from '@config/tokens'

// Styles
import Styles from './styles'

interface LocationState {
  symbol: string
  address: string
  walletName: string
  chain?: string
  contractAddress?: string
  hardware?: THardware
}

const SendPage: React.FC = () => {
  const {
    state: { symbol, address, walletName, chain, contractAddress, hardware },
  } = useLocation<LocationState>()
  const history = useHistory()

  const [balance, setBalance] = React.useState<number | null>(null)
  const [estimated, setEstimated] = React.useState<number | null>(null)

  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)

  React.useEffect(() => {
    loadBalance()
  }, [])

  const loadBalance = async (): Promise<void> => {
    const { balance, balance_usd, balance_btc } = await getBalance(
      address,
      currency?.chain || chain,
      chain ? symbol : undefined,
      contractAddress
    )

    setBalance(balance)
    updateBalance(address, symbol, balance, balance_btc)
    setEstimated(balance_usd)
  }

  const onCancel = (): void => {
    history.goBack()
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle={`${currency?.name} wallet`} />
      <Styles.Container>
        <Styles.Title>Send {toUpper(symbol)}</Styles.Title>
        <SendForm
          symbol={symbol}
          onCancel={onCancel}
          balance={balance}
          estimated={estimated}
          hardware={hardware}
          walletName={walletName}
          address={address}
        />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default SendPage
