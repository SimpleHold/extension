import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import CurrencyLogo from '@components/CurrencyLogo'

// Styles
import Styles from './styles'

interface Props {
  params: string
}

const Receive: React.FC<Props> = (props) => {
  const { params } = props

  const history = useHistory()

  const onBack = () => {
    history.push('/wallets')
  }

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={onBack} backTitle="Home" />
      <Styles.Container>
        <Styles.Row>
          <Styles.Heading>
            <Styles.UpdateBalanceBlock>
              <Styles.BalanceLabel>Balance</Styles.BalanceLabel>
              <Styles.RefreshIconRow>
                <Styles.RefreshIcon />
              </Styles.RefreshIconRow>
            </Styles.UpdateBalanceBlock>
            <Styles.MoreButton>
              <Styles.MoreIcon />
            </Styles.MoreButton>
          </Styles.Heading>

          <Styles.CurrencyBlock>
            <CurrencyLogo symbol="btc" width={22} height={22} />
            <Styles.CurrencyName>Bitcoin</Styles.CurrencyName>
          </Styles.CurrencyBlock>

          <Styles.Balance>0.16823857 BTC</Styles.Balance>
          <Styles.USDEstimated>$5,712.75 USD</Styles.USDEstimated>
        </Styles.Row>
        <Styles.ReceiveBlock>
          <Styles.QRCode />
          <Styles.Address>bc1q34aq5drpuwy3wgl9lhup9892qp6svr8ldzyy7c</Styles.Address>
          <Button label="Send BTC" onClick={() => null} />
        </Styles.ReceiveBlock>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default Receive
