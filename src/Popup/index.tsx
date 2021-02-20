import * as React from 'react'
import { render } from 'react-dom'
import { Route, RouteProps, MemoryRouter as Router } from 'react-router-dom'
import { AnimatedSwitch } from 'react-router-transition'

import routes from '../routes'
import GlobalStyles from '../styles/global'

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

const App: React.FC = () => (
  <>
    <GlobalStyles />
    <Router initialEntries={['/main']}>
      <AnimatedSwitch {...bounceTransition}>
        {routes.map((route: RouteProps, index: number) => (
          <Route key={index} path={route.path} component={route.component} />
        ))}
      </AnimatedSwitch>
    </Router>
  </>
)

render(<App />, document.getElementById('popup-root'))
