import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
} from 'react-native'

import ViewPager from './ViewPager'

const VIEWPORT_WIDTH = Dimensions.get('window').width

class TabbedPager extends PureComponent {

  static propTypes = {
    data: React.PropTypes.arrayOf(
      React.PropTypes.object
    ),
    dev: React.PropTypes.bool,
    lazyrender: React.PropTypes.bool,
    renderAsCarousel: React.PropTypes.bool,
    experimentalMirroring: React.PropTypes.bool,
    fullScreen: React.PropTypes.bool,

    tabContainerPosition: React.PropTypes.string,
    scrollTabsEnabled: React.PropTypes.bool,
    staticTabWidth: React.PropTypes.number,
    showTabIndicator: React.PropTypes.bool,
    tabIndicatorColor: React.PropTypes.string,
    tabIndicatorHeight: React.PropTypes.number,

    DividerComponent: React.PropTypes.any,

    renderPage: React.PropTypes.func.isRequired,
    renderTab: React.PropTypes.func.isRequired,
    onPageChange: React.PropTypes.func,
  }
  
  static defaultProps = {
    data: [],
    dev: false,
    lazyrender: false,
    renderAsCarousel: true,
    experimentalMirroring: false,
    fullScreen: true,

    tabContainerPosition: 'top',
    scrollTabsEnabled: false,
    staticTabWidth: VIEWPORT_WIDTH / 2,
    showTabIndicator: true,
    tabIndicatorColor: 'transparent',
    tabIndicatorHeight: 2,
    
    onPageChange: () => {},
  }

  static TABCONTAINER_POSITION = {
    TOP: 'top',
    BOTTOM: 'bottom',
  }

  constructor(props) {
    super(props)

    this.tabThresholdPages = this.props.renderAsCarousel 
      ? Math.ceil((VIEWPORT_WIDTH / this.props.staticTabWidth) / 2) + 1
      : 0
    this.contentThresholdPages = this.props.renderAsCarousel  
      ? 1
      : 0
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
    this.contentPager.scrollToPage(pageNumber)
  }

  scrollToIndex = pageIndex => {
    this.contentPager.scrollToIndex(pageIndex - this.tabThresholdPages + this.contentThresholdPages)
  }

  _onPageChange = pageNumber => {
    this.props.onPageChange(pageNumber)
  }

  _onScroll = dx => {
    this.tabbar.scroll(dx)
  }

  _renderTabsContainer = (position) => {
    return position === this.props.tabContainerPosition 
      ? (
        <View>
          <ViewPager
            ref={tabbar => {
              this.tabbar = tabbar
            }}
            dev={this.props.dev}
            renderAsCarousel={this.props.renderAsCarousel && this.props.data.length > 1}
            data={this.props.data}
            renderPage={this._renderTab}
            pageWidth={this.props.staticTabWidth}
            pagingEnabled={false}
            onShouldSwitchToPage={this.scrollToPage}
            scrollEnabled={this.props.scrollTabsEnabled}
            {...this._getContentProps()}
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
                  backgroundColor: this.props.tabIndicatorColor
                }
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
          dev={this.props.dev}
          renderAsCarousel={this.props.renderAsCarousel && this.props.data.length > 1}
          lazyrender={this.props.lazyrender}
          data={this.props.data}
          containerStyle={this.props.fullScreen ? styles.fullScreen : null}
          renderPage={this._renderPage}
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