import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native'


const VIEWPORT_WIDTH = Dimensions.get('window').width

class Page extends PureComponent {

  constructor(props) {
    super(props)
  }

  shouldComponentUpdate() {
    return true
  }

  render() {
    return (
      <View 
        stlye={styles.container}
      >
        <View style={{
          padding: 20,
        }}>
            <Text>{this.props.title}</Text>
            <Text
              style={{
                fontSize: 22,
              }}
            >Komplexe Beispielseite mit vielen Views</Text>
            <ScrollView>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 20,
              }}>
                <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
                <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
              </View>
              <Text>Das</Text>
              <Text>ist</Text>
              <Text>eine</Text>
              <Text>ScrollView</Text>
              <Text>Das</Text>
              <Text>ist</Text>
              <Text>eine</Text>
              <Text>ScrollView</Text>
              <Text>Das</Text>
              <Text>ist</Text>
              <Text>eine</Text>
              <Text>ScrollView</Text>
              <Text>Das</Text>
              <Text>ist</Text>
              <Text>eine</Text>
              <Text>ScrollView</Text>
              <Text>Das</Text>
              <Text>ist</Text>
              <Text>eine</Text>
              <Text>ScrollView</Text>
              <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'red'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'blue'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'green'}}/>
              <View style={{width: 50, height: 50, backgroundColor: 'purple'}}/>
            </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'red',
    overflow: 'hidden',
  }
})

export default Page