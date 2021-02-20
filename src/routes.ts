import { RouteProps } from 'react-router-dom'

// Pages
import MainPage from './pages/Main'
import WalletsPage from './pages/Wallets'
import ReceivePage from './pages/Receive'
import SendPage from './pages/Send'
import SendConfirmationPage from './pages/SendConfirmation'
import UsageDataPage from './pages/UsageData'
import WelcomePage from './pages/Welcome'

const routers: RouteProps[] = [
  {
    path: '/main',
    component: MainPage,
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
  {
    path: '/usage-data',
    component: UsageDataPage,
  },
  {
    path: '/welcome',
    component: WelcomePage,
  },
]

export default routers
