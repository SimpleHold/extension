import * as React from 'react'
import SVG from 'react-inlinesvg'

// Components
import Header from '@components/Header'
import WalletCard from '@components/WalletCard'

// Styles
import Styles from './styles'

const Wallets: React.FC = () => (
  <Styles.Wrapper>
    <Header />
    <Styles.Row>
      <Styles.BalanceBlock>
        <Styles.TotalBalance>Total balance</Styles.TotalBalance>
        <Styles.BalanceAmount>0.2341034 BTC</Styles.BalanceAmount>
        <Styles.USDEstimated>$8,964.91 USD</Styles.USDEstimated>
      </Styles.BalanceBlock>
      <Styles.WalletsRow>
        <Styles.WalletsHeading>
          <Styles.WalletsLabel>Wallets</Styles.WalletsLabel>
          <Styles.AddWalletButton>
            <SVG src="../../assets/icons/plus.svg" width={16} height={16} title="plus" />
          </Styles.AddWalletButton>
        </Styles.WalletsHeading>
        <WalletCard
          currency="Bitcoin"
          address="1E2ypN23e...kRkRk99kt"
          balance={0.16823857}
          usdestimtaed={1000}
          symbol="BTC"
        />
        <WalletCard
          currency="Ethereum"
          address="0x8884EA9...84be238ee"
          balance={1.6725834}
          usdestimtaed={1000}
          symbol="ETH"
        />
      </Styles.WalletsRow>
    </Styles.Row>
  </Styles.Wrapper>
)

export default Wallets
