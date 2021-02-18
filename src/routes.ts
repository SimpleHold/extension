import {RouteProps} from 'react-router-dom';

// Pages
// import WalletsPage from './pages/Wallets';
import WalletInfoPage from './pages/WalletInfo';
import SendPage from './pages/Send';

const routers: RouteProps[] = [
  {
    path: '/',
    component: SendPage,
    exact: true,
  },
  {
    path: '/wallet/:address',
    component: WalletInfoPage,
  },
];

export default routers;
