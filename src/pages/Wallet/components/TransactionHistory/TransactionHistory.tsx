import * as React from 'react'
import dayjs from 'dayjs'

// Components
import Transaction from '../Transaction'
import Skeleton from '@components/Skeleton'

// Types
import { TAddressTxGroup, TAddressTx } from '@utils/api/types'

// Styles
import Styles from './styles'

interface Props {
  data: TAddressTxGroup[] | null
  symbol: string
}

const TransactionHistory: React.FC<Props> = (props) => {
  const { data, symbol } = props

  return (
    <Styles.Container>
      <Styles.Title>Last transactions</Styles.Title>

      {data === null ? (
        <Styles.TxGroup>
          <Styles.DateRow>
            <Skeleton width={50} height={16} type="gray" isLoading />
          </Styles.DateRow>
          <Transaction isLoading />
          <Transaction isLoading />
        </Styles.TxGroup>
      ) : null}

      {data !== null && data.length === 0 ? (
        <Styles.EmptyHistory>
          <Styles.EmptyHistoryIcon />
          <Styles.EmptyHistoryText>
            Your transaction history will be displayed here
          </Styles.EmptyHistoryText>
        </Styles.EmptyHistory>
      ) : null}

      {data !== null && data.length > 0
        ? data.map((group: TAddressTxGroup) => {
            const { date, data } = group

            return (
              <Styles.TxGroup key={date}>
                <Styles.DateRow>
                  <Styles.TxDate>{dayjs(date).format('MMM D')}</Styles.TxDate>
                </Styles.DateRow>
                {data.map((tx: TAddressTx) => {
                  const { type, date, hash, amount, estimated, isPending } = tx

                  return (
                    <Transaction
                      key={hash}
                      data={{
                        type,
                        date,
                        hash,
                        amount,
                        estimated,
                        symbol,
                        isPending,
                      }}
                    />
                  )
                })}
              </Styles.TxGroup>
            )
          })
        : null}
    </Styles.Container>
  )
}

export default TransactionHistory
