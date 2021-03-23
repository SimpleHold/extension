import * as React from 'react'
import SVG from 'react-inlinesvg'

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
    <Styles.Container>
      <Styles.IconRow>
        <SVG src="../../assets/icons/clock.svg" width={16} height={16} />
      </Styles.IconRow>
      <Styles.Row>
        <Styles.BTCValue>+ 0.16823857 BTC</Styles.BTCValue>
        <Styles.USDValue>$ 8,964.91</Styles.USDValue>
      </Styles.Row>
    </Styles.Container>
  )
}

export default UnconfirmedBalance
