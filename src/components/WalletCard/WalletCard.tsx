import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Utils
import { getBalance, getEstimated } from '@utils/bitcoin'
import { toUpper } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  address: string
  symbol: string
  sumBalance: Function // Fix me type
  sumEstimated: Function // Fix me type
}

const WalletCard: React.FC<Props> = (props) => {
  const { address, symbol, sumBalance, sumEstimated } = props

  const currency = 'Bitcoin' // Fix me

  const [balance, setBalance] = React.useState<number | null>(null)
  const [estimated, setEstimated] = React.useState<number | null>(null)

  const history = useHistory()

  React.useEffect(() => {
    loadBalance()
  }, [])

  React.useEffect(() => {
    if (balance !== null) {
      if (balance === 0) {
        setEstimated(0)
        sumEstimated(0)
      } else {
        loadEstimated()
      }
    }
  }, [balance])

  const loadBalance = async () => {
    const tryGetBalance = await getBalance(address)
    setBalance(tryGetBalance || 0)
    sumBalance(tryGetBalance || 0)
  }

  const loadEstimated = async () => {
    if (balance) {
      const tryGetEstimated = await getEstimated(balance)
      setEstimated(tryGetEstimated)
      sumEstimated(tryGetEstimated || 0)
    }
  }

  const openWallet = (): void => {
    history.push('/receive', {
      currency,
      symbol,
      address,
    })
  }

  return (
    <Styles.Container onClick={openWallet}>
      <CurrencyLogo width={40} height={40} symbol="btc" />
      <Styles.Row>
        <Styles.Info>
          <Styles.CurrencyName>{currency}</Styles.CurrencyName>
          <Styles.Address>{address}</Styles.Address>
        </Styles.Info>
        <Styles.BalanceInfo>
          {balance !== null ? (
            <Styles.Balance>{`${balance} ${toUpper(symbol)}`}</Styles.Balance>
          ) : (
            <Skeleton width={110} height={16} type="gray" br={4} />
          )}
          {estimated !== null ? (
            <Styles.USDEstimated>{`$${estimated} USD`}</Styles.USDEstimated>
          ) : (
            <Skeleton width={80} height={15} type="gray" mt={9} br={4} />
          )}
        </Styles.BalanceInfo>
      </Styles.Row>
    </Styles.Container>
  )
}

export default WalletCard
