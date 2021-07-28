import { RouteProps } from 'react-router-dom'
import Loadable from 'react-loadable'

// Pages
const WalletsPage = Loadable({
  loader: () => import('@pages/Wallets'),
  loading: () => null,
})

const ReceivePage = Loadable({
  loader: () => import('@pages/Receive'),
  loading: () => null,
})

const SendPage = Loadable({
  loader: () => import('@pages/Send'),
  loading: () => null,
})

const SendConfirmationPage = Loadable({
  loader: () => import('@pages/SendConfirmation'),
  loading: () => null,
})

const AnalyticsDataPage = Loadable({
  loader: () => import('@pages/AnalyticsData'),
  loading: () => null,
})

const WelcomePage = Loadable({
  loader: () => import('@pages/Welcome'),
  loading: () => null,
})

const CreateWalletPage = Loadable({
  loader: () => import('@pages/CreateWallet'),
  loading: () => null,
})

const DownloadBackupPage = Loadable({
  loader: () => import('@pages/DownloadBackup'),
  loading: () => null,
})

const RestoreWalletPage = Loadable({
  loader: () => import('@pages/RestoreWallet'),
  loading: () => null,
})

const SettingsPage = Loadable({
  loader: () => import('@pages/Settings'),
  loading: () => null,
})

const NewWalletPage = Loadable({
  loader: () => import('@pages/NewWallet'),
  loading: () => null,
})

const ImportPrivateKeyPage = Loadable({
  loader: () => import('@pages/ImportPrivateKey'),
  loading: () => null,
})

const OnBoardPage = Loadable({
  loader: () => import('@pages/OnBoard'),
  loading: () => null,
})

const LockPage = Loadable({
  loader: () => import('@pages/Lock'),
  loading: () => null,
})

const SelectCurrency = Loadable({
  loader: () => import('@pages/SelectCurrency'),
  loading: () => null,
})

const EnterPasscode = Loadable({
  loader: () => import('@pages/EnterPasscode'),
  loading: () => null,
})

const AddCustomToken = Loadable({
  loader: () => import('@pages/AddCustomToken'),
  loading: () => null,
})

const AddTokenToAddress = Loadable({
  loader: () => import('@pages/AddTokenToAddress'),
  loading: () => null,
})

const FoundTokens = Loadable({
  loader: () => import('@pages/FoundTokens'),
  loading: () => null,
})

const SelectToken = Loadable({
  loader: () => import('@pages/SelectToken'),
  loading: () => null,
})

const ImportRecoveryPhrase = Loadable({
  loader: () => import('@pages/ImportRecoveryPhrase'),
  loading: () => null,
})

const WalletPage = Loadable({
  loader: () => import('@pages/Wallet'),
  loading: LoadableLoading,
})

const routers: RouteProps[] = [
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
    path: '/send-confirm',
    component: SendConfirmationPage,
  },
  {
    path: '/analytics-data',
    component: AnalyticsDataPage,
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
    path: '/download-backup',
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
  {
    path: '/onboard',
    component: OnBoardPage,
  },
  {
    path: '/lock',
    component: LockPage,
  },
  {
    path: '/select-currency',
    component: SelectCurrency,
  },
  {
    path: '/enter-passcode',
    component: EnterPasscode,
  },
  {
    path: '/add-custom-token',
    component: AddCustomToken,
  },
  {
    path: '/add-token-to-address',
    component: AddTokenToAddress,
  },
  {
    path: '/found-tokens',
    component: FoundTokens,
  },
  {
    path: '/select-token',
    component: SelectToken,
  },
  {
    path: '/import-recovery-phrase',
    component: ImportRecoveryPhrase,
  },
  {
    path: '/wallet',
    component: WalletPage,
  },
]

export default routers
