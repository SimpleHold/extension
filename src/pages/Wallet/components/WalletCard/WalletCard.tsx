import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Utils
import { toUpper, price, getFormatEstimated, getFormatBalance } from '@utils/format'
import { logEvent } from '@utils/amplitude'
import { openWebPage } from '@utils/extension'

// Assets
import refreshIcon from '@assets/icons/refresh.svg'

// Config
import { ADDRESS_ACTION } from '@config/events'

// Styles
import Styles from './styles'

interface Props {
  openPage: (url: string) => () => void
  symbol: string
  chain?: string
  balance: null | number
  estimated: null | number
  onRefreshBalance: () => void
  isBalanceRefreshing: boolean
  address: string
  tokenName?: string
  isNotActivated: boolean
  onConfirmActivate: () => void
  hasUnreceivedTxs?: boolean
  onConfirmReceivePending?: () => void
}

const WalletCard: React.FC<Props> = (props) => {
  const {
    openPage,
    symbol,
    chain,
    balance,
    estimated,
    onRefreshBalance,
    isBalanceRefreshing,
    address,
    tokenName,
    isNotActivated,
    onConfirmActivate,
    hasUnreceivedTxs,
    onConfirmReceivePending
  } = props


  const [initialized, setInitialized] = React.useState(false)
  const [balanceWidth, setBalanceWidth] = React.useState(undefined)
  const [estimatedWidth, setEstimatedWidth] = React.useState(undefined)

  const balanceWidthRef: any = React.useRef(null)
  const estimatedWidthRef: any = React.useRef(null)

  React.useEffect(() => {
    const balanceWidth = balanceWidthRef.current?.clientWidth
    const estimatedWidth = estimatedWidthRef.current?.clientWidth
    balanceWidth && setBalanceWidth(balanceWidth)
    estimatedWidth && setEstimatedWidth(estimatedWidth)
  }, [isBalanceRefreshing, balance, estimated])

  React.useEffect(() => {
    if (balance !== null && !initialized) {
      setInitialized(true)
    }
  }, [balance])

  const onExchange = (): void => {
    logEvent({
      name: ADDRESS_ACTION,
      properties: {
        addressAction: 'exchange'
      }
    })
    openWebPage('https://simpleswap.io/?ref=2a7607295184')
  }

  const balanceHeight = symbol.length > 4 ? 20 : 24
  const estimatedMT = symbol.length > 4 ? 6 : 4

  return (
    <Styles.Container>
      <Styles.Body>
        <CurrencyLogo size={60} br={18} symbol={symbol} chain={chain} name={tokenName} />
        <Styles.WalletInfo>
          <Styles.BalanceRow>
            <Skeleton width={balanceWidth || 173} height={balanceHeight} type='gray' isLoading={balance === null}>
              <Styles.Balance ref={balanceWidthRef} height={balanceHeight}>
                {`${getFormatBalance(balance)} ${toUpper(symbol)}`}
              </Styles.Balance>
            </Skeleton>
            {!isNotActivated ? (
              <Styles.RefreshButton onClick={onRefreshBalance} isRefreshing={isBalanceRefreshing}>
                <SVG src={refreshIcon} width={16} height={16} />
              </Styles.RefreshButton>
            ) : null}
          </Styles.BalanceRow>
          <Skeleton
            width={estimatedWidth || 75}
            height={19}
            mt={estimatedMT}
            type='gray'
            isLoading={estimated === null}
          >
            <Styles.Estimated ref={estimatedWidthRef} mt={estimatedMT}>{`$ ${getFormatEstimated(
              estimated,
              price(estimated)
            )}`}</Styles.Estimated>
          </Skeleton>
        </Styles.WalletInfo>
      </Styles.Body>
      <Styles.Actions>

        {isNotActivated &&
        <Styles.ActionButton onClick={onConfirmActivate}>
          <Styles.ActionName>Activate</Styles.ActionName>
        </Styles.ActionButton>}

        {hasUnreceivedTxs && !isNotActivated &&
        <Styles.ActionButton onClick={onConfirmReceivePending}>
          <Styles.ActionName>Receive assets</Styles.ActionName>
        </Styles.ActionButton>}

        {!isNotActivated && !hasUnreceivedTxs &&
        <>
          <Styles.ActionButton onClick={openPage('/send')}>
            <Styles.ActionName>Send</Styles.ActionName>
          </Styles.ActionButton>
          <Styles.ActionButton onClick={openPage('/receive')}>
            <Styles.ActionName>Receive</Styles.ActionName>
          </Styles.ActionButton>
          <Styles.ActionButton onClick={onExchange}>
            <Styles.ActionName>Exchange</Styles.ActionName>
          </Styles.ActionButton>
        </>}
      </Styles.Actions>
    </Styles.Container>
  )
}

export default WalletCard