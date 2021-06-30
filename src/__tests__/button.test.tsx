import 'jsdom-global/register'
import * as React from 'react'
import { configure, mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

// Components
import Button from '@components/Button'

configure({ adapter: new Adapter() })

describe('<Button />', () => {
  it('renders button', () => {
    const wrapper = mount(<Button label="Button" onClick={() => null} />)
    const elem = wrapper.find('p')
    expect(elem.length).toBe(1)
  })
})
