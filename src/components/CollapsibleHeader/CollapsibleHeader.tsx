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

  const totalBalanceLabelOpacity = Math.max(0, 1 - 0.1 * scrollPosition)
  const totalBalanceLabelHeight = Math.max(0, 19 - 0.1 * scrollPosition)

  const balanceFontSize = Math.max(16, 36 - 0.2 * scrollPosition)
  const balanceLineHeight = Math.max(19, 36 - 0.2 * scrollPosition)

  const estimatedFontSize = Math.max(14, 20 - 0.4 * scrollPosition)
  const estimatedLineHeight = Math.max(16, 23 - 0.4 * scrollPosition)

  return (
    <Styles.Container style={{ height: сontainerHeight }}>
      <Header />

      <Styles.Row style={{ paddingTop: 10 }}>
        <Styles.TotalBalanceLabel
          style={{ opacity: totalBalanceLabelOpacity, height: totalBalanceLabelHeight }}
        >
          Total balance
        </Styles.TotalBalanceLabel>

        <Styles.BalanceRow style={{ marginTop: 21 }}>
          <Skeleton width={350} height={36} isLoading={balance === null} type="light">
            <Styles.Balance
              style={{ fontSize: balanceFontSize, lineHeight: `${balanceLineHeight}px` }}
            >
              {numeral(balance).format('0.[00000000]')} BTC
            </Styles.Balance>
          </Skeleton>
          <Styles.ClockIconRow style={{ height: 0, opacity: 0 }}>
            <SVG src="../../assets/icons/clock.svg" width={14} height={14} />
          </Styles.ClockIconRow>
        </Styles.BalanceRow>

        <Skeleton
          width={120}
          height={23}
          isLoading={estimated === null}
          mt={11}
          type="light"
          mb={10}
        >
          {estimated !== null ? (
            <Styles.Estimated
              style={{
                marginTop: 11,
                fontSize: estimatedFontSize,
                lineHeight: `${estimatedLineHeight}px`,
                marginBottom: 10,
              }}
            >{`$ ${price(estimated)}`}</Styles.Estimated>
          ) : null}
        </Skeleton>

        {pendingBalance !== null && Number(pendingBalance) > 0 ? (
          <PendingBalance btcValue={pendingBalance} type="light" />
        ) : null}
      </Styles.Row>

      <Styles.AddWalletBlock>
        <Styles.AddWalletLabel>Wallets</Styles.AddWalletLabel>
        <Styles.AddWalletButton onClick={onAddNewAddress}>
          <SVG src="../../assets/icons/plus.svg" width={16} height={16} title="Add new wallet" />
        </Styles.AddWalletButton>
      </Styles.AddWalletBlock>
    </Styles.Container>
  )
}

export default CollapsibleHeader
