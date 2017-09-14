import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  //FlatList,
  TouchableHighlight,
  ScrollView,
} from 'react-native'


class ExamplePage extends PureComponent {

  setNativeProps(props) {
    this.list.setNativeProps({
      scrollEnabled: props.shouldBeScrollable,
    })
  }

  _renderRow = ({index}) => {
    return (
      <TouchableHighlight
        key={index}
        underlayColor={'#ccc'}
        onPress={() => {}}
      >
        <View>
          <View style={styles.rowContainer}>
            <Image
              style={styles.image}
              source={{
                uri: IMAGES[this.props.index],
              }}
            />
            <Text>{`Cat - ${index}`}</Text>
          </View>
          <View style={styles.seperator}/>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.title}</Text>
        <View style={styles.seperator}/>
        {/*<FlatList
          ref={node => {
            this.list = node
          }}
          data={ROWS}
          renderItem={this._renderRow}
          keyExtractor={(item, index) => {
            return index
          }}
          onEndReachedThreshold={100}
        />*/}
        <ScrollView
          ref={node => {
            this.list = node
          }}
        >
          {ROWS.map((_row, index) => {
            return this._renderRow({index})
          })}
        </ScrollView>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  seperator: {
    height: 1,
    backgroundColor: '#ccc',
  },
  text: {
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 50,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
})


ExamplePage.propTypes = {
  title: React.PropTypes.string,
}

export default ExamplePage

const IMAGES = [
  'https://images.pexels.com/photos/8923/pexels-photo.jpg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/54632/cat-animal-eyes-grey-54632.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/4602/jumping-cute-playing-animals.jpg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/137049/pexels-photo-137049.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/66292/cat-eyes-view-face-66292.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/8923/pexels-photo.jpg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/54632/cat-animal-eyes-grey-54632.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/4602/jumping-cute-playing-animals.jpg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/137049/pexels-photo-137049.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/66292/cat-eyes-view-face-66292.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/8923/pexels-photo.jpg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/54632/cat-animal-eyes-grey-54632.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/4602/jumping-cute-playing-animals.jpg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/137049/pexels-photo-137049.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/66292/cat-eyes-view-face-66292.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/8923/pexels-photo.jpg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/54632/cat-animal-eyes-grey-54632.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/4602/jumping-cute-playing-animals.jpg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/137049/pexels-photo-137049.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/66292/cat-eyes-view-face-66292.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/8923/pexels-photo.jpg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/54632/cat-animal-eyes-grey-54632.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/4602/jumping-cute-playing-animals.jpg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/137049/pexels-photo-137049.jpeg?w=100&h=100&fit=crop&auto=compress',
  'https://images.pexels.com/photos/66292/cat-eyes-view-face-66292.jpeg?w=100&h=100&fit=crop&auto=compress',
]

const ROWS = [{},{},{},{},{},{},{},{},{},{}] // eslint-disable-line