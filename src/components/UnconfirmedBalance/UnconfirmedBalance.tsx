import * as React from 'react'

// Components
import Skeleton from '@components/Skeleton'

// Utils
import { price } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  btcValue: number
  type: 'light' | 'gray'
}

const UnconfirmedBalance: React.FC<Props> = (props) => {
  const { btcValue, type } = props

  const [USDValue, setUSDValue] = React.useState<number | null>(null)

  React.useEffect(() => {
    setUSDValue(btcValue * 1000) // Fix me
  }, [btcValue])

  return (
    <Styles.Container type={type}>
      <Styles.Title type={type}>Unconfirmed balance:</Styles.Title>
      <Styles.Values>
        <Styles.BTCValue type={type}>{btcValue} BTC</Styles.BTCValue>
        <Skeleton width={80} height={14} isLoading={USDValue === null} type={type}>
          {USDValue ? (
            <Styles.USDValue type={type}>{`$${price(USDValue)} USD`}</Styles.USDValue>
          ) : null}
        </Skeleton>
      </Styles.Values>
    </Styles.Container>
  )
}

export default UnconfirmedBalance
