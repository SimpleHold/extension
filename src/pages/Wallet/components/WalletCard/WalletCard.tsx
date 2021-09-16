import * as React from 'react'
import numeral from 'numeral'
import SVG from 'react-inlinesvg'
import copy from 'copy-to-clipboard'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Utils
import { toUpper, price, formatEstimated } from '@utils/format'
import { logEvent } from '@utils/amplitude'

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
  } = props

  const [isCopied, setIsCopied] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }, [isCopied])

  const copyAddress = (): void => {
    copy(address)
    setIsCopied(true)

    logEvent({
      name: ADDRESS_ACTION,
      properties: {
        addressAction: 'copy',
      },
    })
  }

  const balanceHeight = symbol.length > 4 ? 20 : 24
  const estimatedMT = symbol.length > 4 ? 6 : 4

  return (
    <Styles.Container>
      <Styles.Body>
        <CurrencyLogo size={60} br={18} symbol={symbol} chain={chain} name={tokenName} />
        <Styles.WalletInfo>
          <Styles.BalanceRow>
            <Skeleton width={173} height={balanceHeight} type="gray" isLoading={balance === null}>
              <Styles.Balance height={balanceHeight}>
                {numeral(balance).format('0.[000000]')} {toUpper(symbol)}
              </Styles.Balance>
            </Skeleton>
            <Styles.RefreshButton onClick={onRefreshBalance} isRefreshing={isBalanceRefreshing}>
              <SVG src={refreshIcon} width={16} height={16} />
            </Styles.RefreshButton>
          </Styles.BalanceRow>
          <Skeleton
            width={75}
            height={19}
            mt={estimatedMT}
            type="gray"
            isLoading={estimated === null}
          >
            <Styles.Estimated mt={estimatedMT}>{`$ ${formatEstimated(
              estimated,
              price(estimated)
            )}`}</Styles.Estimated>
          </Skeleton>
        </Styles.WalletInfo>
      </Styles.Body>
      <Styles.Actions>
        <Styles.ActionButton onClick={openPage('/send')}>
          <Styles.ActionName>Send</Styles.ActionName>
        </Styles.ActionButton>
        <Styles.ActionButton onClick={openPage('/receive')}>
          <Styles.ActionName>Receive</Styles.ActionName>
        </Styles.ActionButton>
        <Styles.ActionButton onClick={copyAddress}>
          <Styles.ActionName>{isCopied ? 'Copied!' : 'Copy'}</Styles.ActionName>
        </Styles.ActionButton>
      </Styles.Actions>
    </Styles.Container>
  )
}

export default WalletCard
