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
    lazyrender: React.PropTypes.bool,
    renderAsCarousel: React.PropTypes.bool,
    experimentalMirroring: React.PropTypes.bool,

    tabContainerPosition: React.PropTypes.string,
    scrollTabsEnabled: React.PropTypes.bool,
    staticTabWidth: React.PropTypes.number,
    showTabIndicator: React.PropTypes.bool,
    tabIndicatorColor: React.PropTypes.string,
    tabIndicatorHeight: React.PropTypes.number,

    renderPage: React.PropTypes.func.isRequired,
    renderTab: React.PropTypes.func.isRequired,
    onPageChange: React.PropTypes.func,
  }
  
  static defaultProps = {
    data: [],
    lazyrender: false,
    renderAsCarousel: true,
    experimentalMirroring: false,

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
    this.contentPager.scrollToIndex(pageIndex - 1)
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
            renderAsCarousel={this.props.renderAsCarousel}
            data={this.props.data}
            renderPage={this._renderTab}
            pageWidth={this.props.staticTabWidth}
            pagingEnabled={false}
            onShouldSwitchToPage={this.scrollToPage}
            scrollEnabled={this.props.scrollTabsEnabled}
            {...this._getContentProps()}
            thresholdPages={Math.ceil((VIEWPORT_WIDTH / this.props.staticTabWidth) / 2) + 1}
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

  _renderTab = ({data, _pageIndex}) => {
    return this.props.renderTab({data, _pageIndex})
  }

  _renderPage = (item) => {
    return this.props.renderPage(item)
  }

  render() { 
    return (
      <View style={styles.container}>
        {this._renderTabsContainer(TabbedPager.TABCONTAINER_POSITION.TOP)}
        <ViewPager
          ref={contentPager => {
            this.contentPager = contentPager
          }}
          renderAsCarousel={this.props.renderAsCarousel}
          lazyrender={this.props.lazyrender}
          data={this.props.data}
          containerStyle={styles.contentContainer}
          renderPage={this._renderPage}
          onPageChange={this._onPageChange}
          onScroll={this._onScroll}
          {...this._getContentProps()}
          thresholdPages={1}
          experimentalMirroring={this.props.experimentalMirroring}
        />
        {this._renderTabsContainer(TabbedPager.TABCONTAINER_POSITION.BOTTOM)}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  tabIndicator: {
    alignSelf: 'center',
  },
})

export default TabbedPager