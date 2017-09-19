import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
} from 'react-native'
import PropTypes from 'prop-types'

import ViewPager from './ViewPager'

const VIEWPORT_WIDTH = Dimensions.get('window').width

class TabbedPager extends PureComponent {

  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.object
    ),
    dev: PropTypes.bool,
    lazyrender: PropTypes.bool,
    renderAsCarousel: PropTypes.bool,
    experimentalMirroring: PropTypes.bool,
    fullScreen: PropTypes.bool,
    forceRerenderOnPageChange: PropTypes.bool,
    initialPage: PropTypes.object,
    lazyRenderCount: PropTypes.number,
    tabContainerPosition: PropTypes.string,
    scrollTabsEnabled: PropTypes.bool,
    staticTabWidth: PropTypes.number,
    showTabIndicator: PropTypes.bool,
    tabIndicatorColor: PropTypes.string,
    tabIndicatorHeight: PropTypes.number,

    DividerComponent: PropTypes.any,

    renderPage: PropTypes.func.isRequired,
    renderTab: PropTypes.func.isRequired,
    onPageChange: PropTypes.func,
  }

  static defaultProps = {
    data: [],
    dev: false,
    lazyrender: false,
    renderAsCarousel: true,
    experimentalMirroring: false,
    fullScreen: true,
    initialPage: {},
    lazyRenderCount: 2,
    tabContainerPosition: 'top',
    scrollTabsEnabled: false,
    staticTabWidth: VIEWPORT_WIDTH / 2,
    showTabIndicator: true,
    tabIndicatorColor: 'transparent',
    tabIndicatorHeight: 2,

    onPageChange: () => {},
    forceRerenderOnPageChange: false,
  }

  static TABCONTAINER_POSITION = {
    TOP: 'top',
    BOTTOM: 'bottom',
  }

  constructor(props) {
    super(props)

    this.data = this.props.data || []

    this.tabThresholdPages =
      this.props.renderAsCarousel &&
      this.data.length > 1
        ? Math.ceil((VIEWPORT_WIDTH / this.props.staticTabWidth) / 2) + 1
        : 0

    this.contentThresholdPages =
      this.props.renderAsCarousel &&
      this.data.length > 1
        ? 1
        : 0

    this.pageCount = this.props.data.length

    this.summedTabsWidthOverflow = (this.pageCount + this.tabThresholdPages) * this.props.staticTabWidth
      > VIEWPORT_WIDTH
  }

  _getContentProps = () => {
    let contentProps = {}

    Object.keys(this.props).forEach(_key => {

      let isContentProp = true
      switch (_key) {
        case 'data':
        case 'contentContainerStyle':
        case 'renderPage':
        case 'onPageChange':
        case 'onScroll':
          isContentProp = false
      }

      Object.keys(TabbedPager.defaultProps).forEach(_defaultPropKey => {
        if (_key === _defaultPropKey) isContentProp = false
      })

      if (isContentProp) {
        contentProps = Object.assign({}, contentProps, {
          [_key]: this.props[_key],
        })
      }
    })

    return contentProps
  }

  scrollToPage = pageNumber => {
    if (this.contentPager)
      this.contentPager.scrollToPage(pageNumber)
  }

  scrollToIndex = pageIndex => {
    if (this.contentPager)
      this.contentPager.scrollToIndex(pageIndex - this.tabThresholdPages + this.contentThresholdPages)
  }

  _onPageChange = pageNumber => {
    this.props.onPageChange(pageNumber)
    if (this.props.forceRerenderOnPageChange === true)
      this.forceUpdate()
  }

  _onScroll = dx => {
    if (this.tabbar && this.summedTabsWidthOverflow)
      this.tabbar.scroll(dx)
  }


  _renderTabsContainer = (position) => {
    return position === this.props.tabContainerPosition
      ? (
        <View>
          <ViewPager
            {...this.props}
            ref={tabbar => {
              this.tabbar = tabbar
            }}
            log={false}
            dev={this.props.dev}
            renderAsCarousel={this.props.renderAsCarousel && this.props.data.length > 1}
            data={this.props.data}
            renderPage={this._renderTab}
            pageWidth={this.props.staticTabWidth}
            pagingEnabled={false}
            onShouldSwitchToPage={this.scrollToPage}
            scrollEnabled={this.props.scrollTabsEnabled}
            thresholdPages={this.tabThresholdPages}
            experimentalMirroring={false}
          />
          {this.props.showTabIndicator && (
            <View
              style={[
                styles.tabIndicator,
                {
                  width: this.props.staticTabWidth,
                  height: this.props.tabIndicatorHeight,
                  backgroundColor: this.props.tabIndicatorColor,
                },
              ]}
            />
          )}
        </View>
      )
      : null
  }

  _renderDividerComponent = (position) => {
    return position === this.props.tabContainerPosition
      ? this.props.DividerComponent
      : null
  }

  _renderTab = ({data, _pageIndex}) => {
    return this.props.renderTab({data, _pageIndex})
  }

  _renderPage = (item) => {
    return this.props.renderPage(item)
  }

  render() {
    return (
      <View style={this.props.fullScreen ? styles.fullScreen : null}>
        {this._renderTabsContainer(TabbedPager.TABCONTAINER_POSITION.TOP)}
        {this._renderDividerComponent(TabbedPager.TABCONTAINER_POSITION.TOP)}
        <ViewPager
          ref={contentPager => {
            this.contentPager = contentPager
          }}
          log={true}
          dev={this.props.dev}
          renderAsCarousel={this.props.renderAsCarousel && this.props.data.length > 1}
          lazyrender={this.props.lazyrender}
          data={this.props.data}
          containerStyle={this.props.fullScreen ? styles.fullScreen : null}
          renderPage={this._renderPage}
          initialPage={this.props.initialPage}
          onPageChange={this._onPageChange}
          onScroll={this._onScroll}
          {...this._getContentProps()}
          thresholdPages={this.contentThresholdPages}
          experimentalMirroring={this.props.experimentalMirroring}
        />
        {this._renderDividerComponent(TabbedPager.TABCONTAINER_POSITION.BOTTOM)}
        {this._renderTabsContainer(TabbedPager.TABCONTAINER_POSITION.BOTTOM)}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  tabIndicator: {
    alignSelf: 'center',
  },
})

export default TabbedPager