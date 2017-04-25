/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'

import {TabbedPager} from 'react-native-viewpager-carousel'
import Page from './Page'


export default class rnViewPager extends Component {

  constructor(props) {
    super(props)

    this.dataSource = []

    for (const i = 0; i < 100; i++) {
      this.dataSource = [...this.dataSource, {
        title: 'Title Seite ' + i
      }]
    }
  }

  _handleTouch = (pageNumber) => {
    this.tabbarPager.scrollToPage(pageNumber)
  }

  _renderTabbarRow = item => (
    <TouchableHighlight
      key={'tb' + item.key}
      onPress={() => {
        this._handleTouch(item.pageNumber)
      }}
    >
      <Text style={styles.text}>{item.data}</Text>
    </TouchableHighlight>
  )

  _renderContentContainerRow = item => (
    <View style={styles.contentContainer}>
      <Text>{item.title}</Text>
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        <TabbedPager
          ref={tabbarPager => {
            this.tabbarPager = tabbarPager
          }}

          data={this.dataSource}
          renderTabbarRow={this._renderTabbarRow}
          renderContentContainerRow={this._renderContentContainerRow}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
    margin: 10,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eee',
  }
})

AppRegistry.registerComponent('tabbedPagerCarousel', () => rnViewPager);
