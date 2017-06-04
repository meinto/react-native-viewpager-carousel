import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
} from 'react-native'

import ViewPager from './ViewPager'

const VIEWPORT_WIDTH = Dimensions.get('window').width

class TabbedPager extends PureComponent {

  static defaultProps = {
    tabbarPropName: 'title',
    data: [],
    onPageChange: () => {},
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

  _renderTab = ({data, _pageIndex}) => {
    return this.props.renderTab({data, _pageIndex})
  }

  _onPageChange = pageNumber => {
    this.props.onPageChange(pageNumber)
  }

  _onScroll = dx => {
    this.tabbar.scroll(dx)
  }

  _renderPage = (item) => {
    return this.props.renderPage(item)
  }

  render() { 
    return (
      <View style={styles.container}>
        <ViewPager
          ref={tabbar => {
            this.tabbar = tabbar
          }}
          data={this.props.data}
          renderPage={this._renderTab}
          pageWidth={VIEWPORT_WIDTH / 2}
          pagingEnabled={false}
          onShouldSwitchToPage={this.scrollToPage}
          disablePan={true}
          {...this._getContentProps()}
          thresholdPages={2}
          experimentalMirroring={false}
        />
        <ViewPager
          ref={contentPager => {
            this.contentPager = contentPager
          }}
          data={this.props.data}
          containerStyle={styles.contentContainer}
          renderPage={this._renderPage}
          onPageChange={this._onPageChange}
          onScroll={this._onScroll}
          {...this._getContentProps()}
          thresholdPages={1}
        />
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
})

TabbedPager.propTypes = Object.assign({}, ViewPager.propTypes, {
  data: React.PropTypes.arrayOf(
    React.PropTypes.object
  ),
  tabbarPropName: React.PropTypes.string,

  renderPage: React.PropTypes.func,
  renderTab: React.PropTypes.func,
  onPageChange: React.PropTypes.func,
})

export default TabbedPager