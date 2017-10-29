import React from 'react'
import renderer from 'react-test-renderer'
import TabbedPager from '../TabbedPager'

jest.mock('../ViewPager', () => 'ViewPager')

describe('<TabbedPager /> test', () => {

  it('tests that the component renders without props', () => {
    const component = renderer.create(<TabbedPager />)
    expect(component.toJSON()).toBeTruthy()
  })

})
