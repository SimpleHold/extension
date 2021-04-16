import * as React from 'react'
import { render } from 'react-dom'
import { Route, RouteProps, MemoryRouter as Router, Switch } from 'react-router-dom'
import { v4 } from 'uuid'

import routes from './routes'
import GlobalStyles from './styles/global'

import config from '@config/index'
import { FIRST_ENTER, SESSION_START } from '@config/events'

import { validateWallet } from '@utils/validate'
import { init, logEvent } from '@utils/amplitude'

import { ToastContextProvider } from '@contexts/Toast/Toast'

const App: React.FC = () => {
  React.useEffect(() => {
    initAmplitude()
  }, [])

  const initAmplitude = (): void => {
    const clientId = localStorage.getItem('clientId') || v4()

    init(config.apiKey.amplitude, clientId)

    if (!localStorage.getItem('clientId')) {
      localStorage.setItem('clientId', clientId)

      logEvent({
        name: FIRST_ENTER,
      })
    }

    logEvent({
      name: SESSION_START,
    })
  }

  const getInitialPage = (): string => {
    if (localStorage.getItem('isLocked')) {
      return localStorage.getItem('passcode') !== null ? '/enter-passcode' : '/lock'
    }
    if (localStorage.getItem('onBoard') !== 'passed') {
      return '/onboard'
    }

    if (localStorage.getItem('analytics') !== 'agreed') {
      return '/analytics-data'
    }

    if (localStorage.getItem('backupStatus') === 'notDownloaded') {
      return '/download-backup'
    }

    const validateWallets = validateWallet(localStorage.getItem('wallets'))
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
