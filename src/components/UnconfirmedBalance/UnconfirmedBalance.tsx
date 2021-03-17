import * as React from 'react'

// Utils
import { price } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  value: number
}

const UnconfirmedBalance: React.FC<Props> = (props) => {
  const { value } = props

  const [USDValue, setUSDValue] = React.useState<number>(0)

  React.useEffect(() => {
    setUSDValue(value * 1000) // Fix me
  }, [value])

  return (
    <Styles.Container>
      <Styles.Title>Unconfirmed balance:</Styles.Title>
      <Styles.Values>
        <Styles.BTCValue>{value} BTC</Styles.BTCValue>
        <Styles.USDValue>{`$${price(USDValue)} USD`}</Styles.USDValue>
      </Styles.Values>
    </Styles.Container>
  )
}

export default UnconfirmedBalance
