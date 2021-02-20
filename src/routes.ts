import { RouteProps } from 'react-router-dom'

// Pages
import MainPage from './pages/Main'
import WalletsPage from './pages/Wallets'
import ReceivePage from './pages/Receive'
import SendPage from './pages/Send'
import SendConfirmationPage from './pages/SendConfirmation'
import UsageDataPage from './pages/UsageData'

const routers: RouteProps[] = [
  {
    path: '/',
    component: UsageDataPage,
    exact: true,
  },
  {
    path: '/wallets',
    component: WalletsPage,
  },
  {
    path: '/receive',
    component: ReceivePage,
  },
  {
    path: '/send',
    component: SendPage,
  },
  {
    path: '/send/confirm',
    component: SendConfirmationPage,
  },
]

export default routers
