import * as React from 'react'
import SVG from 'react-inlinesvg'
import numeral from 'numeral'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Utils
import { getBalance } from '@utils/api'
import { toUpper, numberFriendly, short, formatEstimated } from '@utils/format'
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
  symbol: string
  address: string
  walletName: string
  chain?: string
  name?: string
  hardware?: THardware
  contractAddress?: string
  onClickWallet: () => void
}

const Wallet: React.FC<Props> = (props) => {
  const {
    symbol,
    address,
    walletName,
    chain,
    name,
    hardware,
    contractAddress,
    onClickWallet,
  } = props

  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)

  const [balance, setBalance] = React.useState<number | null>(null)
  const [estimated, setEstimated] = React.useState<number | null>(null)
  const [pendingBalance, setPendingBalance] = React.useState<number>(0)

  React.useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async (): Promise<void> => {
    const { balance, balance_usd, balance_btc, pending } = await getBalance(
      address,
      currency?.chain || chain,
      chain ? symbol : undefined,
      contractAddress
    )

    setBalance(balance)
    updateBalance({address, symbol, balance, balance_btc, balance_usd, pending})
    setPendingBalance(pending)
    setEstimated(balance_usd)
  }

  return (
    <Styles.Container onClick={onClickWallet}>
      <CurrencyLogo size={40} symbol={symbol} chain={chain} name={name} />
      <Styles.Row>
        <Styles.WalletInfo>
          <Styles.WalletNameRow>
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
          </Styles.WalletNameRow>
          <Styles.Address>{short(address, 12)}</Styles.Address>
        </Styles.WalletInfo>
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
          <Skeleton width={80} height={17} type="gray" mt={7} br={4} isLoading={estimated === null}>
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

export default Wallet
