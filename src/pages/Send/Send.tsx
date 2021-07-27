import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import Cover from '@components/Cover'
import Header from '@components/Header'
import SendForm from './components/SendForm'

// Styles
import Styles from './styles'

interface Props {}

const SendPage: React.FC<Props> = (props) => {
  const {} = props

  const history = useHistory()

  return (
    <Styles.Wrapper>
      <Cover />
      <Header withBack onBack={history.goBack} backTitle="Home" />
      <Styles.Container>
        <Styles.Title>Send BTC</Styles.Title>
        <SendForm />
      </Styles.Container>
    </Styles.Wrapper>
  )
}

export default SendPage
