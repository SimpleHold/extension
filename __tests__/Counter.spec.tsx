import React from 'react'
import { shallow } from 'enzyme'

import Counter from '../src/components/Counter'

describe('Test Button component', () => {
  it('Test click event', () => {
    const wrapper = shallow(<Counter initialCount={5} />)
    wrapper.find('button').simulate('click')
    expect(wrapper.text()).toEqual('Current value: 6Increment')
  })
})
