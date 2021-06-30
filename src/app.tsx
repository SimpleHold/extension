import * as React from 'react'
import { Route, RouteProps, MemoryRouter as Router, Switch } from 'react-router-dom'

import routes from './routes'

const App: React.FC = () => {
  return (
    <Switch>
      {routes.map((route: RouteProps, index: number) => (
        <Route key={index} path={route.path} component={route.component} />
      ))}
    </Switch>
  )
}

export default App
