import * as React from 'react'
import SVG from 'react-inlinesvg'
import numeral from 'numeral'

// Components
import Header from '@components/Header'
import Skeleton from '@components/Skeleton'
import PendingBalance from '@components/PendingBalance'
import HeaderMainButtons from '@components/HeaderMainButtons'

// Utils
import { getFormatEstimated, price } from '@utils/format'

// Assets
import clockIconPending from '@assets/icons/clockIconPending.svg'

// Styles
import Styles from './styles'

interface Props {
  isCollapsed: boolean
  balance: null | number
  estimated: null | number
  pendingBalance: null | number
  onClickReceive: () => void
  onClickSend: () => void
}

const CollapsibleHeader: React.FC<Props> = React.memo((props) => {
  const { isCollapsed, balance, estimated, pendingBalance, onClickReceive, onClickSend } = props

  const containerHeight = isCollapsed ? 123 : 276

  const balanceRowMarginTop = isCollapsed ? 3 : 15
  const balanceFontSize = isCollapsed ? 16 : 36
  const balanceLineHeight = isCollapsed ? 19 : 36

  const estimatedFontSize = isCollapsed ? 14 : 20
  const estimatedLineHeight = isCollapsed ? 16 : 25
  const estimatedMarginTop = isCollapsed ? 2 : 8

  const pendingBalanceRowHeight = isCollapsed ? 30 : 30
  const pendingBalanceRowOpacity = isCollapsed ? 0 : 1
  const pendingBalanceRowMarginTop = isCollapsed ? 0 : 10

  const balanceSkeletonWidth = isCollapsed ? 150 : 250

  const clockIconSize = isCollapsed ? 12 : 23
  const clockIconMarginLeft = isCollapsed ? 6 : 10

  const formatEstimated = getFormatEstimated(estimated, price(estimated))

  return (
    <Styles.Container style={{ height: containerHeight }}>
      <Header isHomePage whiteLogo />

      <Styles.Row>
        <Skeleton
          width={balanceSkeletonWidth}
          height={balanceFontSize}
          isLoading={balance === null}
          type="light"
          mt={balanceRowMarginTop}
        >
          <Styles.BalanceRow style={{ marginTop: balanceRowMarginTop }}>
            <Styles.Balance
              style={{
                fontSize: balanceFontSize,
                lineHeight: `${balanceLineHeight}px`,
              }}
            >
              {numeral(balance).format('0.[000000]')} BTC
            </Styles.Balance>
            {isCollapsed && pendingBalance !== null && Number(pendingBalance) > 0 ? (
              <Styles.ClockIcon
                style={{
                  width: clockIconSize,
                  height: clockIconSize,
                  marginLeft: clockIconMarginLeft,
                }}
              >
                <SVG src={clockIconPending} width={clockIconSize} height={clockIconSize} />
              </Styles.ClockIcon>
            ) : null}
          </Styles.BalanceRow>
        </Skeleton>

        <Skeleton
          width={120}
          height={estimatedLineHeight}
          isLoading={estimated === null}
          mt={estimatedMarginTop}
          type="light"
        >
          {estimated !== null ? (
            <Styles.Estimated
              style={{
                marginTop: estimatedMarginTop,
                fontSize: estimatedFontSize,
                lineHeight: `${estimatedLineHeight}px`,
              }}
            >
              <span className={'usdSign'}>$</span>
              <span className={'amount'}>{formatEstimated}</span>
            </Styles.Estimated>
          ) : null}
        </Skeleton>

        {pendingBalance !== null && Number(pendingBalance) > 0 ? (
          <Styles.PendingBalanceRow
            style={{
              height: pendingBalanceRowHeight,
              opacity: pendingBalanceRowOpacity,
              marginTop: pendingBalanceRowMarginTop,
            }}
          >
            <PendingBalance pending={pendingBalance} type="light" symbol="btc" />
          </Styles.PendingBalanceRow>
        ) : null}

        <HeaderMainButtons
          isCollapsed={!isCollapsed}
          onClickReceive={onClickReceive}
          onClickSend={onClickSend}
        />
      </Styles.Row>
    </Styles.Container>
  )
})

export default CollapsibleHeader
