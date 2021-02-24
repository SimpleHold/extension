import { RouteProps } from 'react-router-dom'

// Pages
import MainPage from './pages/Main'
import WalletsPage from './pages/Wallets'
import ReceivePage from './pages/Receive'
import SendPage from './pages/Send'
import SendConfirmationPage from './pages/SendConfirmation'
import UsageDataPage from './pages/UsageData'
import WelcomePage from './pages/Welcome'
import CreateWalletPage from './pages/CreateWallet'
import DownloadBackupPage from './pages/DownloadBackup'
import RestoreWalletPage from './pages/RestoreWallet'
import SettingsPage from './pages/Settings'

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
  {
    path: '/wallet/create',
    component: CreateWalletPage,
  },
  {
    path: '/backup/download',
    component: DownloadBackupPage,
  },
  {
    path: '/wallet/restore',
    component: RestoreWalletPage,
  },
  {
    path: '/settings',
    component: SettingsPage,
  },
]

export default routers
