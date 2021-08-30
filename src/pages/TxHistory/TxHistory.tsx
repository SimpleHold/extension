import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Header from '@components/Header'
import Cover from '@components/Cover'
import DividerLine from '@components/DividerLine'

import HistoryItem from './components/Item'

// Styles
import Styles from './styles'

const TxHistory: React.FC = () => {
  const history = useHistory()

  const openTx = (): void => {
    history.push('/tx')
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack backTitle="Home" onBack={history.goBack} />
      <Styles.Container>
        <Styles.Heading>
          <Styles.Title>History</Styles.Title>
          <Styles.Button>
            <SVG src="../../assets/icons/filter.svg" width={18} height={14} />
          </Styles.Button>
        </Styles.Heading>
        <Styles.Group>
          <Styles.GroupDateRow>
            <Styles.GroupDate>Jul 1</Styles.GroupDate>
          </Styles.GroupDateRow>

          <HistoryItem
            data={{
              symbol: 'btc',
              hash: 'sdfsdsfsdff324213r3x',
              name: 'Bitcoin Wallet',
              amount: 10,
              estimated: 0.001,
            }}
          />
          <DividerLine />
        </Styles.Group>

        <p onClick={openTx}>Click me</p>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default TxHistory
