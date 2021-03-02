import * as React from 'react'
import { render } from 'react-dom'
import { Route, RouteProps, MemoryRouter as Router } from 'react-router-dom'
import { AnimatedSwitch } from 'react-router-transition'

import routes from './routes'
import GlobalStyles from './styles/global'

import { validate } from '@utils/wallet'

const bounceTransition = {
  atEnter: {
    opacity: 1,
    scale: 1,
  },
  atLeave: {
    opacity: 1,
    scale: 1,
  },
  atActive: {
    opacity: 1,
    scale: 1,
  },
}

const App: React.FC = () => {
  const getInitialPage = () => {
    return '/test'
    if (localStorage.getItem('isLocked')) {
      return '/lock'
    }
    if (localStorage.getItem('onBoard') !== 'passed') {
      return '/onboard'
    }

    if (localStorage.getItem('analytics') !== 'agreed') {
      return '/analytics-data'
    }

    const validateWallets = validate(localStorage.getItem('wallets'))
    return validateWallets ? '/wallets' : '/welcome'
  }

  return (
    <>
      <GlobalStyles />
      <Router initialEntries={[getInitialPage()]}>
        <AnimatedSwitch {...bounceTransition}>
          {routes.map((route: RouteProps, index: number) => (
            <Route key={index} path={route.path} component={route.component} />
          ))}
        </AnimatedSwitch>
      </Router>
    </>
  )
}

render(<App />, document.getElementById('popup-root'))
