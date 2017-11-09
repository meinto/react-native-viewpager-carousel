import React from 'react'
import renderer from 'react-test-renderer'
import Page from '../Page'

describe('tests the Page Component', () => {

  let props = {}
  beforeEach(() => {
    props = {
      pageNumber: 1,
      children: React.createElement('ChildComponent')
    }
  })

  it('snapshots standard component without props', () => {
    const json = renderer.create(<Page/>).toJSON()
    expect(json).toBeTruthy()
    expect(json).toMatchSnapshot()
  })

  it('snapshots standard component with props', () => {
    const json = renderer.create(<Page {...props}/>).toJSON()
    expect(json).toMatchSnapshot()
  })

  it('tests that child components are not rendered if lazyrender  = true and page is not the active page and not in lazyrenderThreshold', () => {
    props.pageNumber = 3
    props.lazyrender = true
    const component = renderer.create(<Page {...props} />)
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('tests that child components are not rendered if lazyrender  = true and page is not the active page and lazyrenderThreshold = 0', () => {
    props.pageNumber = 2
    props.lazyrender = true
    props.lazyrenderThreshold = 0
    const component = renderer.create(<Page {...props} />)
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('tests that child components are rendered if lazyrender  = true and page is not the active page but is in lazyrenderThreshold', () => {
    props.pageNumber = 2
    props.lazyrender = true
    const component = renderer.create(<Page {...props} />)
    expect(component.toJSON()).toMatchSnapshot()
  })

  describe('tests that devThresholdOverlay is only displayed when dev = true and its a threshold page', () => {

    it('test overlay is displayed when isThreshold', () => {
      props.dev = true
      props.isThresholdPage = true
      const component = renderer.create(<Page {...props} />)
      expect(component.toJSON()).toMatchSnapshot()
    })

    it('test overlay is displayed when not isThreshold', () => {
      props.dev = true
      props.isThresholdPage = false
      const component = renderer.create(<Page {...props} />)
      expect(component.toJSON()).toMatchSnapshot()
    })

    it('test overlay is displayed when isThreshold but not dev', () => {
      props.dev = false
      props.isThresholdPage = true
      const component = renderer.create(<Page {...props} />)
      expect(component.toJSON()).toMatchSnapshot()
    })

  })

  describe('class method tests', () => {

    describe('constructor tests', () => {
      it('tests that local state shouldRender is initialized with true if pageNumber is 1', () => {
        const page = new Page(props)
        expect(page.state.shouldRender).toBe(true)
      })
      
      it('tests that local state shouldRender is initialized with false if pageNumber is 1 and lazyrender = false', () => {
        props.lazyrender = false
        props.lazyrenderThreshold = 1
        props.pageNumber = 2
        const page = new Page(props)
        expect(page.state.shouldRender).toBe(true)
      })
      
      it('tests that local state shouldRender is initialized with false if pageNumber is NOT 1 and lazyrender = true', () => {
        props.lazyrender = true
        props.lazyrenderThreshold = 0
        props.pageNumber = 2
        const page = new Page(props)
        expect(page.state.shouldRender).toBe(false)
      })
    })
    
    describe('onPageChange tests', () => {
      it('tests that setState is only called when lazyrender is true and local state shouldRender is not equal to new shouldRender state', () => {
        props.lazyrender = true
        props.lazyrenderThreshold = 0 
        props.pageNumber = 2
        const page = new Page(props)

        page.setState = jest.fn()
        expect(page.setState).not.toHaveBeenCalled()
        page.onPageChange(2)
        expect(page.setState).toHaveBeenCalledWith({
          shouldRender: true,
        })
      })
      
      it('tests onPageChange sets local shouldRender state propperly when page is active', () => {
        props.lazyrender = true
        props.lazyrenderThreshold = 0 
        props.pageNumber = 2
        const page = new Page(props)

        page.setState = jest.fn(state => page.state = state)
        page.onPageChange(2)
        expect(page.setState).toHaveBeenCalledWith({
          shouldRender: true,
        })
        page.setState.mockReset()
        page.onPageChange(3)
        expect(page.setState).toHaveBeenCalledWith({
          shouldRender: false,
        })
      })
    })

  })

})