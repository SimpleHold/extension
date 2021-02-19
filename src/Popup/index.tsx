import * as React from 'react'
import { render } from 'react-dom'
import { Route, RouteProps, BrowserRouter as Router } from 'react-router-dom'
import { AnimatedSwitch, spring } from 'react-router-transition'

import routes from '../routes'
import GlobalStyles from '../styles/global'

const bounce = (val: number) => {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  })
}

const bounceTransition = {
  atEnter: {
    opacity: 0,
    scale: 1.2,
  },
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.8),
  },
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
}

const App: React.FC = () => (
  <>
    <GlobalStyles />
    <Router>
      <AnimatedSwitch
        atEnter={bounceTransition.atEnter}
        atLeave={bounceTransition.atLeave}
        atActive={bounceTransition.atActive}
      >
        {routes.map((route: RouteProps, index: number) => (
          <Route key={index} path={route.path} component={route.component} />
        ))}
      </AnimatedSwitch>
    </Router>
  </>
)

render(<App />, document.getElementById('popup-root'))
