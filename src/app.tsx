import * as React from 'react'
import { render } from 'react-dom'
import { Route, RouteProps, MemoryRouter as Router, Switch } from 'react-router-dom'
import { v4 } from 'uuid'
import Loadable from 'react-loadable'

import routes from './routes'
import GlobalStyles from './styles/global'

import config from '@config/index'
import { FIRST_ENTER, SESSION_START } from '@config/events'

// Utils
import { validateWallet } from '@utils/validate'
import { init, logEvent } from '@utils/amplitude'
import { getItem, setItem } from '@utils/storage'

import { ToastContextProvider } from '@contexts/Toast/Toast'

const App: React.FC = () => {
  React.useEffect(() => {
    initAmplitude()
    preloadPages()
  }, [])

  const preloadPages = async (): Promise<void> => {
    await Loadable.preloadAll()
  }

  const initAmplitude = (): void => {
    const clientId = getItem('clientId') || v4()

    init(config.apiKey.amplitude, clientId)

    if (!getItem('clientId')) {
      setItem('clientId', clientId)

      logEvent({
        name: FIRST_ENTER,
      })
    }

    logEvent({
      name: SESSION_START,
    })
  }

  const getInitialPage = (): string => {
    if (getItem('isLocked')) {
      return getItem('passcode') !== null ? '/enter-passcode' : '/lock'
    }
    if (getItem('onBoard') !== 'passed') {
      return '/onboard'
    }

    if (getItem('analytics') !== 'agreed') {
      return '/analytics-data'
    }

    if (getItem('backupStatus') === 'notDownloaded') {
      return '/download-backup'
    }

    const validateWallets = validateWallet(getItem('wallets'))
    return validateWallets ? '/wallets' : '/welcome'
  }

  return (
    <>
      <GlobalStyles />
      <ToastContextProvider>
        <Router initialEntries={[getInitialPage()]}>
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

render(<App />, document.getElementById('popup-root'))
