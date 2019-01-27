import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
} from 'react-native'
import PropTypes from 'prop-types'
import Mirror, { scrollviewBootstrap } from 'react-native-mirror'
import Page from './Page'


const VIEWPORT_WIDTH = Dimensions.get('window').width

export default class ViewPager extends PureComponent {

  static defaultProps = {
    dev: false,
    log: false,
    thresholdPages: 1,
    renderAsCarousel: true,
    pageWidth: VIEWPORT_WIDTH,
    pagingEnabled: true,
    contentContainerStyle: {},
    containerStyle: {},
    renderPage: () => {},
    onPageChange: () => {},
    onScroll: () => {},
    scrollEnabled: true,
    data: [],
    experimentalMirroring: false,
    showNativeScrollIndicator: false,
    lazyrender: false,
    initialPage: {},
    lazyrenderThreshold: 1,
    firePageChangeIfPassedScreenCenter: false,
  }

  static propTypes = {
    lazyrenderThreshold: PropTypes.number,
    contentContainerStyle: PropTypes.any,
    containerStyle: PropTypes.any,
    data: PropTypes.arrayOf(
      PropTypes.object
    ),
    dev: PropTypes.bool,
    log: PropTypes.bool,
    initialPage: PropTypes.object,
    renderAsCarousel: PropTypes.bool,
    thresholdPages: PropTypes.number,
    pageWidth: PropTypes.number,
    scrollEnabled: PropTypes.bool,
    pagingEnabled: PropTypes.bool,
    experimentalMirroring: PropTypes.bool,
    showNativeScrollIndicator: PropTypes.bool,
    lazyrender: PropTypes.bool,
    firePageChangeIfPassedScreenCenter: PropTypes.bool,

    renderPage: PropTypes.func,
    onPageChange: PropTypes.func,
    onScroll: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this._pageWithDelta = (VIEWPORT_WIDTH - this.props.pageWidth) / 2

    this._onMomentumScrollEndTimeout = null

    this.pageReferences = {}
    this.data = this.props.data || []
    this.pageCount = this.data.length
    this.thresholdPages =
      this.props.renderAsCarousel &&
      this.pageCount > 1
        ? this.props.thresholdPages : 0
    this.scrollIndex = 0
    this.pageIndex = this.thresholdPages
    this.pageIndexBeforeDrag = this.thresholdPages

    this.state = {
      dataSource: [...this._prepareData(this.props.data || [])],
    }

    this.contentContainerStyle = {
      width: this.props.pageWidth * this.state.dataSource.length,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props.renderAsCarousel && Object.keys(this.props.initialPage).length === 0) {
        this._scrollTo({
          x: this.props.pageWidth * this.thresholdPages - this._pageWithDelta,
          animated: false,
        })
      } else {
        this.scrollToPageWithKeyValuePair(this.props.initialPage)
      }
    }, 0)
  }

  componentWillReceiveProps(nextProps) {
    const newDataSource = [...this._prepareData(nextProps.data || [])]
    if (newDataSource.length !== this.state.dataSource.length || nextProps.pageWidth !== this.props.pageWidth){
      this.contentContainerStyle = {
        width: nextProps.pageWidth * newDataSource.length,
      }
    }
    this.setState({
      dataSource: newDataSource,
    })
  }

  /*
   * public methods
   */
  scroll = dx => {
    const realPageWidth = VIEWPORT_WIDTH / this.props.pageWidth
    const realPageWidthTrunc = Math.trunc(realPageWidth)

    const centerPageDelta = realPageWidthTrunc % 2 === 0
      ? -(this.props.pageWidth / 2 + this.props.pageWidth * (realPageWidthTrunc / 2 - 1))
      : -this.props.pageWidth * (Math.floor(realPageWidthTrunc / 2))

    const thresholdOffset = this.props.renderAsCarousel ? (this.props.pageWidth * this.thresholdPages + centerPageDelta) : 0

    let centeredScrollX = dx / (realPageWidth) - this.props.pageWidth + thresholdOffset
    const xBiggerThanZero = centeredScrollX > 0
    const xBiggerThanScrollViewWitdh = (centeredScrollX + VIEWPORT_WIDTH)
      > (this.pageCount + this.thresholdPages) * this.props.pageWidth

    if (!xBiggerThanZero && !this.props.renderAsCarousel)
      centeredScrollX = 0

    if (xBiggerThanScrollViewWitdh && !this.props.renderAsCarousel)
      centeredScrollX = ((this.pageCount + this.thresholdPages) * this.props.pageWidth) - VIEWPORT_WIDTH

    this._scrollTo({
      animated: false,
      x: centeredScrollX,
    })
  }

  scrollToPage = pageNumber => {
    this._scrollTo({
      animated: true,
      x: ((pageNumber - 1) + this.thresholdPages) * VIEWPORT_WIDTH,
    })
  }

  scrollToPageWithKeyValuePair = keyValuePair => {
    const pageIndex = this._getPageIndexByKeyValuePair(keyValuePair)
    this.scrollToIndex(pageIndex, false)
  }

  scrollToIndex = (pageIndex, animated = true) => {
    let index = pageIndex < 0 ? 0 : pageIndex
    const lastIndex = this.state.dataSource.length - 1
    index = index > lastIndex ? lastIndex : index
    this._scrollTo({
      animated,
      x: index * VIEWPORT_WIDTH,
    })
  }

  /*
   * private methods
   */
  _setPageNumber = (data) => {
    return data.map((_data, index) => {
      return Object.assign({}, _data, {
        _pageNumber: index + 1,
      })
    })
  }

  _setPageIndex = data => {
    return data.map((_data, index) => {
      return Object.assign({}, _data, {
        _pageIndex: index,
      })
    })
  }

  _addThresholdPages = data => {
    let preparedData = []

    const multiplicator = data.length > 0 ? Math.ceil(this.thresholdPages / data.length) : 0

    let thresholdDataFront = []
    let thresholdDataEnd = []

    for (let i = 0; i < multiplicator; i++) {
      thresholdDataFront = [...thresholdDataFront, ...[...data].reverse()]
      thresholdDataEnd = [...thresholdDataEnd, ...data]
    }

    let thresholdFront = thresholdDataFront.slice(0, this.thresholdPages).reverse()
    let thresholdEnd = thresholdDataEnd.slice(0, this.thresholdPages)

    thresholdFront = thresholdFront.map(thresholdPage => ({
      ...thresholdPage,
      _isThresholdPage: true,
    }))
    thresholdEnd = thresholdEnd.map(thresholdPage => ({
      ...thresholdPage,
      _isThresholdPage: true,
    }))

    preparedData = [...thresholdFront, ...data, ...thresholdEnd]

    return preparedData
  }

  _prepareData = (data) => {
    const initializedData = this._setPageNumber(data)

    let preparedData = [...initializedData]
    if (this.props.renderAsCarousel) {
      preparedData = this._addThresholdPages(initializedData)
    }
    preparedData = this._setPageIndex(preparedData)

    return [...preparedData]
  }

  _getPageNumberByIndex = index => {
    const roundedIndex = Math.round(index)
    if (this.props.renderAsCarousel) {
      if (roundedIndex === 0) return this.state.dataSource.length - 1
      if (roundedIndex === this.state.dataSource.length - 1) return 1
    }
    const pageNumber = this.state.dataSource[roundedIndex] ? this.state.dataSource[roundedIndex]._pageNumber : 1
    return pageNumber
  }

  _getPageIndexByKeyValuePair = keyValuePair => {
    const key = Object.keys(keyValuePair)[0]
    const value = keyValuePair[key]
    const pageWithKeyValuePair = this.state.dataSource
      .filter(page => page._pageIndex > this.props.thresholdPages - 1)
      .filter(page => page._pageIndex < this.props.data.length + this.props.thresholdPages)
      .find(page => {
        return page[key] && page[key] === value
      })
    let pageIndex = 0
    if (pageWithKeyValuePair)
      pageIndex = pageWithKeyValuePair._pageIndex
    return pageIndex
  }

  _scrollTo = (options) => {
    if (this.scrollView) {
      this.scrollView.scrollTo(options)
    }
  }

  _getCurrentScrollIndex = offsetX => {
    return Math.ceil(((offsetX + this._pageWithDelta) / this.props.pageWidth) * 100) / 100
  }

  _onScroll = (event) => {
    if (this._onMomentumScrollEndTimeout)
      clearTimeout(this._onMomentumScrollEndTimeout)

    let offsetX = event.nativeEvent.contentOffset.x
    this.props.onScroll(offsetX)

    this.scrollIndex = this._getCurrentScrollIndex(offsetX)

    // fire onPageChange if the dragged page passed half of the screen
    this._triggerOnPageChange()

    if (this.props.renderAsCarousel && this.scrollIndex % 1 < 0.03) {
      if (Math.trunc(this.scrollIndex) === 0) {

        offsetX = VIEWPORT_WIDTH * (this.state.dataSource.length - 2)
        this._scrollTo({
          animated: false,
          x: offsetX,
        })
        this.props.onScroll(offsetX)

      } else if (Math.trunc(this.scrollIndex) === this.state.dataSource.length - 1) {

        offsetX = VIEWPORT_WIDTH
        this._scrollTo({
          animated: false,
          x: offsetX,
        })
        this.props.onScroll(offsetX)

      }
    }

    this._onMomentumScrollEndTimeout = setTimeout(() => {
      this._onMomentumScrollEnd()
    }, 50)

    this.pageIndex = Math.round(this.scrollIndex)
  }

  _onPageChange = () => {
    if (this.pageIndexBeforeDrag !== this.pageIndex || Object.keys(this.props.initialPage).length > 0) {
      const pageNumber = this._getPageNumberByIndex(this.pageIndex)
      this.pageIndexBeforeDrag = this.pageIndex
      this.props.onPageChange(pageNumber)
    }
  }

  _onScrollBeginDrag = () => {
    this.pageIndexBeforeDrag = this.pageIndex
  }

  _onMomentumScrollEnd = () => {
    const pageNumber = this._getPageNumberByIndex(this.pageIndex)
    for (const key in this.pageReferences) {
      if (this.pageReferences[key])
        this.pageReferences[key].onPageChange(pageNumber)
    }
    this._triggerOnPageChange()
  }

  _getScrollEnabled = () => {
    return (
      this.props.scrollEnabled &&
      this.pageCount > 1 &&
      (this.pageCount + this.thresholdPages) * this.props.pageWidth > VIEWPORT_WIDTH
    )
  }

  _triggerOnPageChange = () => {
    if (!this.props.firePageChangeIfPassedScreenCenter && this.scrollIndex % 1 < 0.03) {
      this._onPageChange()
    } else if (
      (this.pageIndexBeforeDrag + 0.5 < this.scrollIndex ||
      this.pageIndexBeforeDrag - 0.5 > this.scrollIndex) &&
      this.props.firePageChangeIfPassedScreenCenter
    ) {
      this._onPageChange()
    }
  }

  /*
   * render parts
   */

  _renderPage = (item, index) => {

    let row = (
      <View
        key={index}
        style={[styles.rowContainer, {
          width: this.props.pageWidth,
        }]}
      >
        {this.props.renderPage({
          data: item,
          _pageNumber: item._pageNumber,
          _pageIndex: item._pageIndex,
        })}
      </View>
    )

    if (this.props.renderAsCarousel && this.props.experimentalMirroring === true) {
      if (index <= this.thresholdPages) {
        row = (
          <Mirror
            key={index}
            connectionId={'mirror-' + index}
            containerStyle={styles.mirror}
            experimentalComponentDetection={true}
            mirroredProps={[
              scrollviewBootstrap,
            ]}
          >
            {row}
          </Mirror>
        )
      }

      if (index >= this.state.dataSource.length - this.thresholdPages - 1) {
        const idIndex = index - (this.state.dataSource.length - this.thresholdPages - 1)
        row = (
          <Mirror
            key={index}
            connectionId={'mirror-' + idIndex}
            containerStyle={styles.mirror}
            experimentalComponentDetection={true}
            mirroredProps={[
              scrollviewBootstrap,
            ]}
          >
            {row}
          </Mirror>
        )
      }
    }

    return row
  }

  render() {

    this.pageReferences = {}

    return (
      <View
        style={[styles.container, this.props.containerStyle]}
      >
        <ScrollView
          ref={(scrollView) => {
            this.scrollView = scrollView
          }}
          onScrollBeginDrag={this._onScrollBeginDrag}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          horizontal={true}
          pagingEnabled={this.props.pagingEnabled}
          scrollEnabled={this._getScrollEnabled()}
          showsHorizontalScrollIndicator={this.props.showNativeScrollIndicator}
          showsVerticalScrollIndicator={this.props.showNativeScrollIndicator}
          onScroll={this._onScroll}
          scrollEventThrottle={1}
          contentContainerStyle={[styles.scrollViewContainer, this.props.contentContainerStyle, this.contentContainerStyle]}>
          {this.state.dataSource.map((item, index) => {
            return (
              <Page
                key={index}
                ref={_page => {
                  this.pageReferences[index] = _page
                }}
                dev={this.props.dev}
                maxPageNumber={this.props.data.length}
                pageNumber={item._pageNumber}
                isThresholdPage={item._isThresholdPage || false}
                lazyrender={this.props.lazyrender}
                pageWidth={this.props.pageWidth}
                lazyrenderThreshold={this.props.lazyrenderThreshold}
              >
                {this._renderPage(item, index)}
              </Page>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scrollViewContainer: {
    flexDirection: 'row',
    /*
     * bug in react-native
     * overflow style has to be set
     * https://github.com/facebook/react-native/issues/12926
     */
    overflow: 'scroll',
  },
  rowContainer: {
    flexGrow: 1,
  },
  mirror: {
    flexGrow: 1,
  },
})
