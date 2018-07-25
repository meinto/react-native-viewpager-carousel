import React from 'react'
import { Text, Dimensions } from 'react-native'
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
  const VIEWPORT_WIDTH = Dimensions.get('window').width

  beforeEach(() => {
    props = {
      contentContainerStyle: {},
      containerStyle: {},
      pageWidth: VIEWPORT_WIDTH,
      data: [
        { title: 'mock page 1' },
        { title: 'mock page 2' },
        { title: 'mock page 3' },
        { title: 'mock page 4' },
      ],
      renderPage: ({data, _pageIndex}) => ( // eslint-disable-line
        <Text>{`${data.title} | pageIndex: ${_pageIndex}`}</Text>
      ),
      thresholdPages: 2,
      onScroll: jest.fn(),
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
    describe('constructor tests', () => {
      it('tests that all class variables are set properly after initialization with given props', () => {
        const instance = new ViewPager({
          ...ViewPager.defaultProps,
          ...props,
        })

        expect(instance._pageWithDelta).toBe(0)
        expect(instance.pageReferences).toEqual({})
        expect(instance.data).toEqual(props.data)
        expect(instance.pageCount).toEqual(props.data.length)
        expect(instance.thresholdPages).toBe(props.thresholdPages)
        expect(instance.pageIndex).toBe(props.thresholdPages)
        expect(instance.pageIndexBeforeDrag).toBe(props.thresholdPages)

        // TODO: test that this.state is set properly
        // TODO: test that this.contentContainerStyle is set properly
      })
    
      it('tests that instance variable "thresholdPages" will be zero if renderAsCarousel = false', () => {
        props.renderAsCarousel = false
        const instance = new ViewPager({
          ...ViewPager.defaultProps,
          ...props,
        })
        expect(instance.thresholdPages).toBe(0)
        expect(instance.pageIndex).toBe(0)
        expect(instance.pageIndexBeforeDrag).toBe(0)
      })

      it('tests that instance variable "thresholdPages" will be zero if pageCount = 1', () => {
        props.data = [ { title: 'only one page' } ]
        const instance = new ViewPager({
          ...ViewPager.defaultProps,
          ...props,
        })
        expect(instance.thresholdPages).toBe(0)
        expect(instance.pageIndex).toBe(0)
        expect(instance.pageIndexBeforeDrag).toBe(0)
      })
    })

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

    it('tests that _setPageIndex extends given page data with the assosiated page index', () => {
      const instance = new ViewPager(props)
      const extendedPageData = instance._setPageIndex(props.data)
      expect(extendedPageData).toEqual(props.data.map((data, index) => {
        return {
          ...data,
          _pageIndex: index,
        }
      }))
    })

    describe('_prepareData tests', () => {
      it('tests that _setPageNumber would be called with given page data', () => {
        const instance = new ViewPager(props)

        instance._setPageNumber = jest.fn(data => data)

        instance._prepareData(props.data)
        expect(instance._setPageNumber).toHaveBeenCalledWith(props.data)
      })

      describe('threshold page preperations', () => {
        it(`tests that the prepared page data has threshold pages at the beginning and at the end of the returned array
          if the component is used as a carousel and threshold pages are bigger than zero`, () => {
            props.renderAsCarousel = true
            props.thresholdPages = 2
            const instance = new ViewPager(props)

            const preparedPageData = instance._prepareData(props.data)
            const preparedPageNumbers = preparedPageData.map(data => {
              return data._pageNumber
            })
            expect(preparedPageNumbers).toEqual([3, 4, 1, 2, 3, 4, 1, 2])
          })

        it(`tests that the prepared page data is equal the given data
            if the component is used as a carousel and threshold pages are zero`, () => {
            props.renderAsCarousel = true
            props.thresholdPages = 0
            const instance = new ViewPager(props)

            const preparedPageData = instance._prepareData(props.data)
            const preparedPageNumbers = preparedPageData.map(data => {
              return data._pageNumber
            })
            expect(preparedPageNumbers).toEqual([1, 2, 3, 4])
          })
      })

      it('tests that prepared page data is as big as given page data when component is used without carousel option', () => {
        props.renderAsCarousel = false
        props.thresholdPages = 2
        const instance = new ViewPager(props)

        const preparedPageData = instance._prepareData(props.data)
        const preparedPageNumbers = preparedPageData.map(data => {
          return data._pageNumber
        })
        expect(preparedPageNumbers).toEqual([1, 2, 3, 4])
      })

      it('tests that prepared page data contains an index and a pageNumber', () => {
        props.renderAsCarousel = true
        props.thresholdPages = 2
        const instance = new ViewPager(props)

        const preparedPageData = instance._prepareData(props.data)
        const expections = 3
        expect.assertions(preparedPageData.length * expections)
        preparedPageData.forEach((data, index) => {
          expect(data.hasOwnProperty('_pageNumber')).toBeTruthy()    
          expect(data.hasOwnProperty('_pageIndex')).toBeTruthy()    
          expect(data._pageIndex).toBe(index)    
        })
      })
    })
    
    // it('tests _getPageNumberByIndex', () => {})
    // it('tests _getPageIndexByKeyValuePair', () => {})
    // it('tests _scrollTo', () => {})

    it('tests _getCurrentScrollIndex', () => {
      const instance = new ViewPager(props)
      let snaps = []
      for (let i = 0; i <= 4000; i += 100) {
        snaps = [...snaps, { input: i, output: instance._getCurrentScrollIndex(i) }]
      }
      expect(snaps).toMatchSnapshot()
    })

    describe('_onScroll tests', () => {

      let nativeScrollEvent = null
      beforeEach(() => {
        nativeScrollEvent = {
          nativeEvent: {
            contentOffset: { x: 120 },
          },
        }
      })

      it('tests onScroll is called with current contentOffset.x', () => {
        const instance = new ViewPager(props)
        instance._onScroll(nativeScrollEvent)
        expect(props.onScroll).toHaveBeenCalledWith(nativeScrollEvent.nativeEvent.contentOffset.x)
      })

      it(`tests _onPageChange is called property "firePageChangeIfPassedScreenCenter" is true and
          the next visible page passes the half of the screen`, () => {
          props.firePageChangeIfPassedScreenCenter = true
          const instance = new ViewPager({
            ...ViewPager.initialProps,
            ...props,
          })
          instance.pageIndexBeforeDrag = 1
          instance._onPageChange = jest.fn()

          nativeScrollEvent.nativeEvent.contentOffset.x = 400
          instance._onScroll(nativeScrollEvent)
          expect(instance._onPageChange).not.toHaveBeenCalled()

          instance._onPageChange.mockReset()
          nativeScrollEvent.nativeEvent.contentOffset.x = 390
          instance._onScroll(nativeScrollEvent)
          expect(instance._onPageChange).toHaveBeenCalled()

          instance._onPageChange.mockReset()
          nativeScrollEvent.nativeEvent.contentOffset.x = 1210
          instance._onScroll(nativeScrollEvent)
          expect(instance._onPageChange).toHaveBeenCalled()
        })
        
        it.skip(`tests that the position of the ScrollView jumps to the corresponding page
        at the end of the ScrollView when the  user scrolls in the front threshold page area`, () => {
          const instance = new ViewPager({
            ...ViewPager.initialProps,
            ...props,
            renderAsCarousel: true,
          })
          
          instance.scrollView = {
            scrollTo: options => instance._onScroll({
              nativeEvent: { contentOffset: { x: options.x } }
            })
          }

          nativeScrollEvent.nativeEvent.contentOffset.x = 0
          instance._onScroll(nativeScrollEvent)
          expect(instance.pageIndex).toBe(6) // should be 6. why does the test say's its zero?
        })

      // it(`tests that the position of the ScrollView jumps to the corresponding page
      //     at the front of the ScrollView when the  user scrolls in the end threshold page area`, () => {})
      // it('tests that _onMomentumScrollEnd would be called 50 ms after scroll event ends', () => {
      //   // TODO: clear timeout
      // })
      // it('tests that the class inner pageIndex is set properly to an integer', () => {})
    })


    // _onScroll = (event) => {
    //     const offsetX = event.nativeEvent.contentOffset.x
    //     this.props.onScroll(offsetX)


    //     const scrollIndex = Math.ceil(((offsetX + this._pageWithDelta) / this.props.pageWidth) * 100) / 100

    //     // fire onPageChange if the dragged page passed half of the screen
    //     if (
    //       (this.pageIndexBeforeDrag + 0.5 < scrollIndex || 
    //       this.pageIndexBeforeDrag - 0.5 > scrollIndex) &&
    //       this.props.firePageChangeIfPassedScreenCenter
    //     ) {
    //       this._onPageChange()
    //     }

    //     if (this.props.renderAsCarousel && scrollIndex % 1 < 0.03) {
    //       if (Math.trunc(scrollIndex) === 0) {

    //         this._scrollTo({
    //           animated: false,
    //           x: VIEWPORT_WIDTH * (this.state.dataSource.length - 2),
    //         })

    //       } else if (Math.trunc(scrollIndex) === this.state.dataSource.length - 1) {

    //         this._scrollTo({
    //           animated: false,
    //           x: VIEWPORT_WIDTH,
    //         })

    //       }

    //       setTimeout(() => {
    //         this._onMomentumScrollEnd()
    //       }, 50)
    //     }

    //     this.pageIndex = Math.round(scrollIndex)
    //   }
    

    // it('tests _onPageChange', () => {})
    // it('tests _onScrollBeginDrag', () => {})
    // it('tests _onMomentumScrollEnd', () => {})
    // it('tests _getScrollEnabled', () => {})

    // it('tests scroll', () => {})
    // it('tests scrollToPage', () => {})
    // it('tests scrollToPageWithKeyValuePair', () => {})
    // it('tests scrollToIndex', () => {})

  })
})