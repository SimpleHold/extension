import * as React from 'react'
import numeral from 'numeral'
import SVG from 'react-inlinesvg'

// Components
import CurrencyLogo from '@components/CurrencyLogo'
import Skeleton from '@components/Skeleton'

// Utils
import { toUpper, price } from '@utils/format'

// Assets
import refreshIcon from '@assets/icons/refresh.svg'

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
    tokenName,
  } = props

  return (
    <Styles.Container>
      <Styles.Body>
        <CurrencyLogo
          width={60}
          height={60}
          br={18}
          symbol={symbol}
          chain={chain}
          name={tokenName}
        />
        <Styles.WalletInfo>
          <Styles.BalanceRow>
            <Skeleton width={170} height={27} type="gray" isLoading={balance === null}>
              <Styles.Balance>
                {numeral(balance).format('0.[000000]')} {toUpper(symbol)}
              </Styles.Balance>
            </Skeleton>
            <Styles.RefreshButton onClick={onRefreshBalance} isRefreshing={isBalanceRefreshing}>
              <SVG src={refreshIcon} width={16} height={16} />
            </Styles.RefreshButton>
          </Styles.BalanceRow>
          <Skeleton width={100} height={19} mt={4} type="gray" isLoading={estimated === null}>
            {estimated !== null ? (
              <Styles.Estimated>{`$${price(estimated, 2)}`}</Styles.Estimated>
            ) : null}
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
      </Styles.Actions>
    </Styles.Container>
  )
}

export default WalletCard
