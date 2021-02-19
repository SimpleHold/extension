import * as React from 'react'
import { Link } from 'react-router-dom'

// Styles
import Styles from './styles'

interface Props {
  params: string
}

const Receive: React.FC<Props> = (props) => {
  return (
    <Styles.Wrapper>
      <Link to="/wallets">Wallets</Link>
    </Styles.Wrapper>
  )
}

export default Receive
