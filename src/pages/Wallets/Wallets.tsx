import * as React from 'react'
import SVG from 'react-inlinesvg'
import { useHistory } from 'react-router-dom'

// Components
import Header from '@components/Header'
import WalletCard from '@components/WalletCard'
import Skeleton from '@components/Skeleton'

// Hooks
import useScroll from '@hooks/useScroll'

// Styles
import Styles from './styles'
import { IWallet } from 'utils/backup'

const Wallets: React.FC = () => {
  const history = useHistory()
  const { scrollPosition } = useScroll()

  const [wallets, setWallets] = React.useState<any | null>(null) // Fix me
  const [totalBalance, setTotalBalance] = React.useState<number | null>(0)
  const [totalEstimated, setTotalEstimated] = React.useState<number | null>(0)

  React.useEffect(() => {
    getWallets()
  }, [])

  const openPage = (path: string): void => {
    history.push(path)
  }

  const getWallets = () => {
    const storageWallets = localStorage.getItem('wallets')

    if (storageWallets) {
      const parseWallets = JSON.parse(storageWallets)
      const mapWallets = parseWallets.wallets.map((wallet: IWallet) => {
        return {
          symbol: wallet.symbol,
          address: wallet.address,
        }
      })
      setWallets(mapWallets)
    }
  }

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
  const balanceBlockPaddingHorizontal = Math.max(0, 30 - scrollPosition)

  const sumBalance = (amount: number) => {
    setTotalBalance(amount) // Fix me
  }

  const sumEstimated = (amount: number) => {
    setTotalEstimated(amount) // Fix me
  }

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
              {totalBalance} BTC
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
              {`$${totalEstimated} USD`}
            </Styles.USDEstimated>
          )}
        </Styles.BalanceBlock>
        <Styles.WalletsHeading style={{ marginTop: walletsHeadingMT }}>
          <Styles.WalletsLabel>Wallets</Styles.WalletsLabel>
          <Styles.AddWalletButton onClick={() => openPage('/new-wallet')}>
            <SVG src="../../assets/icons/plus.svg" width={16} height={16} title="plus" />
          </Styles.AddWalletButton>
        </Styles.WalletsHeading>
      </Styles.Collapsible>
      {wallets?.length ? (
        <Styles.WalletsList style={{ zIndex: scrollPosition > 200 ? 1 : 3 }}>
          {wallets.map((wallet: any) => {
            const { address, symbol } = wallet

            return (
              <WalletCard
                key={address}
                address={address}
                symbol={symbol.toLowerCase()}
                sumBalance={sumBalance}
                sumEstimated={sumEstimated}
              />
            )
          })}
        </Styles.WalletsList>
      ) : null}
    </Styles.Wrapper>
  )
}

export default Wallets
