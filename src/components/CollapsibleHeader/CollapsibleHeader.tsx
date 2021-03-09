import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import Header from '@components/Header'
import Skeleton from '@components/Skeleton'

// Utils
import { price } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  scrollPosition: number
  totalBalance: null | number
  totalEstimated: null | number
  onAddNewAddress: () => void
}

const CollapsibleHeader: React.FC<Props> = (props) => {
  const { scrollPosition, totalBalance, totalEstimated, onAddNewAddress } = props

  const collapsibleHeight = Math.max(100, 340 - 1.25 * scrollPosition)
  const walletsHeadingMT = Math.max(0, 200 - 1.1 * scrollPosition)

  const totalBalanceLabelOpacity = Math.max(0, 1 - 0.1 * scrollPosition)
  const totalBalanceLabelHeight = Math.max(0, 19 - 0.1 * scrollPosition)

  const balanceFontSize = Math.max(16, 36 - 0.5 * scrollPosition)
  const balanceLineHeight = Math.max(14, 36 - 0.5 * scrollPosition)
  const balanceMarginTop = Math.max(0, 21 - 0.5 * scrollPosition)

  const estimatedFontSize = Math.max(12, 20 - 0.5 * scrollPosition)
  const estimatedLineHeight = Math.max(14, 23 - 0.5 * scrollPosition)
  const estimatedMarginTop = Math.max(0, 11 - 0.5 * scrollPosition)

  const balanceBlockTop = Math.max(13, 80 - scrollPosition)
  const balanceBlockLeft = Math.max(0, 0 - scrollPosition)
  const balanceBlockPaddingTop = Math.max(0, 20 - scrollPosition)

  return (
    <Styles.Container style={{ height: collapsibleHeight }}>
      <Header />
      <Styles.BalanceBlock
        style={{
          paddingTop: balanceBlockPaddingTop,
          top: balanceBlockTop,
          left: balanceBlockLeft,
        }}
      >
        <Styles.TotalBalance
          style={{
            opacity: totalBalanceLabelOpacity,
            height: totalBalanceLabelHeight,
          }}
        >
          Total balance
        </Styles.TotalBalance>
        {totalBalance === null ? (
          <Skeleton width={250} height={36} type="light" mt={21} />
        ) : (
          <Styles.BalanceAmount
            style={{
              fontSize: balanceFontSize,
              marginTop: balanceMarginTop,
              lineHeight: `${balanceLineHeight}px`,
            }}
          >
            {totalBalance.toFixed(8)} BTC
          </Styles.BalanceAmount>
        )}
        {totalEstimated === null ? (
          <Skeleton width={130} height={23} type="light" mt={11} />
        ) : (
          <Styles.USDEstimated
            style={{
              fontSize: estimatedFontSize,
              lineHeight: `${estimatedLineHeight}px`,
              marginTop: estimatedMarginTop,
            }}
          >
            {`$${price(totalEstimated)} USD`}
          </Styles.USDEstimated>
        )}
      </Styles.BalanceBlock>
      <Styles.WalletsHeading style={{ marginTop: walletsHeadingMT }}>
        <Styles.WalletsLabel>Wallets</Styles.WalletsLabel>
        <Styles.AddWalletButton onClick={onAddNewAddress}>
          <SVG src="../../assets/icons/plus.svg" width={16} height={16} title="Add new wallet" />
        </Styles.AddWalletButton>
      </Styles.WalletsHeading>
    </Styles.Container>
  )
}

export default CollapsibleHeader
