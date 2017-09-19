import React, { PureComponent } from 'react'
import {
  View,
  Dimensions,
} from 'react-native'
import PropTypes from 'prop-types'


const VIEWPORT_WIDTH = Dimensions.get('window').width

export default class Page extends PureComponent {

  static propTypes = {
    children: PropTypes.any,
    lazyrender: PropTypes.bool,
    pageNumber: PropTypes.number,
    pageWidth: PropTypes.number,
    dev: PropTypes.bool,
    lazyRenderCount: PropTypes.number
  }

  static defaultProps = {
    lazyRenderCount: 2,
    dev: false,
    children: null,
    lazyrender: false,
    pageNumber: 0,
    pageWidth: VIEWPORT_WIDTH,
  }



  constructor(props) {
    super(props)
    const isRendering = this._renderThisPage(this.props.pageNumber, 1)


    this.state = {
      render: isRendering,
    }
  }

  _getNextPage = (pageNumber, count) => {

    const nextPage = pageNumber + count
    if (nextPage > this.props.maxPageNumber){
      return nextPage - this.props.maxPageNumber
    }
    return nextPage
  }

  _getLastPage = (pageNumber, count) => {
    const lastPage = pageNumber - count
    if (lastPage <= 0){
      return this.props.maxPageNumber + lastPage
    }
    return lastPage
  }

  // _renderThisPage = (pageNumber, numberOfCurrentVisiblePage ) => {
  //   if (!this.props.lazyrender){
  //     return true
  //   }
  //
  //   if (pageNumber === numberOfCurrentVisiblePage){
  //     return true
  //   }
  //   if(pageNumber > numberOfCurrentVisiblePage){
  //     if(pageNumber-numberOfCurrentVisiblePage === this.props.lazyRenderCount){
  //       return true
  //     }
  //   }
  //   if(pageNumber < numberOfCurrentVisiblePage){
  //     console.log(this.props.maxPageNumber, numberOfCurrentVisiblePage, this.props.lazyRenderCount)
  //     if(this.props.maxPageNumber - (this.props.maxPageNumber - numberOfCurrentVisiblePage) === this.props.lazyRenderCount){
  //       return true
  //     }
  //   }
  //
  //
  //
  //   return false
  // }

  _renderThisPage = (pageNumber, numberOfCurrentVisiblePage ) => {
    if (!this.props.lazyrender){
      return true
    }

    if (pageNumber === numberOfCurrentVisiblePage){
      return true
    }

    for (let i = 1; i <= this.props.lazyRenderCount; i++){

      if (pageNumber === this._getNextPage(numberOfCurrentVisiblePage, i)){
        return true
      }
      if (pageNumber === this._getLastPage(numberOfCurrentVisiblePage, i)){
        return true
      }
    }
    return false
  }

  onPageChange = (pageNumber) => {
    const newRender = this._renderThisPage(this.props.pageNumber, pageNumber)
    if (this.state.render !== newRender){
      this.setState({
        render: newRender
      })
    }
  }

  render() {
    console.log('render')
    const borderWidth = this.props.dev ? 1 : 0
    return (
      <View
        style={{
          width: this.props.pageWidth,
          borderWidth,
        }}
      >
        {this.state.render && this.props.children}
      </View>
    )
  }
}
