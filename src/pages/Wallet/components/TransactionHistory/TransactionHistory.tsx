import * as React from 'react'
import SVG from 'react-inlinesvg'
import dayjs from 'dayjs'

// Components
import Transaction from '../Transaction'
import Skeleton from '@components/Skeleton'

// Types
import { TAddressTxGroup, TAddressTx } from '@utils/api/types'

// Assets
import txArrowIcon from '@assets/icons/txArrow.svg'

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
      {data === null || data.length > 0 ? (
        <Styles.Heading>
          <Styles.HeadingRow>
            <Styles.Title>Transaction history</Styles.Title>
            <Styles.SubTitleRow>
              <Styles.SubTitle>Last 30 days</Styles.SubTitle>
              <Styles.Icon />
            </Styles.SubTitleRow>
          </Styles.HeadingRow>
          <Styles.HeadingButton>
            <SVG src={txArrowIcon} width={7.47} height={14} />
          </Styles.HeadingButton>
        </Styles.Heading>
      ) : null}

      {data === null ? (
        <Styles.TxGroup>
          <Styles.DateRow>
            <Skeleton width={50} height={16} type="gray" isLoading />
          </Styles.DateRow>
          <Transaction isLoading />
          <Transaction isLoading />
        </Styles.TxGroup>
      ) : null}

      {data?.length === 0 ? (
        <Styles.EmptyHistory>
          <Styles.EmptyHistoryIcon />
          <Styles.EmptyHistoryText>
            Your transaction history will be displayed here
          </Styles.EmptyHistoryText>
        </Styles.EmptyHistory>
      ) : null}

      {data && data?.length > 0 ? (
        <>
          {data.map((group: TAddressTxGroup) => {
            const { date, data } = group

            return (
              <Styles.TxGroup key={date}>
                <Styles.DateRow>
                  <Styles.TxDate>{dayjs(date).format('MMM D')}</Styles.TxDate>
                </Styles.DateRow>
                {data.map((tx: TAddressTx) => {
                  const { type, date, destination, amount, estimated } = tx

                  return (
                    <Transaction
                      key={date}
                      data={{
                        type,
                        date,
                        destination,
                        amount,
                        estimated,
                        symbol,
                      }}
                    />
                  )
                })}
              </Styles.TxGroup>
            )
          })}
        </>
      ) : null}
    </Styles.Container>
  )
}

export default TransactionHistory
