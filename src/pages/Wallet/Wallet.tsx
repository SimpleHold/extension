import * as React from 'react'
import { useLocation, useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Heading from './components/Heading'
import WalletCard from './components/WalletCard'
import TransactionHistory from './components/TransactionHistory'

// Styles
import Styles from './styles'

interface LocationState {
  name: string
  symbol: string
  address: string
  chain?: string
  contractAddress?: string
  tokenName?: string
  decimals?: number
  isHidden?: boolean
}

const WalletPage: React.FC = () => {
  const {
    state,
    state: {
      name,
      symbol,
      address,
      chain = undefined,
      contractAddress = undefined,
      tokenName = undefined,
      decimals = undefined,
      isHidden = false,
    },
  } = useLocation<LocationState>()
  const history = useHistory()

  const openPage = (url: string) => () => {
    history.push(url, state)
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Home" />
      <Styles.Container>
        <Styles.Row>
          <Heading />
          <WalletCard openPage={openPage} symbol={symbol} chain={chain} />
        </Styles.Row>
        <TransactionHistory />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default WalletPage
