import * as React from 'react'

// Components
import Transaction from '../Transaction'

// Types
import { TAddressTx } from '@utils/api/types'

// Styles
import Styles from './styles'

interface Props {
  data: TAddressTx[] | null
  symbol: string
}

const TransactionHistory: React.FC<Props> = (props) => {
  const { data, symbol } = props

  return (
    <Styles.Container>
      <Styles.Heading>
        <Styles.HeadingRow>
          <Styles.Title>Transaction history</Styles.Title>
        </Styles.HeadingRow>
      </Styles.Heading>
      {data === null ? (
        <p>Loading...</p>
      ) : (
        <Styles.Body>
          {data?.length ? (
            <>
              <Styles.Date>Jun 30</Styles.Date>
              {data.map((transaction: TAddressTx) => {
                const { type, date, destination, amount, estimated } = transaction

                return (
                  <Transaction
                    key={date}
                    type={type}
                    date={date}
                    destination={destination}
                    amount={amount}
                    estimated={estimated}
                    symbol={symbol}
                  />
                )
              })}
            </>
          ) : (
            <Styles.EmptyHistory>
              <Styles.EmptyHistoryIcon />
              <Styles.EmptyHistoryText>
                Your transaction history will be displayed here
              </Styles.EmptyHistoryText>
            </Styles.EmptyHistory>
          )}
        </Styles.Body>
      )}
    </Styles.Container>
  )
}

export default TransactionHistory
