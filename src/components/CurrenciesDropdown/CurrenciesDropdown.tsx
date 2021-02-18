import * as React from 'react';

// Components
import CurrencyLogo from '@components/CurrencyLogo';

// Styles
import Styles from './styles';

interface Props {
  symbol: string;
}

const CurrenciesDropdown: React.FC<Props> = (props) => {
  const {symbol} = props;

  return (
    <Styles.Container>
      <CurrencyLogo symbol={symbol} width={40} height={40} />
      <Styles.Row>
        <Styles.Address>bc1q34aq5duw...gl9lhup92q</Styles.Address>
        <Styles.Button>
          <Styles.ArrowIcon />
        </Styles.Button>
      </Styles.Row>
    </Styles.Container>
  );
};

export default CurrenciesDropdown;
