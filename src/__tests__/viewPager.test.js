import React from 'react'
import renderer from 'react-test-renderer'

import ViewPager from '../ViewPager'

jest.mock('react-native-mirror', () => 'Mirror')
jest.mock('../Page', () => 'Page')

describe('<ViewPager /> tests', () => {

  it('snapshots the component without props', () => {
    const component = renderer.create(<ViewPager />)
    expect(component.toJSON()).toMatchSnapshot()
  })

})