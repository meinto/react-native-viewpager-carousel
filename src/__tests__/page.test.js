import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import Page from '../Page'

describe('tests the Page Component', () => {

  let props = {}
  beforeEach(() => {
    props = {}
  })

  it('snapshot standard component without props', () => {
    const json = renderer.create(<Page/>).toJSON()
    expect(json).toMatchSnapshot()
  })
  it('snapshot standard component with props', () => {
    const json = renderer.create(<Page {...props}/>).toJSON()
    expect(json).toMatchSnapshot()
  })
  
  it('', () => {
    
  })
})