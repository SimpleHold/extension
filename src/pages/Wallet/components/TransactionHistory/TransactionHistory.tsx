import * as React from 'react'

// Components
import Transaction from '../Transaction'

// Styles
import Styles from './styles'

const TransactionHistory: React.FC = () => {
  return (
    <Styles.Container>
      <Styles.Heading>
        <Styles.HeadingRow>
          <Styles.Title>Transaction history</Styles.Title>
        </Styles.HeadingRow>
      </Styles.Heading>
      <Styles.Body>
        <Styles.Date>Jun 30</Styles.Date>
        <Transaction />
      </Styles.Body>
    </Styles.Container>
  )
}

export default TransactionHistory
