import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Utils
import { toUpper, numberFriendly, getFormatEstimated, getFormatBalance } from '@utils/format'
import { logEvent } from '@utils/metrics'
import { getLatestBalance, IWallet, THardware } from '@utils/wallet'
import { getItem } from '@utils/storage'

// Config
import { getSharedToken, getToken } from '@tokens/index'
import { getCurrencyInfo } from '@config/currencies/utils'
import { MAIN_SELECT_WALLET } from '@config/events'

// Assets
import ledgerLogo from '@assets/icons/ledger.svg'
import trezorLogo from '@assets/icons/trezor.svg'
import clockIcon from '@assets/icons/clockIconPending.svg'

// Styles
import Styles from './styles'

// Types
import { TWalletAmountData } from '@pages/Wallets/types'

interface Props {
  address: string
  symbol: string
  chain?: string
  name?: string
  contractAddress?: string
  decimals?: number
  isHidden?: boolean
  sumBalance?: (walletData: TWalletAmountData) => void
  sumEstimated?: (walletData: TWalletAmountData) => void
  sumPending?: (walletData: TWalletAmountData) => void
  handleClick?: () => void
  walletName: string
  uuid: string
  hardware?: THardware
  isNotActivated?: boolean
  isRedirect?: string
  enableSkeleton?: boolean
  wallet: IWallet
  containerStyle?: Object
}

const emptyData = {
  balance: 0,
  balance_usd: 0,
  balance_btc: 0,
  pending: 0,
  pending_btc: 0,
}

const WalletCard: React.FC<Props> = React.memo((props) => {
  const {
    address,
    symbol,
    chain,
    name,
    decimals,
    isHidden,
    sumBalance,
    sumEstimated,
    sumPending,
    handleClick,
    walletName,
    uuid,
    hardware,
    isNotActivated,
    isRedirect,
    enableSkeleton,
    wallet,
    containerStyle,
  } = props

  const sharedToken = getSharedToken(symbol, chain)
  const contractAddress =
    props.contractAddress ||
    sharedToken?.address ||
    (chain ? getToken(symbol, chain)?.address : undefined)

  const currency = chain ? getToken(symbol, chain) : getCurrencyInfo(symbol)

  const history = useHistory()

  const [balance, setBalance] = React.useState<number | null>(null)
  const [estimated, setEstimated] = React.useState<number | null>(null)
  const [pendingBalance, setPendingBalance] = React.useState<number>(0)

  React.useEffect(() => {
    loadBalance()
  }, [enableSkeleton])

  const loadBalance = async (): Promise<void> => {
    const savedData = getLatestBalance(address, symbol)

    const data = isNotActivated ? emptyData : savedData

    const { balance, balance_usd, balance_btc, pending, pending_btc } = data

    setBalance(balance)
    sumBalance && sumBalance({ uuid, symbol, amount: balance_btc || 0 })

    setPendingBalance(pending || 0)
    sumPending && sumPending({ uuid, symbol, amount: pending_btc || 0 })

    setEstimated(balance_usd)
    sumEstimated && sumEstimated({ uuid, symbol, amount: balance_usd || 0 })
  }

  const openWallet = (): void => {
    if (handleClick) {
      return handleClick()
    }

    logEvent({
      name: MAIN_SELECT_WALLET,
      properties: {
        symbol,
      },
    })

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
      isRedirect,
      wallet,
    })
  }

  return (
    <Styles.Wrapper onClick={openWallet} className={'walletCard'} style={containerStyle}>
      <Styles.Container className={'container'}>
        <Styles.Card>
          <CurrencyLogo size={40} symbol={symbol} chain={chain} name={name} />
          <Styles.Row gridColumns={isNotActivated ? 'auto' : 'repeat(2,1fr)'}>
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
              {isNotActivated ? (
                <Styles.ActivateBlock>
                  <Styles.ActivateLabel>Activation is required</Styles.ActivateLabel>
                </Styles.ActivateBlock>
              ) : (
                <Styles.AddressRow>
                  <Styles.Address>{address}</Styles.Address>
                </Styles.AddressRow>
              )}
            </Styles.AddressInfo>
            {!isNotActivated ? (
              <Styles.Balances>
                <Skeleton width={110} height={16} type="gray" br={4} isLoading={!!enableSkeleton}>
                  <Styles.BalanceRow>
                    <Styles.Balance>
                      {`${getFormatBalance(balance) || 0} ${toUpper(symbol)}`}
                    </Styles.Balance>
                    {pendingBalance !== 0 ? (
                      <Styles.PendingIcon>
                        <SVG src={clockIcon} width={16} height={16} />
                      </Styles.PendingIcon>
                    ) : null}
                  </Styles.BalanceRow>
                </Skeleton>
                <Skeleton
                  width={80}
                  height={16}
                  type="gray"
                  mt={7}
                  br={4}
                  isLoading={!!enableSkeleton}
                >
                  <Styles.Estimated>{`$ ${getFormatEstimated(
                    estimated,
                    numberFriendly(estimated)
                  )}`}</Styles.Estimated>
                </Skeleton>
              </Styles.Balances>
            ) : null}
          </Styles.Row>
        </Styles.Card>
      </Styles.Container>
    </Styles.Wrapper>
  )
})

export default WalletCard
