import { RouteProps } from 'react-router-dom'

// Pages
import MainPage from './pages/Main'
import WalletsPage from './pages/Wallets'
import ReceivePage from './pages/Receive'
import SendPage from './pages/Send'

const routers: RouteProps[] = [
  {
    path: '/',
    component: SendPage,
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
]

export default routers
