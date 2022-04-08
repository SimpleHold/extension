import * as React from 'react'
import { useHistory } from 'react-router-dom'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Utils
import { getBalance } from '@utils/currencies'
import { toUpper, numberFriendly, formatEstimated, getFormatBalance } from '@utils/format'
import {
  updateBalance,
  getLatestBalance,
  updateLast,
  getWalletChain, getBalanceChange, getBalancePrecision
} from '@utils/wallet'
import { logEvent } from '@utils/amplitude'
import updateTxsHistory from '@utils/history'
import { checkIfTimePassed } from '@utils/dates'


// Config
import { getSharedToken, getToken } from '@config/tokens'
import { getCurrency } from '@config/currencies'
import { BALANCE_CHANGED, ADDRESS_WATCH } from '@config/events'

// Assets
import ledgerLogo from '@assets/icons/ledger.svg'
import trezorLogo from '@assets/icons/trezor.svg'
import clockIcon from '@assets/icons/clock.svg'

// Styles
import Styles from './styles'

// Types
import { TWalletAmountData } from '@pages/Wallets/types'
import { TTxWallet } from '@utils/api/types'
import { THardware } from '@utils/wallet'
import { receiveAllPendingTxs, updateWalletActivationStatus } from 'utils/currencies/nano'


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
}

const emptyData = {
  balance: 0,
  balance_usd: 0,
  balance_btc: 0,
  pending: 0,
  pending_btc: 0
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
    isNotActivated
  } = props

  const sharedToken = getSharedToken(symbol, chain)
  const contractAddress = props.contractAddress || sharedToken?.address || (chain ? getToken(symbol, chain)?.address : undefined)

  const currency = chain ? getToken(symbol, chain) : getCurrency(symbol)
  const tokenSymbol = chain ? symbol : undefined

  const history = useHistory()

  const [balance, setBalance] = React.useState<number | null>(null)
  const [estimated, setEstimated] = React.useState<number | null>(null)
  const [pendingBalance, setPendingBalance] = React.useState<number>(0)
  const [notActivatedStatus, setActivationStatus] = React.useState<boolean>(!!isNotActivated)

  const walletData: TTxWallet = {
    chain: getWalletChain(symbol, chain),
    contractAddress,
    symbol,
    address,
    tokenSymbol
  }

  React.useEffect(() => {
    checkActivatedStatus()
    loadBalance()
  }, [])

  const checkActivatedStatus = () => {
    if (symbol === 'xno') {
      updateWalletActivationStatus(address).then(res => {
        if (res) {
          setActivationStatus(true)
        }
      })
    }
  }

  const loadBalance = async (): Promise<void> => {
    const savedData = getLatestBalance(address, chain, symbol)

    const isFetchReady = checkIfTimePassed(savedData.lastBalanceCheck || 0, { seconds: 20 })
    const isFullData = !Object.entries(savedData).find(v => v[1] === null)

    let data = notActivatedStatus ? emptyData : savedData

    const isFetchRequired = !notActivatedStatus && (isFetchReady || !isFullData)

    if (isFetchRequired) {
      updateLast('lastBalanceCheck', address, chain)

      const fetchedData = await getBalance(symbol, address, currency?.chain || chain, tokenSymbol, contractAddress)
      data = { ...data, ...fetchedData }
    }

    const { balance, balance_usd, balance_btc, pending, pending_btc } = data

    setBalance(balance)
    sumBalance && sumBalance({ uuid, symbol, amount: balance_btc || 0 })

    setPendingBalance(pending || 0)
    sumPending && sumPending({ uuid, symbol, amount: pending_btc || 0 })

    setEstimated(balance_usd)
    sumEstimated && sumEstimated({ uuid, symbol, amount: balance_usd || 0 })

    const precision = getBalancePrecision(symbol)
    const isBalanceChanged = getBalanceChange(savedData.balance, balance || 0, precision)
    const isPendingStatusChanged = !!savedData.pending !== !!pending

    if (isBalanceChanged || isPendingStatusChanged) {

      logEvent({
        name: BALANCE_CHANGED,
        properties: {
          symbol
        }
      })

      if (symbol === 'xno') {
        await receiveAllPendingTxs(address)
      }

      await updateTxsHistory({ updateSingleWallet: walletData })
      updateBalance({ address, symbol, balance, balance_btc, pending: pending, balance_usd, pending_btc: pending_btc })
      updateLast('lastActive', address, chain)
    }
  }

  const openWallet = (): void => {
    if (handleClick) {
      return handleClick()
    }

    logEvent({
      name: ADDRESS_WATCH,
      properties: {
        symbol
      }
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
      hardware
    })
  }

  return (
    <Styles.Wrapper onClick={openWallet}>
      <Styles.Container className={'container'}>
        <CurrencyLogo size={40} symbol={symbol} chain={chain} name={name} />
        <Styles.Row gridColumns={notActivatedStatus ? 'auto' : 'repeat(2,1fr)'}>
          <Styles.AddressInfo>
            <Styles.CurrencyInfo>
              {hardware ? (
                <Styles.HardwareIconRow className='hardware-icon'>
                  <SVG
                    src={hardware.type === 'ledger' ? ledgerLogo : trezorLogo}
                    width={12}
                    height={12}
                  />
                </Styles.HardwareIconRow>
              ) : null}
              <Styles.WalletName className='wallet-name'>{walletName}</Styles.WalletName>
            </Styles.CurrencyInfo>
            {notActivatedStatus ? (
              <Styles.ActivateBlock>
                <Styles.ActivateLabel>Need activation</Styles.ActivateLabel>
              </Styles.ActivateBlock>
            ) : (
              <Styles.AddressRow>
                <Styles.Address>{address}</Styles.Address>
              </Styles.AddressRow>
            )}
          </Styles.AddressInfo>
          {!notActivatedStatus ? (
            <Styles.Balances>
              <Skeleton width={110} height={16} type='gray' br={4} isLoading={balance === null}>
                <Styles.BalanceRow>
                  {pendingBalance !== 0 ? (
                    <Styles.PendingIcon>
                      <SVG src={clockIcon} width={12} height={12} />
                    </Styles.PendingIcon>
                  ) : null}
                  <Styles.Balance>
                    {`${getFormatBalance(balance)} ${toUpper(symbol)}`}
                  </Styles.Balance>
                </Styles.BalanceRow>
              </Skeleton>
              <Skeleton
                width={80}
                height={16}
                type='gray'
                mt={7}
                br={4}
                isLoading={estimated === null}
              >
                <Styles.Estimated>{`$ ${formatEstimated(
                  estimated,
                  numberFriendly(estimated)
                )}`}</Styles.Estimated>
              </Skeleton>
            </Styles.Balances>
          ) : null}
        </Styles.Row>
      </Styles.Container>
    </Styles.Wrapper>
  )
})

export default WalletCard
