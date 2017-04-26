import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Dimensions,
  Animated,
  View,
  PanResponder,
} from 'react-native'

import Page from './Page'

const VIEWPORT_WIDTH = Dimensions.get('window').width

class ViewPager extends PureComponent {

  static defaultProps = {
    thresholdPages: 2,
    pageWidth: VIEWPORT_WIDTH,
    contentContainerStyle: {},
    renderRow: () => {},
    onPan: () => {},
    onPageChange: () => {},
    disablePan: false,
    data: [],
  }

  constructor(props) {
    super(props)

    const initializedData = this._initializeData(this.props.data)

    this._pageWithDelta = (VIEWPORT_WIDTH - this.props.pageWidth) / 2
    this._initialLeft = this._calculateLeftByPageNumber(this.props.thresholdPages)

    this.state = {
      pan: {
        left: new Animated.Value(this._initialLeft),
      },
      initializedData,
      dataSource: [...this._prepareData(initializedData, this.props.thresholdPages)],
    }
  }

  componentWillMount() {
    if (this.props.disablePan) {
      this._panResponder = {}
    } else {
      this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
        onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
        onPanResponderMove: this._handlePanResponderMove,
        onPanResponderRelease: this._handlePanResponderEnd,
        onPanResponderTerminate: this._handlePanResponderEnd,
      })
    }

    this._previousLeft = this._initialLeft
  }

  _initializeData = (data) => {
    return data.map((_data, _index) => {
      return Object.assign({}, _data, { index: _index })
    })
  }

  _prepareData = (data, pageIndex) => {

    let pageNumber = (pageIndex < 0) ? 0 : pageIndex
    pageNumber = (this.state && pageIndex > this.state.dataSource.length - 1) ? this.state.dataSource.length - 1 : pageNumber

    const currentIndex = (this.state) ? this.state.dataSource[pageNumber].index : 0
    const currentKey = (this.state) ? this.state.dataSource[pageNumber].key : 0

    let dataArray = [
      Object.assign({}, data[currentIndex], {
        shouldUpdate: true,
        key: currentKey,
        pageNumber: this.props.thresholdPages,
      }),
    ]

    for (let i = 1; i <= this.props.thresholdPages; i++) {
      const indexShortener = -parseInt(i / data.length) * data.length
      const indexBefore = (currentIndex - i >= 0) ? currentIndex - i : data.length - (i - indexShortener)
      const indexAfter = (currentIndex + i < data.length) ? currentIndex + i : (currentIndex + (i - indexShortener)) - data.length

      //console.log(indexBefore, indexAfter)
      dataArray = [
        Object.assign({}, data[indexBefore], {
          shouldUpdate: false,
          key: currentKey - i,
          pageNumber: this.props.thresholdPages - i,
        }),
        ...dataArray,
        Object.assign({}, data[indexAfter], {
          shouldUpdate: false,
          key: currentKey + i,
          pageNumber: this.props.thresholdPages + i,
        }),
      ]
    }
    
    return dataArray
  }

  _getPageNumber = (left) => {
    return parseInt(-((left - (this.props.pageWidth / 2)) / this.props.pageWidth), 10)
  }

  _handleStartShouldSetPanResponder = () => {
    //console.log(gestureState.dx)
    return false
  }

  _handleMoveShouldSetPanResponder = (e, gestureState) => {
    return Math.abs(gestureState.dx) > 15
  }

  _handlePanResponderMove = (e, gestureState) => {
    this.props.onPan(gestureState.dx)
    this._setLeftValue(this._previousLeft + gestureState.dx)
  }

  _handlePanResponderEnd = (e, gestureState) => {
    let pageNumber = this._getPageNumber(this._previousLeft + gestureState.dx)

    pageNumber = (gestureState.vx > 0.1) ? pageNumber - 1 : pageNumber
    pageNumber = (gestureState.vx < -0.1) ? pageNumber + 1 : pageNumber

    this._animateToPageNr(pageNumber)
  }

  _setLeftValue = (left) => {
    this.state.pan.left.setValue(left)
  }

  panRelative = (dx, div) => {
    this._setLeftValue(this._previousLeft + dx / div)
  }

  pan = dx => {
    this._setLeftValue(this._previousLeft + dx)
  }

  scrollToPage = pageNumber => {
    this._animateToPageNr(pageNumber)
  }

  _shouldSwitchToPage = pageNumber => {
    this.props.onShouldSwitchToPage(pageNumber)
  }

  _getPageNumberByIndex = index => {
    return this.state && this.state.dataSource[index]
  }

  _calculateLeftByPageNumber = pageNumber => {
    return -(this.props.pageWidth * ((this.props.thresholdPages * pageNumber)) / this.props.thresholdPages) + this._pageWithDelta
  }

  _animateToPageNr(pageNumber) {
    this.props.onPageChange(pageNumber)
    Animated.timing(
      this.state.pan.left,
      {
        toValue: this._calculateLeftByPageNumber(pageNumber),
        duration: 200,
        // easing: Easing.ease,
      }
    ).start(() => {
      setTimeout(() => {
        this._animationEnd(pageNumber)
      }, 0)
    })
  }

  _animationEnd = (pageNumber) => {
    this.setState({
      dataSource: [...this._prepareData(this.state.initializedData, pageNumber)],
    })
    this.state.pan.left.setValue(this._initialLeft)
  }

  _renderRow = ({item}) => {
    return (
      <Page
        key={item.key}
        shouldUpdate={item.shouldUpdate}
        pageNumber={item.pageNumber}
        shoudSwitchPage={pageNumber => {
          this._shouldSwitchToPage(pageNumber)
        }}
        childData={item}
        renderChild={this.props.renderRow}
      />
    )
  }

  render() {
    return (
      <Animated.View 
        ref={(scrollView) => {
          this.scrollView = scrollView
        }}
        {...this._panResponder.panHandlers}
        style={[styles.container, this.props.contentContainerStyle, {
          width: this.props.pageWidth * (this.props.thresholdPages * 2 + 1),
          left: this.state.pan.left,
        }]}>

        {this.state.dataSource.map(item => this._renderRow({item}))}
      </Animated.View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    /*
     * bug in react-native
     * overflow style has to be set
     * https://github.com/facebook/react-native/issues/12926
     */
    overflow: 'scroll',
  },
  rowContainer: {
    flex: 1,
  },
})


ViewPager.propTypes = {
  contentContainerStyle: React.PropTypes.any,
  data: React.PropTypes.arrayOf(
    React.PropTypes.object
  ),
  thresholdPages: React.PropTypes.number,
  pageWidth: React.PropTypes.number,
  disablePan: React.PropTypes.bool,

  renderRow: React.PropTypes.func,
  onPageChange: React.PropTypes.func,
  onPan: React.PropTypes.func,
  onShouldSwitchToPage: React.PropTypes.func,
}


export default ViewPager