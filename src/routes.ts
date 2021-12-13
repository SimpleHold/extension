import { RouteProps } from 'react-router-dom'
import Loadable from 'react-loadable'

const routers: RouteProps[] = [
  {
    path: '/wallets',
    component: Loadable({
      loader: () => import('@pages/Wallets'),
      loading: () => null,
    }),
  },
  {
    path: '/receive',
    component: Loadable({
      loader: () => import('@pages/Receive'),
      loading: () => null,
    }),
  },
  {
    path: '/send',
    component: Loadable({
      loader: () => import('@pages/Send'),
      loading: () => null,
    }),
  },
  {
    path: '/send-confirm',
    component: Loadable({
      loader: () => import('@pages/SendConfirmation'),
      loading: () => null,
    }),
  },
  {
    path: '/analytics-data',
    component: Loadable({
      loader: () => import('@pages/AnalyticsData'),
      loading: () => null,
    }),
  },
  {
    path: '/welcome',
    component: Loadable({
      loader: () => import('@pages/Welcome'),
      loading: () => null,
    }),
  },
  {
    path: '/create-wallet',
    component: Loadable({
      loader: () => import('@pages/CreateWallet'),
      loading: () => null,
    }),
  },
  {
    path: '/download-backup',
    component: Loadable({
      loader: () => import('@pages/DownloadBackup'),
      loading: () => null,
    }),
  },
  {
    path: '/restore-wallet',
    component: Loadable({
      loader: () => import('@pages/RestoreWallet'),
      loading: () => null,
    }),
  },
  {
    path: '/settings',
    component: Loadable({
      loader: () => import('@pages/Settings'),
      loading: () => null,
    }),
  },
  {
    path: '/new-wallet',
    component: Loadable({
      loader: () => import('@pages/NewWallet'),
      loading: () => null,
    }),
  },
  {
    path: '/import-private-key',
    component: Loadable({
      loader: () => import('@pages/ImportPrivateKey'),
      loading: () => null,
    }),
  },
  {
    path: '/onboard',
    component: Loadable({
      loader: () => import('@pages/OnBoard'),
      loading: () => null,
    }),
  },
  {
    path: '/lock',
    component: Loadable({
      loader: () => import('@pages/Lock'),
      loading: () => null,
    }),
  },
  {
    path: '/select-currency',
    component: Loadable({
      loader: () => import('@pages/SelectCurrency'),
      loading: () => null,
    }),
  },
  {
    path: '/enter-passcode',
    component: Loadable({
      loader: () => import('@pages/EnterPasscode'),
      loading: () => null,
    }),
  },
  {
    path: '/add-custom-token',
    component: Loadable({
      loader: () => import('@pages/AddCustomToken'),
      loading: () => null,
    }),
  },
  {
    path: '/add-token-to-address',
    component: Loadable({
      loader: () => import('@pages/AddTokenToAddress'),
      loading: () => null,
    }),
  },
  {
    path: '/found-tokens',
    component: Loadable({
      loader: () => import('@pages/FoundTokens'),
      loading: () => null,
    }),
  },
  {
    path: '/select-token',
    component: Loadable({
      loader: () => import('@pages/SelectToken'),
      loading: () => null,
    }),
  },
  {
    path: '/import-recovery-phrase',
    component: Loadable({
      loader: () => import('@pages/ImportRecoveryPhrase'),
      loading: () => null,
    }),
  },
  {
    path: '/wallet',
    component: Loadable({
      loader: () => import('@pages/Wallet'),
      loading: () => null,
    }),
  },
  {
    path: '/tx-history',
    component: Loadable({
      loader: () => import('@pages/TxHistory'),
      loading: () => null,
    }),
  },
  {
    path: '/tx',
    component: Loadable({
      loader: () => import('@pages/Tx'),
      loading: () => null,
    }),
  },
  {
    path: '/nft-collection',
    component: Loadable({
      loader: () => import('@pages/NftCollection'),
      loading: () => null,
    }),
  },
  {
    path: '/nft',
    component: Loadable({
      loader: () => import('@pages/Nft'),
      loading: () => null,
    }),
  },
  {
    path: '/scan-backup',
    component: Loadable({
      loader: () => import('@pages/ScanBackup'),
      loading: () => null,
    }),
  },
]

export default routers
