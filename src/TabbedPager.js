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
        case 'renderRow':
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

  _renderTabbarRow = ({data, _pageIndex}) => {
    return this.props.renderTabbarRow({data, _pageIndex: _pageIndex - 1})
  }

  _getTabbarData = () => {
    return this.props.data.map(_data => {
      return {
        data: (_data[this.props.tabbarPropName]) ? _data[this.props.tabbarPropName] : '',
      }
    })
  }

  _onPageChange = pageNumber => {
    // this.tabbar.scrollToPage(pageNumber)
  }

  _onScroll = dx => {
    this.tabbar.scroll(dx)
  }

  _renderContentContainerRow = (item) => {
    return this.props.renderContentContainerRow(item)
  }

  render() {
    return (
      <View style={styles.container}>
        <ViewPager
          ref={tabbar => {
            this.tabbar = tabbar
          }}
          data={this.props.data}
          renderRow={this._renderTabbarRow}
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
          renderRow={this._renderContentContainerRow}
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

  renderContentContainerRow: React.PropTypes.func,
  renderTabbarRow: React.PropTypes.func,
})

export default TabbedPager