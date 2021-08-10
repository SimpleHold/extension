import * as React from 'react'
import SVG from 'react-inlinesvg'
import numeral from 'numeral'

// Components
import Header from '@components/Header'
import Skeleton from '@components/Skeleton'
import PendingBalance from '@components/PendingBalance'

// Utils
import { getItem } from '@utils/storage'

// Styles
import Styles from './styles'

interface Props {
  scrollPosition: number
  balance: null | number
  estimated: null | number
  pendingBalance: null | number
  isDrawersActive: boolean
  onShowDrawer: (drawerType: 'sort' | 'filters') => void
}

const CollapsibleHeader: React.FC<Props> = (props) => {
  const {
    scrollPosition,
    balance,
    estimated,
    pendingBalance,
    isDrawersActive,
    onShowDrawer,
  } = props

  const [latesScrollPosition, setLatestScrollPosition] = React.useState<number>(0)

  React.useEffect(() => {
    if (!isDrawersActive) {
      setLatestScrollPosition(scrollPosition)
    }
  }, [scrollPosition, isDrawersActive])

  const сontainerHeight = Math.max(110, 290 - 1.25 * latesScrollPosition)

  const balanceRowMarginTop = Math.max(3, 50 - latesScrollPosition)
  const balanceFontSize = Math.max(16, 36 - 0.2 * latesScrollPosition)
  const balanceLineHeight = Math.max(19, 36 - 0.1 * latesScrollPosition)

  const estimatedFontSize = Math.max(14, 20 - 0.2 * latesScrollPosition)
  const estimatedLineHeight = Math.max(16, 23 - 0.1 * latesScrollPosition)
  const estimatedMarginTop = Math.max(2, 11 - latesScrollPosition)

  const totalBalanceOpacity = Math.max(0, 1 - 0.1 * latesScrollPosition)
  const totalBalanceTop = Math.max(0, 70 - latesScrollPosition)
  const totalBalanceHeight = Math.max(0, 19 - latesScrollPosition)

  const pendingBalanceRowHeight = Math.max(0, 30 - 0.05 * latesScrollPosition)
  const pendingBalanceRowOpacity = Math.max(0, 1 - 0.05 * latesScrollPosition)
  const pendingBalanceRowMarginTop = Math.max(0, 10 - 0.05 * latesScrollPosition)

  const balanceSkeletonWidth = Math.max(150, 250 - latesScrollPosition)

  const clockIconSize = Math.max(12, 23 - 0.1 * latesScrollPosition)
  const clockIconMarginLeft = Math.max(6, 10 - latesScrollPosition)

  const walletsLabelFontSize = Math.max(0, 16 - 0.05 * latesScrollPosition)

  const isSortActive = (): boolean => {
    return getItem('activeSortKey') !== null || getItem('activeSortType') !== null
  }

  const isFiltersActive = (): boolean => {
    return (
      getItem('selectedCurrenciesFilter') !== null ||
      getItem('hiddenWalletsFilter') !== null ||
      getItem('zeroBalancesFilter') !== null
    )
  }

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
            {latesScrollPosition > 80 && pendingBalance !== null && Number(pendingBalance) > 0 ? (
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
              {`$ ${
                estimated !== 0 && estimated < 0.01
                  ? '< 0.01'
                  : numeral(estimated).format('0.[00000000]')
              }`}
            </Styles.Estimated>
          ) : null}
        </Skeleton>

        {pendingBalance !== null ? (
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

        <Styles.Bottom>
          <Styles.WalletsLabel
            style={{ fontSize: walletsLabelFontSize, opacity: latesScrollPosition > 50 ? 0 : 1 }}
          >
            Wallets
          </Styles.WalletsLabel>
          <Styles.Actions>
            <Styles.Button onClick={() => onShowDrawer('sort')}>
              <SVG src="../../assets/icons/sort.svg" width={18} height={14} />
              {isSortActive() ? <Styles.ButtonDot /> : null}
            </Styles.Button>
            <Styles.Button onClick={() => onShowDrawer('filters')}>
              <SVG src="../../assets/icons/filter.svg" width={18} height={14} />
              {isFiltersActive() ? <Styles.ButtonDot /> : null}
            </Styles.Button>
          </Styles.Actions>
        </Styles.Bottom>
      </Styles.Row>
    </Styles.Container>
  )
}

export default CollapsibleHeader
