import * as React from 'react'
import SVG from 'react-inlinesvg'
import numeral from 'numeral'

// Components
import Skeleton from '@components/Skeleton'

// Utils
import { toUpper } from '@utils/format'
import { getEstimated } from '@utils/api'

// Assets
import clockIconPending from '@assets/icons/clockIconPending.svg'

// Styles
import Styles from './styles'

interface Props {
  pending: number
  type: 'light' | 'gray'
  symbol: string
}

const PendingBalance: React.FC<Props> = ({ pending, type, symbol }) => {
  const [USDValue, setUSDValue] = React.useState<number>(0)

  React.useEffect(() => {
    if (pending !== 0) {
      getUSDEstimated()
    }
  }, [pending])

  const getUSDEstimated = async (): Promise<void> => {
    const data = await getEstimated(pending, symbol, 'USD')
    setUSDValue(data)
  }

  const formatUsdValue = numeral(USDValue).format('0.[00000000]')
  const isValidFormatUsd = !Number.isNaN(formatUsdValue) && formatUsdValue !== 'NaN'

  if (USDValue !== 0) {
    return (
      <Styles.Container type={type}>
        <Styles.IconRow>
          <SVG src={clockIconPending} width={16} height={16} />
        </Styles.IconRow>
        <Styles.Row>
          <Styles.Pending>
            {pending < 0.000001
              ? '< 0.000001'
              : `${pending > 0 ? '+' : ''}${numeral(pending).format('0.[000000]')}`}{' '}
            {toUpper(symbol)}
          </Styles.Pending>
          <Skeleton width={56} height={14} isLoading={USDValue === null} type={type}>
            {USDValue ? (
              <Styles.USDValue>{`$ ${USDValue > 0 ? '+' : ''}${
                isValidFormatUsd ? formatUsdValue : '< 0.000001'
              }`}</Styles.USDValue>
            ) : null}
          </Skeleton>
        </Styles.Row>
      </Styles.Container>
    )
  }

  return null
}

export default PendingBalance
