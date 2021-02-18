import * as React from 'react';
import {render} from 'react-dom';
import {Switch, Route, HashRouter, RouteProps} from 'react-router-dom';

// Components
import Cover from '@components/Cover';

import routes from '../routes';
import GlobalStyles from '../styles/global';

const App: React.FC = () => (
  <>
    <GlobalStyles />
    <Cover />
    <HashRouter>
      <Switch>
        {routes.map((route: RouteProps, index: number) => (
          <Route key={index} path={route.path} component={route.component} />
        ))}
      </Switch>
    </HashRouter>
  </>
);

render(<App />, document.getElementById('popup-root'));
