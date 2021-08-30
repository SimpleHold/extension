import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import Header from '@components/Header'
import Cover from '@components/Cover'
import Button from '@components/Button'
import CurrencyLogo from '@components/CurrencyLogo'

// Assets
import linkIcon from '@assets/icons/link.svg'
import copyIcon from '@assets/icons/copy.svg'

// Styles
import Styles from './styles'

const TxHistory: React.FC = () => {
  const history = useHistory()

  const onViewTx = (): void => {}

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack backTitle="History" onBack={history.goBack} />
      <Styles.Container>
        <Styles.Body>
          <Styles.Heading>
            <CurrencyLogo size={50} symbol="btc" />
            <Styles.HeadingInfo>
              <Styles.Amount>- 0.165558 BTC</Styles.Amount>
              <Styles.Estimated>$ 5.75</Styles.Estimated>
            </Styles.HeadingInfo>
          </Styles.Heading>

          <Styles.Info>
            <Styles.InfoColumn>
              <Styles.InfoColumnRow>
                <Styles.InfoLabel>Fee</Styles.InfoLabel>
                <Styles.InfoContent>
                  <Styles.InfoBold>0.0000234 BTC</Styles.InfoBold>
                  <Styles.InfoText>$ 1.75</Styles.InfoText>
                </Styles.InfoContent>
              </Styles.InfoColumnRow>
            </Styles.InfoColumn>
            <Styles.InfoColumn>
              <Styles.InfoColumnRow pb={7}>
                <Styles.InfoLabel>From</Styles.InfoLabel>
                <Styles.InfoContent>
                  <Styles.InfoBold>bc1q34aq5drpuwyw77gl9</Styles.InfoBold>
                </Styles.InfoContent>
              </Styles.InfoColumnRow>
              <Styles.InfoColumnRow pt={7}>
                <Styles.InfoLabel>To</Styles.InfoLabel>
                <Styles.InfoContent>
                  <Styles.InfoBold>bc1q34aq5drpuwyw77gl9</Styles.InfoBold>
                </Styles.InfoContent>
              </Styles.InfoColumnRow>
            </Styles.InfoColumn>
            <Styles.InfoColumn>
              <Styles.InfoColumnRow>
                <Styles.InfoLabel>Created</Styles.InfoLabel>
                <Styles.InfoContent>
                  <Styles.Date>July 1, 15:43:09</Styles.Date>
                </Styles.InfoContent>
              </Styles.InfoColumnRow>
            </Styles.InfoColumn>
          </Styles.Info>

          <Styles.HashBlock>
            <Styles.HashBlockRow>
              <Styles.Label>Transaction hash</Styles.Label>
              <Styles.Text>kk99kt1Eке23e...kk9ке9kt17Eye</Styles.Text>
            </Styles.HashBlockRow>
            <Styles.CopyButton>
              <SVG src={copyIcon} width={12} height={12} />
            </Styles.CopyButton>
          </Styles.HashBlock>
        </Styles.Body>
        <Button label="View on explorer" onClick={onViewTx} icon={linkIcon} />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default TxHistory
