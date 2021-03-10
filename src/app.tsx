import * as React from 'react'
import { render } from 'react-dom'
import { Route, RouteProps, MemoryRouter as Router, Switch } from 'react-router-dom'

import routes from './routes'
import GlobalStyles from './styles/global'

import config from '@config/index'
import { FIRST_ENTER, SESSION_START } from '@config/events'

import { validateWallet } from '@utils/validate'
import { init, logEvent } from '@utils/amplitude'

const App: React.FC = () => {
  React.useEffect(() => {
    initAmplitude()
  }, [])

  const initAmplitude = (): void => {
    init(config.apiKey.amplitude)

    if (!localStorage.getItem('clientId')) {
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
      return '/lock'
    }
    if (localStorage.getItem('onBoard') !== 'passed') {
      return '/onboard'
    }

    if (localStorage.getItem('analytics') !== 'agreed') {
      return '/analytics-data'
    }

    const validateWallets = validateWallet(localStorage.getItem('wallets'))
    return validateWallets ? '/wallets' : '/welcome'
  }

  return (
    <>
      <GlobalStyles />
      <Router initialEntries={[getInitialPage()]}>
        <Switch>
          {routes.map((route: RouteProps, index: number) => (
            <Route key={index} path={route.path} component={route.component} />
          ))}
        </Switch>
      </Router>
    </>
  )
}

render(<App />, document.getElementById('popup-root'))
