import * as React from 'react'
import SVG from 'react-inlinesvg'
import numeral from 'numeral'

// Components
import Skeleton from '@components/Skeleton'

// Utils
import { price, toUpper } from '@utils/format'
import { getEstimated } from '@utils/api'

// Styles
import Styles from './styles'

interface Props {
  btcValue: number
  type: 'light' | 'gray'
  symbol: string
}

const PendingBalance: React.FC<Props> = (props) => {
  const { btcValue, type, symbol } = props

  const [USDValue, setUSDValue] = React.useState<number | null>(null)

  React.useEffect(() => {
    getUSDEstimated()
  }, [btcValue])

  const getUSDEstimated = async (): Promise<void> => {
    const data = await getEstimated(btcValue, 'BTC', 'USD')
    setUSDValue(data)
  }

  return (
    <Styles.Container type={type}>
      <Styles.IconRow>
        <SVG src="../../assets/icons/clock.svg" width={16} height={16} />
      </Styles.IconRow>
      <Styles.Row>
        <Styles.BTCValue>
          {`${btcValue > 0 ? '+' : ''}${numeral(btcValue).format('0.[000000]')}`} {toUpper(symbol)}
        </Styles.BTCValue>
        <Skeleton width={56} height={14} isLoading={USDValue === null} type={type}>
          {USDValue ? (
            <Styles.USDValue>{`$ ${USDValue > 0 ? '+' : ''}${price(USDValue)}`}</Styles.USDValue>
          ) : null}
        </Skeleton>
      </Styles.Row>
    </Styles.Container>
  )
}

export default PendingBalance
