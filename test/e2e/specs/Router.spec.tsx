import React from 'react'
import { Route, RouteProps, MemoryRouter as Router, Switch } from 'react-router-dom'
import { mount } from 'enzyme'

import routes from '../../../src/routes'

const mockHistoryPush = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}))

describe('Test React router', () => {
  it('onboarding', () => {
    const wrapper = mount(
      <Router initialEntries={['/welcome']}>
        <Switch>
          {routes.map((route: RouteProps, index: number) => (
            <Route key={index} path={route.path} component={route.component} />
          ))}
        </Switch>
      </Router>
    )

    wrapper.find('.create-wallet').simulate('click')
    expect(wrapper.find('.create-wallet-page')).toHaveLength(1)
  })
})
