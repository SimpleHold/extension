import * as React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Utils
import { getCurrency } from '../../config/currencies'
import { getBalance, getEstimated } from '@utils/bitcoin'
import { toUpper, numberFriendly, limitBalance } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  address: string
  symbol: string
  sumBalance: (balance: number) => void
  sumEstimated: (estimated: number) => void
}

const WalletCard: React.FC<Props> = (props) => {
  const { address, symbol, sumBalance, sumEstimated } = props
  const currency = getCurrency(symbol)

  const history = useHistory()

  const [balance, setBalance] = React.useState<number | null>(null)
  const [estimated, setEstimated] = React.useState<number | null>(null)

  React.useEffect(() => {
    fetchBalance()
  }, [])

  React.useEffect(() => {
    if (balance !== null) {
      if (balance === 0) {
        setEstimated(0)
        sumEstimated(0)
      } else {
        fetchEstimated()
      }
    }
  }, [balance])

  const fetchBalance = async (): Promise<void> => {
    const tryGetBalance = await getBalance(address)
    setBalance(tryGetBalance)
    sumBalance(tryGetBalance)
  }

  const fetchEstimated = async (): Promise<void> => {
    if (balance !== null) {
      const tryGetEstimated = await getEstimated(balance)
      setEstimated(tryGetEstimated)
      sumEstimated(tryGetEstimated)
    }
  }

  const openWallet = (): void => {
    history.push('/receive', {
      currency: currency?.name,
      symbol,
      address,
    })
  }

  return (
    <Styles.Container onClick={openWallet}>
      <CurrencyLogo width={40} height={40} symbol={symbol} />
      <Styles.Row>
        <Styles.AddressInfo>
          {currency ? <Styles.Currency>{currency.name}</Styles.Currency> : null}
          <Styles.Address>{address}</Styles.Address>
        </Styles.AddressInfo>
        <Styles.Balances>
          {balance !== null ? (
            <Styles.Balance>{`${limitBalance(balance, 10)} ${toUpper(symbol)}`}</Styles.Balance>
          ) : (
            <Skeleton width={106} height={16} type="gray" br={4} />
          )}

          {estimated !== null ? (
            <Styles.Estimated>{`$${numberFriendly(estimated)} USD`}</Styles.Estimated>
          ) : (
            <Skeleton width={80} height={14} type="gray" mt={9} br={4} />
          )}
        </Styles.Balances>
      </Styles.Row>
    </Styles.Container>
  )
}

export default WalletCard
