import * as React from 'react'
import { observer } from 'mobx-react-lite'

// Components
import LightHeader from '@components/LightHeader'
import SendProgress from './components/SendProgress'
import WalletCard from './components/WalletCard'
import SendForm from './components/SendForm'
import SendButton from './components/SendButton'

// Utils
import { toUpper } from '@utils/format'
import { getEstimated } from '@utils/api'

// Store
import { useSendStore } from '@store/send/store'

// Styles
import Styles from './styles'

interface Props {
  onNext: () => void
  onBack: () => void
  symbol: string
  openFrom?: string
}

const SendContainer: React.FC<Props> = (props) => {
  const { onNext, onBack, symbol, openFrom } = props

  const { wallet, coinPrice, setCoinPrice } = useSendStore()

  React.useEffect(() => {
    if (wallet) {
      onGetEstimated()
    }
  }, [wallet])

  const onGetEstimated = async (): Promise<void> => {
    const request = await getEstimated(1, formatSymbol(), 'usd')

    setCoinPrice(request)
  }

  const formatSymbol = (): string => {
    if (wallet) {
      const { chain, symbol } = wallet

      if (chain === 'avax' && symbol.indexOf('.') !== -1) {
        return symbol.split('.')[0]
      }

      if (chain === 'oeth') {
        return 'op'
      }

      if (chain === 'arbitrum') {
        return 'eth'
      }

      if (symbol === 'aeth' && !chain) {
        return 'eth'
      }

      return symbol
    }

    return ''
  }

  return (
    <Styles.Container>
      {openFrom !== 'browser' ? (
        <LightHeader title={`Send ${toUpper(symbol)}`} onBack={onBack} />
      ) : null}
      <Styles.Row openFrom={openFrom}>
        <Styles.Top>
          <SendProgress step="send" />
          <SendForm coinPrice={coinPrice} openFrom={openFrom} />
        </Styles.Top>
        <Styles.Bottom>
          <WalletCard />
          {openFrom !== 'browser' ? <SendButton onNext={onNext} /> : null}
        </Styles.Bottom>
      </Styles.Row>
    </Styles.Container>
  )
}

export default observer(SendContainer)
