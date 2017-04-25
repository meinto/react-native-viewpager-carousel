import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Dimensions,
  Animated,
  View,
  Text,
  PanResponder,
  Easing,
} from 'react-native'


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
    data: []
  }

  constructor(props) {
    super(props)

    const initializedData = this._initializeData(this.props.data)

    this._pageWithDelta = (VIEWPORT_WIDTH - this.props.pageWidth) / 2
    this._initialLeft = this._calculateLeftByPageNumber(2)

    this.state = {
      pan: {
        left: new Animated.Value(this._initialLeft)
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

    let dataArray = [
      Object.assign({}, data[currentIndex], {
        key: currentIndex,
        pageNumber: this.props.thresholdPages
      })
    ]

    for (const i = 1; i <= this.props.thresholdPages; i++) {
      const indexBefore = (currentIndex - i >= 0) ? currentIndex - i : data.length - i
      const indexAfter = (currentIndex + i < data.length) ? currentIndex + i : (currentIndex + i) - data.length
      dataArray = [
        Object.assign({}, data[indexBefore], {
          key: indexBefore,
          pageNumber: this.props.thresholdPages - i,
        }),
        ...dataArray,
        Object.assign({}, data[indexAfter], {
          key: indexAfter,
          pageNumber: this.props.thresholdPages + i,
        }),
      ]
    }
    
    return dataArray
  }

  _getPageNumber = (left) => {
    return parseInt(-((left - (this.props.pageWidth / 2)) / this.props.pageWidth), 10)
  }

  _handleStartShouldSetPanResponder = (e, gestureState) => {
    console.log(gestureState.dx)
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

    pageNumber = (gestureState.vx > 0.1) ?  pageNumber - 1 : pageNumber
    pageNumber = (gestureState.vx < -0.1) ?  pageNumber + 1 : pageNumber

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

  scrollToPage(pageNumber) {
    this._animateToPageNr(pageNumber)
  }

  _getPageNumberByIndex = index => {
    return this.state && this.state.dataSource[index]
  }

  _calculateLeftByPageNumber = pageNumber => {
    return - (this.props.pageWidth * ((this.props.thresholdPages * pageNumber)) / 2) + this._pageWithDelta
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
      <View
        key={item.key}
        style={{
          flex: 1,
        }}
      >
        {this.props.renderRow(item)}
      </View>
    )
  }

  render() {
    return (
      <Animated.View 
        ref={(scrollView) => {
          this.scrollView = scrollView;
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
    backgroundColor: '#00000000',
    /*
     * bug in react-native
     * overflow style has to be set
     * https://github.com/facebook/react-native/issues/12926
     */
    overflow: 'scroll',
  }
})


export default ViewPager