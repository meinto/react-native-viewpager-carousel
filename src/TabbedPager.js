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
    contentContainerStyle: PropTypes.any,
    forceRerenderOnPageChange: PropTypes.bool,
    initialPage: PropTypes.object,
    lazyrenderThreshold: PropTypes.number,
    tabContainerPosition: PropTypes.string,
    scrollTabsEnabled: PropTypes.bool,
    staticTabWidth: PropTypes.number,
    showTabIndicator: PropTypes.bool,
    tabIndicatorColor: PropTypes.string,
    tabIndicatorHeight: PropTypes.number,
    tabsVisible: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    firePageChangeIfPassedScreenCenter: PropTypes.bool,

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
    lazyrenderThreshold: 1,
    tabContainerPosition: 'top',
    scrollTabsEnabled: false,
    staticTabWidth: VIEWPORT_WIDTH / 2,
    showTabIndicator: true,
    tabIndicatorColor: 'transparent',
    tabIndicatorHeight: 2,
    tabsVisible: true,
    scrollEnabled: true,
    firePageChangeIfPassedScreenCenter: false,

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
    return position === this.props.tabContainerPosition && this.props.tabsVisible
      ? (
        <View>
          <ViewPager
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
    return position === this.props.tabContainerPosition && this.props.tabsVisible
      ? this.props.DividerComponent
      : null
  }

  _renderTab = ({data, _pageIndex, _pageNumber}) => {
    return this.props.tabsVisible
      ? this.props.renderTab({data, _pageIndex, _pageNumber})
      : null
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
          contentContainerStyle={this.props.contentContainerStyle}
          renderPage={this._renderPage}
          scrollEnabled={this.props.scrollEnabled}
          firePageChangeIfPassedScreenCenter={this.props.firePageChangeIfPassedScreenCenter}
          initialPage={this.props.initialPage}
          onPageChange={this._onPageChange}
          onScroll={this._onScroll}
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