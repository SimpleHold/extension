import * as React from 'react'
import { render } from 'react-dom'
import { Route, RouteProps, MemoryRouter as Router, Switch } from 'react-router-dom'
import { v4 } from 'uuid'
import Loadable from 'react-loadable'
import browser from 'webextension-polyfill'

import routes from './routes'
import GlobalStyles from './styles/global'

import config from '@config/index'
import { GENERAL_FIRST_ENTER, GENERAL_START_SESSION } from '@config/events'

// Utils
import { validateWallet } from '@utils/validate'
import { init, logEvent } from '@utils/metrics'
import { getItem, removeItem, setItem } from '@utils/storage'
import { getStats, updateStats, updateTxsHistory } from '@utils/history'
import { setUserId } from '@utils/api'

// Contexts
import { ToastContextProvider } from '@contexts/Toast/Toast'

const App: React.FC = () => {
  React.useEffect(() => {
    initAmplitude()
    preloadPages()
    getPlatformInfo()
    setWindowResize()
    disableBrowserTranslation()
    browser.runtime.setUninstallURL('https://simpleproducts.typeform.com/nps-score')
  }, [])

  const getPlatformInfo = async (): Promise<void> => {
    const info = await browser.runtime.getPlatformInfo()

    if (info.os === 'mac') {
      const fontFaceSheet = new CSSStyleSheet()
      fontFaceSheet.insertRule(`
        @keyframes redraw {
          0% {
            opacity: 1;
          }
          100% {
            opacity: .99;
          }
        }
      `)
      fontFaceSheet.insertRule(`
        html {
          animation: redraw 1s linear infinite;
        }
      `)
      // @ts-ignore
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, fontFaceSheet]
    }
  }

  const disableBrowserTranslation = () => {
    if (window) {
      const meta = document.createElement('meta')
      meta.name = 'google'
      meta.content = 'notranslate'
      document.head.appendChild(meta)
      document.documentElement.translate = false
    }
  }

  const setWindowResize = () => {
    let id: null | number = null
    if (window.name) {
      window.onresize = () => {
        if (id) {
          clearTimeout(id)
        }
        const height = window.outerHeight
        const width = window.outerWidth
        if (width === 375 && height === 630) return
        id = +setTimeout(() => window.resizeTo(375, 630), 1000)
      }
    }
  }

  const preloadPages = async (): Promise<void> => {
    await Loadable.preloadAll()
  }

  const initAmplitude = (): void => {
    const clientId = getItem('clientId') || v4()
    init(config.apiKey.amplitude, clientId)

    if (!getItem('clientId')) {
      setItem('clientId', clientId)

      setItem('initialBackup', 'not_downloaded')
      logEvent({
        name: GENERAL_FIRST_ENTER,
      })
    }
    logEvent({
      name: GENERAL_START_SESSION,
    })

    if (getItem('initialBackup') === 'downloaded') {
      setItem('initial_balances_request', 'required')
      removeItem('initialBackup')
    }

    checkTxsStats()
  }

  const checkTxsStats = async (): Promise<void> => {
    const clientId = getItem('clientId')
    const txsStats = getStats()

    if (clientId && !txsStats) {
      updateStats()
      setUserId(clientId)
    }
  }

  const getInitialPage = (): string => {
    if (getItem('isLocked')) {
      return getItem('passcode') !== null ? '/enter-passcode' : '/lock'
    }

    if (getItem('backupStatus') === 'notDownloaded') {
      return '/download-backup'
    }

    const validateWallets = validateWallet(getItem('wallets'))
    return validateWallets ? '/wallets' : '/welcome'
  }

  const initialPage = getInitialPage()

  React.useEffect(() => {
    if (initialPage === '/wallets') {
      const savedHistory = getItem('full_history')

      if (!savedHistory) {
        updateTxsHistory()
      }
    }
  }, [])

  return (
    <>
      <GlobalStyles />
      <ToastContextProvider>
        <Router initialEntries={[initialPage]}>
          <Switch>
            {routes.map((route: RouteProps, index: number) => (
              <Route key={index} path={route.path} component={route.component} />
            ))}
          </Switch>
        </Router>
      </ToastContextProvider>
    </>
  )
}

// browser.tabs.query({ active: true, currentWindow: true }).then(() => {
render(<App />, document.getElementById('popup'))
// })
