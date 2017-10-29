import React from 'react'
import { Text } from 'react-native'
import renderer from 'react-test-renderer'

import ViewPager from '../ViewPager'

jest.mock('react-native-mirror', () => 'Mirror')
jest.mock('../Page', () => 'Page')
jest.mock('Dimensions', () => {
  return {
    get: key => {
      switch (key) {
        case 'window':
          return {
            width: 800, 
          }
      }
      return null
    },
  }
})

jest.useFakeTimers()


describe('<ViewPager /> tests', () => {

  let props = {}

  beforeEach(() => {
    props = {
      contentContainerStyle: {},
      containerStyle: {},
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

  describe('property tests', () => {
    describe('threshold tests', () => {
      it('tests threshold with 3', () => {
        props.thresholdPages = 3
        const expectedDataSourceLength = props.thresholdPages * 2 + props.data.length
        const component = renderer.create(<ViewPager {...props}/>)
        expect(component.getInstance().state.dataSource.length).toBe(expectedDataSourceLength)
        expect(component.getInstance().state).toMatchSnapshot()
      })


      it('tests threshold with 0', () => {
        props.thresholdPages = 0
        const expectedDataSourceLength = props.thresholdPages * 2 + props.data.length
        const component = renderer.create(<ViewPager {...props}/>)
        expect(component.getInstance().state.dataSource.length).toBe(expectedDataSourceLength)
        expect(component.getInstance().state).toMatchSnapshot()
      })


      it('tests threshold with 10', () => {
        props.thresholdPages = 10
        const expectedDataSourceLength = props.thresholdPages * 2 + props.data.length
        const component = renderer.create(<ViewPager {...props}/>)
        expect(component.getInstance().state.dataSource.length).toBe(expectedDataSourceLength)
        expect(component.getInstance().state).toMatchSnapshot()
      })
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
  })
  
  describe('method tests', () => {
    /**
     * TODO: How to mock Class Functions before they are executed by lifecyle methods
     */
    // describe('componentDidMount tests', () => {
    //   it('tests "_scrollTo" would be called when component is used as carousel and initialPage is not set', () => {
    //     props.renderAsCarousel = true
    //     props.pageWidth = 10
    //     props.thresholdPages = 2

    //     const _scrollToSpy = jest.fn()
    //     ViewPager.prototype._scrollTo = _scrollToSpy
    //     new ViewPager(props)
    //     jest.runAllTimers()

    //     expect(_scrollToSpy).toHaveBeenCalledWith(800)
    //   })
    // })

    it('tests that _setPageNumber extends the page date objects with the assosiated pageNumber', () => {
      const instance = new ViewPager(props)
      const extendedPageData = instance._setPageNumber(props.data)
      expect(extendedPageData).toEqual(props.data.map((data, index) => {
        return {
          ...data,
          _pageNumber: index + 1,
        }
      }))
    })

  //   _setPageIndex = data => {
  //   return data.map((_data, index) => {
  //     return Object.assign({}, _data, {
  //       _pageIndex: index,
  //     })
  //   })
  // }
  })
})