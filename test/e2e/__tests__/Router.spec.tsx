import React from 'react'
import { Route, RouteProps, MemoryRouter as Router, Switch } from 'react-router-dom'
import { mount } from 'enzyme'

import routes from '../../../src/routes'

describe('Test React router', () => {
  it('onboarding', () => {
    const wrapper = mount(
      <>
        <Router initialEntries={['/welcome']}>
          <Switch>
            {routes.map((route: RouteProps, index: number) => (
              <Route key={index} path={route.path} component={route.component} />
            ))}
          </Switch>
        </Router>
      </>
    )

    wrapper.find('a').simulate('click', { button: 0 })
    expect(wrapper.find('.protected')).toHaveLength(1)
  })
})
