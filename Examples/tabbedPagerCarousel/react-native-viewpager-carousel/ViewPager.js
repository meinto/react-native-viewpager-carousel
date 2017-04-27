import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  InteractionManager,
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

    const initializedData = this._initializeData(this.props.data || [])

    this._pageWithDelta = (VIEWPORT_WIDTH - this.props.pageWidth) / 2
    this._initialLeft = this._calculateLeftByPageNumber(this.props.thresholdPages)

    this.pages = []

    this.state = {
      initializedData,
      dataSource: [...this._prepareData(initializedData)],
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.scrollView.scrollTo({
        x: VIEWPORT_WIDTH,
        animated: false,
      })
    }, 0)
  }

  _initializeData = (data) => {
    return data.map((_data, index) => {
      return Object.assign({}, _data, { index })
    })
  }

  _prepareData = (data) => {
    return [data[data.length - 1], ...data, data[0]]
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////

  _getPageNumber = (left) => {
    return parseInt(-((left - (this.props.pageWidth / 2)) / this.props.pageWidth), 10)
  }

  _handleStartShouldSetPanResponder = () => {
    return false
  }

  _handleMoveShouldSetPanResponder = (e, gestureState) => {
    const souldSetPanResponder = Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 10
    if (souldSetPanResponder)
      this._isPanning(true)
    return souldSetPanResponder
  }

  _handlePanResponderMove = (e, gestureState) => {
    this._isPanning(true)
    this.props.onPan(gestureState.dx)
    this._setLeftValue(this._previousLeft + gestureState.dx)
  }

  _handlePanResponderEnd = (e, gestureState) => {
    this._isPanning(false)
    let pageNumber = this._getPageNumber(this._previousLeft + gestureState.dx)

    pageNumber = (gestureState.vx > 0.2 && pageNumber === this.props.thresholdPages) ? pageNumber - 1 : pageNumber
    pageNumber = (gestureState.vx < -0.2 && pageNumber === this.props.thresholdPages) ? pageNumber + 1 : pageNumber

    this._animateToPageNr(pageNumber)
  }

  _isPanning = isPanning => {
    this.pages.forEach(_page => {
      if (_page) _page.onIsPanning(isPanning)
    })
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
      this._animationEnd(pageNumber)
    })
  }

  _animationEnd = (pageNumber) => {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        dataSource: [...this._prepareData(this.state.initializedData, pageNumber)],
      })
      this.state.pan.left.setValue(this._initialLeft)
    })
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////


  _onScroll = (event) => {
    this.pageIndex = event.nativeEvent.contentOffset.x / VIEWPORT_WIDTH

    if (this.pageIndex % 1 === 0) {
      if (this.pageIndex === 0) {
        this.scrollView.scrollTo({
          animated: false, 
          x: VIEWPORT_WIDTH * (this.state.dataSource.length - 2),
        })
      }

      if (this.pageIndex === this.state.dataSource.length - 1) {
        this.scrollView.scrollTo({
          animated: false, 
          x: VIEWPORT_WIDTH,
        })
      }
    }
  }

  _renderRow = ({item}) => {
    return (
      <Page
        ref={page => {
          this.pages.push(page)
        }}
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
    this.pages = []
    return (
      <ScrollView
        ref={(scrollView) => {
          this.scrollView = scrollView
        }}
        horizontal={true}
        pagingEnabled={true}
        onScroll={this._onScroll}
        contentContainerStyle={[styles.container, this.props.contentContainerStyle, {
          width: this.props.pageWidth * this.state.dataSource.length,
        }]}>

        {this.state.dataSource.map(item => this._renderRow({item}))}
      </ScrollView>
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