import { RouteProps } from 'react-router-dom'
import Loadable from 'react-loadable'

// Components
import LoadableLoading from '@components/LoadableLoading'

// Pages
const WalletsPage = Loadable({
  loader: () => import('@pages/Wallets'),
  loading: LoadableLoading,
})

const ReceivePage = Loadable({
  loader: () => import('@pages/Receive'),
  loading: LoadableLoading,
})

const SendPage = Loadable({
  loader: () => import('@pages/Send'),
  loading: LoadableLoading,
})

const SendConfirmationPage = Loadable({
  loader: () => import('@pages/SendConfirmation'),
  loading: LoadableLoading,
})

const AnalyticsDataPage = Loadable({
  loader: () => import('@pages/AnalyticsData'),
  loading: LoadableLoading,
})

const WelcomePage = Loadable({
  loader: () => import('@pages/Welcome'),
  loading: LoadableLoading,
})

const CreateWalletPage = Loadable({
  loader: () => import('@pages/CreateWallet'),
  loading: LoadableLoading,
})

const DownloadBackupPage = Loadable({
  loader: () => import('@pages/DownloadBackup'),
  loading: LoadableLoading,
})

const RestoreWalletPage = Loadable({
  loader: () => import('@pages/RestoreWallet'),
  loading: LoadableLoading,
})

const SettingsPage = Loadable({
  loader: () => import('@pages/Settings'),
  loading: LoadableLoading,
})

const NewWalletPage = Loadable({
  loader: () => import('@pages/NewWallet'),
  loading: LoadableLoading,
})

const ImportPrivateKeyPage = Loadable({
  loader: () => import('@pages/ImportPrivateKey'),
  loading: LoadableLoading,
})

const OnBoardPage = Loadable({
  loader: () => import('@pages/OnBoard'),
  loading: LoadableLoading,
})

const LockPage = Loadable({
  loader: () => import('@pages/Lock'),
  loading: LoadableLoading,
})

const SelectCurrency = Loadable({
  loader: () => import('@pages/SelectCurrency'),
  loading: LoadableLoading,
})

const EnterPasscode = Loadable({
  loader: () => import('@pages/EnterPasscode'),
  loading: LoadableLoading,
})

const AddCustomToken = Loadable({
  loader: () => import('@pages/AddCustomToken'),
  loading: LoadableLoading,
})

const AddTokenToAddress = Loadable({
  loader: () => import('@pages/AddTokenToAddress'),
  loading: LoadableLoading,
})

const FoundTokens = Loadable({
  loader: () => import('@pages/FoundTokens'),
  loading: LoadableLoading,
})

const SelectToken = Loadable({
  loader: () => import('@pages/SelectToken'),
  loading: LoadableLoading,
})

const ImportRecoveryPhrase = Loadable({
  loader: () => import('@pages/ImportRecoveryPhrase'),
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
]

export default routers
