import React from 'react'
import { Text } from 'react-native'
import renderer from 'react-test-renderer'

import ViewPager from '../ViewPager'

jest.mock('react-native-mirror', () => 'Mirror')
jest.mock('../Page', () => 'Page')

jest.useFakeTimers()


describe('<ViewPager /> tests', () => {

  let props = {}

  beforeEach(() => {
    props = {
      contentContainerStyle: {
        contentContainerStyle: 'contentContainerStyle',
      },
      containerStyle: {
        containerStyle: 'containerStyle',
      },
      data: [
        { title: 'mock page 1' },
        { title: 'mock page 2' },
        { title: 'mock page 3' },
        { title: 'mock page 4' },
      ],
      renderPage: ({data, _pageIndex}) => ( // eslint-disable-line
        <Text>{`${data.title} | pageIndex: ${_pageIndex}`}</Text>
      ),
    }
  })


  it('snapshots the component without props', () => {
    const component = renderer.create(<ViewPager />)
    expect(component.toJSON()).toMatchSnapshot()
  })


  it('snapshots the component with initial props', () => {
    const component = renderer.create(<ViewPager {...props}/>)
    expect(component.toJSON()).toMatchSnapshot()
  })


  it('tests threshold with 3', () => {
    props.thresholdPages = 3
    const component = renderer.create(<ViewPager {...props}/>)
    expect(component.getInstance().state.dataSource.length).toBe(10)
    expect(component.getInstance().state).toMatchSnapshot()
  })


  it('tests threshold with 0', () => {
    props.thresholdPages = 0
    const component = renderer.create(<ViewPager {...props}/>)
    expect(component.getInstance().state.dataSource.length).toBe(4)
    expect(component.getInstance().state).toMatchSnapshot()
  })


  it('tests threshold with 10', () => {
    props.thresholdPages = 10
    const component = renderer.create(<ViewPager {...props}/>)
    expect(component.getInstance().state.dataSource.length).toBe(24)
    expect(component.getInstance().state).toMatchSnapshot()
  })


  it('tests a set pageWidth of 50', () => {
    props.pageWidth = 50
    const component = renderer.create(<ViewPager {...props}/>)
    expect(component.toJSON()).toMatchSnapshot()
  })


  it('tests that scrollEnabled is set properly', () => {
    props.scrollEnabled = false
    const component = renderer.create(<ViewPager {...props}/>)
    expect(component.toJSON()).toMatchSnapshot()
  })


  it('tests that pagingEnabled is set properly', () => {
    props.pagingEnabled = false
    const component = renderer.create(<ViewPager {...props}/>)
    expect(component.toJSON()).toMatchSnapshot()
  })


  it('tests that experimentalMirroring={true} renders the outer views within a <Mirror /> component', () => {
    props.experimentalMirroring = true
    const component = renderer.create(<ViewPager {...props}/>)
    expect(component.toJSON()).toMatchSnapshot()
  })


  it('tests that showNativeScrollIndicator is set properly', () => {
    props.showNativeScrollIndicator = false
    const component = renderer.create(<ViewPager {...props}/>)
    expect(component.toJSON()).toMatchSnapshot()
  })


  it('tests that lazyrender is set properly', () => {
    props.lazyrender = true
    const component = renderer.create(<ViewPager {...props}/>)
    expect(component.toJSON()).toMatchSnapshot()
  })


  // TODO:
  // class methods
  // onPageChange: React.PropTypes.func,
  // onScroll: React.PropTypes.func,

})