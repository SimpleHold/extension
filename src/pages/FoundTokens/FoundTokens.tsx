import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import TokenCard from '@components/TokenCard'

// Utils
import { TWeb3Symbols } from '@utils/web3'

// Styles
import Styles from './styles'

interface Props {
  symbol: TWeb3Symbols
}

const FoundTokens: React.FC<Props> = (props) => {
  const { symbol } = props

  const history = useHistory()

  const onSkip = (): void => {}

  const onConfirm = (): void => {}

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Select currency" />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Found tokens</Styles.Title>
          <Styles.Description>
            We found these ERC20 tokens on your address. Do you want to add them to your wallet?
          </Styles.Description>

          <Styles.TokensList>
            <TokenCard name="Tether" symbol="usdt" platform="eth" isActive />
          </Styles.TokensList>
        </Styles.Row>

        <Styles.Actions>
          <Button label="Skip" isLight isSmall mr={7.5} onClick={onSkip} />
          <Button label="Ok" isSmall ml={7.5} onClick={onConfirm} />
        </Styles.Actions>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default FoundTokens
