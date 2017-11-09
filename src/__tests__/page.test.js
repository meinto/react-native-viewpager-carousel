import React from 'react'
import renderer from 'react-test-renderer'
import Page from '../Page'

describe('tests the Page Component', () => {

  let props = {}
  beforeEach(() => {
    props = {
      pageNumber: 1,
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

  describe('class method tests', () => {

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
    
    it('tests onPageChange sets local shouldRender state propperly when page is active', () => {

    })

  })

})