import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import Button from '@components/Button'
import SelectNetwork from '@components/SelectNetwork'

// Utils
import { TWeb3Symbols } from '@utils/web3'

// Styles
import Styles from './styles'

interface Props {
  symbol: TWeb3Symbols
}

const AddTokenToAddress: React.FC<Props> = (props) => {
  const { symbol } = props

  const history = useHistory()

  const onSkip = (): void => {
    history.push('/new-wallet', {
      symbol,
      warning:
        'You are trying to add new ERC20 token address. Corresponding Ethereum address will also be added to your wallet',
    })
  }

  const onConfirm = (): void => {}

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Select currency" />
      <Styles.Container>
        <Styles.Row>
          <Styles.Title>Add to ETH address</Styles.Title>
          <Styles.Description>
            You are trying to add new ERC20 token address. Do you want to associate one of your
            Ethereum address with Tether? Press Skip if you want to add new address
          </Styles.Description>

          <SelectNetwork platform="eth" list={['eth', 'bsc']} onSelect={() => null} />
        </Styles.Row>

        <Styles.Actions>
          <Button label="Skip" isLight isSmall mr={7.5} onClick={onSkip} />
          <Button label="Confirm" isSmall ml={7.5} onClick={onConfirm} />
        </Styles.Actions>
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default AddTokenToAddress
