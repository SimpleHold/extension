import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import Header from '@components/Header'
import WalletCard from '@components/WalletCard'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => {
  const [scrollPosition, setScrollPosition] = React.useState<number>(0)

  const collapsibleHeight = Math.max(100, 340 - 1.25 * scrollPosition)
  const walletsHeadingMT = Math.max(0, 200 - scrollPosition)

  const totalBalanceLabelOpacity = Math.max(0, 1 - 0.1 * scrollPosition)
  const totalBalanceLabelHeight = Math.max(0, 19 - 0.1 * scrollPosition)

  const balanceFontSize = Math.max(16, 36 - 0.5 * scrollPosition)
  const balanceLineHeight = Math.max(14, 42 - 0.5 * scrollPosition)
  const balanceMarginTop = Math.max(0, 21 - 0.5 * scrollPosition)

  const estimatedFontSize = Math.max(12, 20 - 0.5 * scrollPosition)
  const estimatedLineHeight = Math.max(14, 23 - 0.5 * scrollPosition)
  const estimatedMarginTop = Math.max(0, 5 - 0.5 * scrollPosition)

  const balanceBlockTop = Math.max(13, 80 - scrollPosition)
  const balanceBlockLeft = Math.max(0, 0 - scrollPosition)
  const balanceBlockPaddingTop = Math.max(0, 20 - scrollPosition)
  const balanceBlockPaddingHorizontal = Math.max(0, 30 - scrollPosition)

  const handleScroll = () => {
    const position = window.pageYOffset
    setScrollPosition(position)
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Styles.Wrapper>
      <Styles.Collapsible style={{ height: collapsibleHeight }}>
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
          <Styles.BalanceAmount
            style={{
              fontSize: balanceFontSize,
              marginTop: balanceMarginTop,
              lineHeight: `${balanceLineHeight}px`,
            }}
          >
            0.2341034 BTC
          </Styles.BalanceAmount>
          <Styles.USDEstimated
            style={{
              fontSize: estimatedFontSize,
              lineHeight: `${estimatedLineHeight}px`,
              marginTop: estimatedMarginTop,
            }}
          >
            $8,964.91 USD
          </Styles.USDEstimated>
        </Styles.BalanceBlock>
        <Styles.WalletsHeading style={{ marginTop: walletsHeadingMT }}>
          <Styles.WalletsLabel>Wallets</Styles.WalletsLabel>
          <Styles.AddWalletButton>
            <SVG src="../../assets/icons/plus.svg" width={16} height={16} title="plus" />
          </Styles.AddWalletButton>
        </Styles.WalletsHeading>
      </Styles.Collapsible>
      <Styles.WalletsList style={{ zIndex: scrollPosition > 200 ? 1 : 3 }}>
        {Array(10)
          .fill('wallet')
          .map((i: string, index: number) => (
            <WalletCard
              key={index}
              currency="Bitcoin"
              address="1E2y3e...kk99kt"
              balance={0.16823857}
              usdestimtaed={1000}
              symbol="BTC"
            />
          ))}
      </Styles.WalletsList>
    </Styles.Wrapper>
  )
}

export default Wallets
