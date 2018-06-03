import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'

const COLORS = [
  '#FF5722',
  '#FF9800',
  '#FFC107',
  '#FFEB3B',
  '#CDDC39',
  '#8BC34A',
  '#4CAF50',
  '#009688',
  '#00BCD4',
  '#03A9F4',
  '#2196F3',
]

export default class ExamplePage extends PureComponent {
  render() {
    return (
      <View style={[styles.container, {backgroundColor: COLORS[this.props.index - 1]}]}>
        <Text style={styles.text}>{this.props.title}</Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    padding: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
})