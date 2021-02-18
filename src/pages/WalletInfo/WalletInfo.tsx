import * as React from 'react';
import QRCode from 'qrcode.react';

// Components
import Header from '@components/Header';
import Button from '@components/Button';
import CurrencyLogo from '@components/CurrencyLogo';

// Styles
import Styles from './styles';

const WalletInfo: React.FC = () => (
  <Styles.Wrapper>
    <Header />
    <Styles.Container>
      <Styles.Wallet>
        <Styles.Actions>
          <Styles.UpdateBalanceBlock>
            <Styles.UpdateBalanceLabel>Balance</Styles.UpdateBalanceLabel>
            <Styles.UpdateBalanceIcon />
          </Styles.UpdateBalanceBlock>
          <Styles.More>
            <Styles.MoreIcon />
          </Styles.More>
        </Styles.Actions>
        <Styles.Currency>
          <CurrencyLogo width={24} height={24} symbol="btc" />
          <Styles.CurrenyName>Bitcoin</Styles.CurrenyName>
        </Styles.Currency>
        <Styles.Balance>0.16823857 BTC</Styles.Balance>
        <Styles.USDEstimated>$5,712.75 USD</Styles.USDEstimated>
      </Styles.Wallet>
      <Styles.AddressInfo>
        <QRCode value="adfdsff" width={150} height={150} />
        <Styles.Address>
          bc1q34aq5drpuwy3wgl9lhup9892qp6svr8ldzyy7c
        </Styles.Address>
        <Button label="Send BTC" />
      </Styles.AddressInfo>
    </Styles.Container>
  </Styles.Wrapper>
);

export default WalletInfo;
