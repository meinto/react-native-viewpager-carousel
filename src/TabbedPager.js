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

  scrollToPage = pageNumber => {
    this.contentPager.scrollToPage(pageNumber)
  }

  _getTabbarData = () => {
    return this.props.data.map(_data => {
      return {
        data: (_data[this.props.tabbarPropName]) ? _data[this.props.tabbarPropName] : '',
      }
    })
  }

  _onContentPageChange = pageNumber => {
    this.tabbar.scrollToPage(pageNumber)
  }

  _onContentPan = dx => {
    this.tabbar.panRelative(dx, VIEWPORT_WIDTH / (VIEWPORT_WIDTH / 2))
  }

  _renderTabbarRow = (item) => {
    return this.props.renderTabbarRow(item)
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
          data={this._getTabbarData()}
          renderRow={this._renderTabbarRow}
          pageWidth={VIEWPORT_WIDTH / 2}
          disablePan={true}
        />
        <ViewPager
          ref={contentPager => {
            this.contentPager = contentPager
          }}
          data={this.props.data}
          contentContainerStyle={styles.contentContainer}
          renderRow={this._renderContentContainerRow}
          onPageChange={this._onContentPageChange}
          onPan={this._onContentPan}
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
  }
})

export default TabbedPager