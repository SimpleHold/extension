import { RouteProps } from 'react-router-dom'

// Pages
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
import NewWalletPage from './pages/NewWallet'
import ImportPrivateKeyPage from './pages/ImportPrivateKey'

const routers: RouteProps[] = [
  {
    path: '/wallets',
    component: WalletsPage,
    exact: true,
  },
  {
    path: '/receive',
    component: ReceivePage,
  },
  {
    path: '/send',
    component: SendPage,
    exact: true,
  },
  {
    path: '/send-confirm',
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
    path: '/create-wallet',
    component: CreateWalletPage,
  },
  {
    path: '/backup/download',
    component: DownloadBackupPage,
  },
  {
    path: '/restore-wallet',
    component: RestoreWalletPage,
  },
  {
    path: '/settings',
    component: SettingsPage,
  },
  {
    path: '/new-wallet',
    component: NewWalletPage,
  },
  {
    path: '/import-private-key',
    component: ImportPrivateKeyPage,
  },
]

export default routers
