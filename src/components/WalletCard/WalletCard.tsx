import * as React from 'react';
import {useHistory} from 'react-router-dom';

// Components
import CurrencyLogo from '@components/CurrencyLogo';

// Styles
import Styles from './styles';

interface Props {
  currency: string;
  address: string;
  balance: number;
  usdestimtaed: number;
  symbol: string;
}

const WalletCard: React.FC<Props> = (props) => {
  const {currency, address, balance, usdestimtaed, symbol} = props;

  const history = useHistory();

  const openWallet = (): void => {
    history.push('/wallet');
  };

  return (
    <Styles.Container onClick={openWallet}>
      <CurrencyLogo width={40} height={40} symbol="btc" />
      <Styles.Row>
        <Styles.Info>
          <Styles.CurrencyName>{currency}</Styles.CurrencyName>
          <Styles.Address>{address}</Styles.Address>
        </Styles.Info>
        <Styles.BalanceInfo>
          <Styles.Balance>{`${balance} ${symbol}`}</Styles.Balance>
          <Styles.USDEstimated>{usdestimtaed}</Styles.USDEstimated>
        </Styles.BalanceInfo>
      </Styles.Row>
    </Styles.Container>
  );
};

export default WalletCard;
