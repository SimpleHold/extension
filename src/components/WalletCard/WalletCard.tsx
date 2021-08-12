import * as React from 'react'
import { useHistory } from 'react-router-dom'
import numeral from 'numeral'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Utils
import { getBalance } from '@utils/api'
import { toUpper, numberFriendly, formatEstimated } from '@utils/format'
import { updateBalance, THardware } from '@utils/wallet'

// Config
import { getToken } from '@config/tokens'
import { getCurrency } from '@config/currencies'

// Assets
import ledgerLogo from '@assets/icons/ledger.svg'
import trezorLogo from '@assets/icons/trezor.svg'
import clockIcon from '@assets/icons/clock.svg'

// Styles
import Styles from './styles'

interface Props {
  address: string
  symbol: string
  chain?: string
  name?: string
  contractAddress?: string
  decimals?: number
  isHidden?: boolean
  sumBalance?: (balance: number) => void
  sumEstimated?: (estimated: number) => void
  sumPending?: (pending: number) => void
  handleClick?: () => void
  walletName: string
  uuid: string
  hardware?: THardware
}

const WalletCard: React.FC<Props> = (props) => {
  const {
    address,
    symbol,
    chain,
    name,
    contractAddress,
    decimals,
    isHidden,
    sumBalance,
    sumEstimated,
    sumPending,
    handleClick,
    walletName,
    uuid,
    hardware,
  } = props

  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)
  const tokenSymbol = chain ? symbol : undefined

  const history = useHistory()

  const [balance, setBalance] = React.useState<number | null>(null)
  const [estimated, setEstimated] = React.useState<number | null>(null)
  const [pendingBalance, setPendingBalance] = React.useState<number>(0)

  React.useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async (): Promise<void> => {
    const { balance, balance_usd, balance_btc, pending, pending_btc } = await getBalance(
      address,
      currency?.chain || chain,
      tokenSymbol,
      contractAddress
    )

    setBalance(balance)
    if (sumBalance) {
      sumBalance(balance_btc)
    }
    updateBalance(address, symbol, balance, balance_btc)

    setPendingBalance(pending)
    if (sumPending) {
      sumPending(pending_btc)
    }

    setEstimated(balance_usd)
    if (sumEstimated) {
      sumEstimated(balance_usd)
    }
  }

  const openWallet = (): void => {
    if (handleClick) {
      return handleClick()
    }
    history.push('/wallet', {
      name: currency?.name || name,
      symbol,
      address,
      chain,
      contractAddress,
      tokenName: name,
      decimals,
      isHidden,
      walletName,
      uuid,
      hardware,
    })
  }

  return (
    <Styles.Container onClick={openWallet}>
      <CurrencyLogo size={40} symbol={symbol} chain={chain} name={name} />
      <Styles.Row>
        <Styles.AddressInfo>
          <Styles.CurrencyInfo>
            {hardware ? (
              <Styles.HardwareIconRow className="hardware-icon">
                <SVG
                  src={hardware.type === 'ledger' ? ledgerLogo : trezorLogo}
                  width={12}
                  height={12}
                />
              </Styles.HardwareIconRow>
            ) : null}
            <Styles.WalletName className="wallet-name">{walletName}</Styles.WalletName>
          </Styles.CurrencyInfo>
          <Styles.Address>{address}</Styles.Address>
        </Styles.AddressInfo>
        <Styles.Balances>
          <Skeleton width={110} height={16} type="gray" br={4} isLoading={balance === null}>
            <Styles.BalanceRow>
              {pendingBalance !== 0 ? (
                <Styles.PendingIcon>
                  <SVG src={clockIcon} width={12} height={12} />
                </Styles.PendingIcon>
              ) : null}
              <Styles.Balance>{`${numeral(balance).format('0.[000000]')} ${toUpper(
                symbol
              )}`}</Styles.Balance>
            </Styles.BalanceRow>
          </Skeleton>
          <Skeleton width={80} height={16} type="gray" mt={7} br={4} isLoading={estimated === null}>
            <Styles.Estimated>{`$ ${formatEstimated(
              estimated,
              numberFriendly(estimated)
            )}`}</Styles.Estimated>
          </Skeleton>
        </Styles.Balances>
      </Styles.Row>
    </Styles.Container>
  )
}

export default WalletCard
