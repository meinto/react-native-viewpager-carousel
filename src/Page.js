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
    lazyrenderThreshold: PropTypes.number,
    maxPageNumber: PropTypes.number,
  }

  static defaultProps = {
    lazyrenderThreshold: 1,
    dev: false,
    children: null,
    lazyrender: false,
    pageNumber: 0,
    pageWidth: VIEWPORT_WIDTH,
  }

  constructor(props) {
    super(props)
    const shouldRender = this._shouldPageRender(this.props.pageNumber, 1)

    this.state = {
      shouldRender,
    }
  }

  onPageChange = currentVisiblePageNumber => {
    const shouldRender = this._shouldPageRender(this.props.pageNumber, currentVisiblePageNumber)
    if (
      this.props.lazyrender === true &&
      this.state.shouldRender !== shouldRender
    ) {
      this.setState({
        shouldRender,
      })
    }
  }

  _getNextPageNumber = (currentVisiblePageNumber, count) => {
    const nextPage = currentVisiblePageNumber + count
    if (nextPage > this.props.maxPageNumber){
      return nextPage - this.props.maxPageNumber
    }
    return nextPage
  }

  _getLastPageNumber = (currentVisiblePageNumber, count) => {
    const lastPage = currentVisiblePageNumber - count
    if (lastPage <= 0){
      return this.props.maxPageNumber + lastPage
    }
    return lastPage
  }

  _shouldPageRender = (pageNumber, currentVisiblePageNumber) => {
    if (!this.props.lazyrender){
      return true
    }

    if (pageNumber === currentVisiblePageNumber){
      return true
    }

    for (let i = 1; i <= this.props.lazyrenderThreshold; i++){
      if (pageNumber === this._getNextPageNumber(currentVisiblePageNumber, i)){
        return true
      }
      if (pageNumber === this._getLastPageNumber(currentVisiblePageNumber, i)){
        return true
      }
    }

    return false
  }

  render() {
    const borderWidth = this.props.dev ? 1 : 0
    return (
      <View
        style={{
          width: this.props.pageWidth,
          borderWidth,
        }}
      >
        {this.state.shouldRender && this.props.children}
      </View>
    )
  }
}
