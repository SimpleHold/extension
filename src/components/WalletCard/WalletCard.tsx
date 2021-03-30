import * as React from 'react'
import { useHistory } from 'react-router-dom'
import numeral from 'numeral'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Utils
import { getCurrency } from '@config/currencies'
import { getBalance } from '@utils/bitcoin'
import { toUpper, numberFriendly } from '@utils/format'

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

  const fetchBalance = async (): Promise<void> => {
    if (currency) {
      const tryGetBalance = await getBalance(address, currency?.chain)

      if (tryGetBalance) {
        const { balance, balance_usd } = tryGetBalance

        setBalance(balance)
        sumBalance(balance)

        setEstimated(balance_usd)
        sumEstimated(balance_usd)
      } else {
        // const latestbalance = getLatestBalance(address)
        // setBalance(latestbalance)
        // sumBalance(latestbalance)
      }
    }
  }

  const openWallet = (): void => {
    history.push('/receive', {
      currency: currency?.name,
      symbol,
      address,
      chain: currency?.chain,
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
          <Skeleton width={106} height={16} type="gray" br={4} isLoading={balance === null}>
            <Styles.BalanceRow>
              <Styles.PendingIcon>
                <SVG src="../../assets/icons/clock.svg" width={12} height={12} />
              </Styles.PendingIcon>
              <Styles.Balance>{`${numeral(balance).format('0.[00000000]')} ${toUpper(
                symbol
              )}`}</Styles.Balance>
            </Styles.BalanceRow>
          </Skeleton>
          <Skeleton width={80} height={14} type="gray" mt={9} br={4} isLoading={estimated === null}>
            <Styles.Estimated>{`$${numberFriendly(estimated)} USD`}</Styles.Estimated>
          </Skeleton>
        </Styles.Balances>
      </Styles.Row>
    </Styles.Container>
  )
}

export default WalletCard
