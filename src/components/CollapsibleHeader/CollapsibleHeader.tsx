import * as React from 'react'
import SVG from 'react-inlinesvg'
import numeral from 'numeral'

// Components
import Header from '@components/Header'
import Skeleton from '@components/Skeleton'
import PendingBalance from '@components/PendingBalance'

// Utils
import { price } from '@utils/format'

// Styles
import Styles from './styles'

interface Props {
  onAddNewAddress: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  scrollPosition: number
  balance: null | number
  estimated: null | number
  pendingBalance: null | number
}

const CollapsibleHeader: React.FC<Props> = (props) => {
  const { onAddNewAddress, scrollPosition, balance, estimated, pendingBalance } = props

  const сontainerHeight = Math.max(110, 290 - 1.25 * scrollPosition)

  const balanceRowMarginTop = Math.max(3, 50 - scrollPosition)
  const balanceFontSize = Math.max(16, 36 - 0.2 * scrollPosition)
  const balanceLineHeight = Math.max(19, 36 - 0.1 * scrollPosition)

  const estimatedFontSize = Math.max(14, 20 - 0.2 * scrollPosition)
  const estimatedLineHeight = Math.max(16, 23 - 0.1 * scrollPosition)
  const estimatedMarginTop = Math.max(2, 11 - scrollPosition)

  const totalBalanceOpacity = Math.max(0, 1 - 0.1 * scrollPosition)
  const totalBalanceTop = Math.max(0, 70 - scrollPosition)
  const totalBalanceHeight = Math.max(0, 19 - scrollPosition)

  const pendingBalanceRowHeight = Math.max(0, 30 - 0.05 * scrollPosition)
  const pendingBalanceRowOpacity = Math.max(0, 1 - 0.05 * scrollPosition)
  const pendingBalanceRowMarginTop = Math.max(0, 10 - 0.05 * scrollPosition)

  const balanceSkeletonWidth = Math.max(150, 250 - scrollPosition)

  const clockIconSize = Math.max(12, 23 - 0.1 * scrollPosition)
  const clockIconMarginLeft = Math.max(6, 10 - scrollPosition)

  return (
    <Styles.Container style={{ height: сontainerHeight }}>
      <Header />

      <Styles.Row>
        <Styles.TotalBalanceLabel
          style={{ opacity: totalBalanceOpacity, top: totalBalanceTop, height: totalBalanceHeight }}
        >
          Total balance
        </Styles.TotalBalanceLabel>

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
            {scrollPosition > 80 && pendingBalance !== null && Number(pendingBalance) > 0 ? (
              <Styles.ClockIcon
                style={{
                  width: clockIconSize,
                  height: clockIconSize,
                  marginLeft: clockIconMarginLeft,
                }}
              >
                <SVG
                  src="../../assets/icons/clock.svg"
                  width={clockIconSize}
                  height={clockIconSize}
                />
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
          mb={10}
        >
          {estimated !== null ? (
            <Styles.Estimated
              style={{
                marginTop: estimatedMarginTop,
                fontSize: estimatedFontSize,
                lineHeight: `${estimatedLineHeight}px`,
              }}
            >
              {`$ ${price(estimated)}`}
            </Styles.Estimated>
          ) : null}
        </Skeleton>

        {pendingBalance !== null && Number(pendingBalance) !== 0 ? (
          <Styles.PendingBalanceRow
            style={{
              height: pendingBalanceRowHeight,
              opacity: pendingBalanceRowOpacity,
              marginTop: pendingBalanceRowMarginTop,
            }}
          >
            <PendingBalance btcValue={pendingBalance} type="light" symbol="btc" />
          </Styles.PendingBalanceRow>
        ) : null}

        <Styles.AddWallet>
          <Styles.AddWalletLabel style={{ opacity: 0, height: 0 }}>Wallets</Styles.AddWalletLabel>

          <Styles.AddWalletButton onClick={onAddNewAddress}>
            <SVG src="../../assets/icons/plus.svg" width={16} height={16} title="Add new wallet" />
          </Styles.AddWalletButton>
        </Styles.AddWallet>
      </Styles.Row>
    </Styles.Container>
  )
}

export default CollapsibleHeader
