# React Native Viewpager Carousel

[![npm version](https://badge.fury.io/js/react-native-viewpager-carousel.svg)](https://badge.fury.io/js/react-native-viewpager-carousel)
[![dependencie status](https://david-dm.org/tobiasMeinhardt/react-native-viewpager-carousel.svg)](https://david-dm.org/tobiasMeinhardt/react-native-viewpager-carousel)
[![dev-dependency status](https://david-dm.org/tobiasMeinhardt/react-native-viewpager-carousel/dev-status.svg)](https://david-dm.org/tobiasMeinhardt/react-native-viewpager-carousel?type=dev)



## Installation

```
yarn add react-native-viewpager-carousel
```
or 
```
npm install --save react-native-viewpager-carousel
```

## Preview

![preview](http://i.imgur.com/tJ7Xr5n.gif)

## Getting started

```
export default class ExampleComponent extends Component {

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
```