# React Native Viewpager Carousel

[![npm version](https://badge.fury.io/js/react-native-viewpager-carousel.svg)](https://badge.fury.io/js/react-native-viewpager-carousel)
[![dependencie status](https://david-dm.org/tobiasMeinhardt/react-native-viewpager-carousel.svg)](https://david-dm.org/tobiasMeinhardt/react-native-viewpager-carousel)
[![dev-dependency status](https://david-dm.org/tobiasMeinhardt/react-native-viewpager-carousel/dev-status.svg)](https://david-dm.org/tobiasMeinhardt/react-native-viewpager-carousel?type=dev)
[![npm](https://img.shields.io/npm/dm/react-native-viewpager-carousel.svg)](https://www.npmjs.com/package/react-native-viewpager-carousel)
[![npm](https://img.shields.io/npm/dt/react-native-viewpager-carousel.svg)](https://www.npmjs.com/package/react-native-viewpager-carousel)



## Installation

```
yarn add react-native-viewpager-carousel
```
or 
```
npm install --save react-native-viewpager-carousel
```

## Preview

![preview](http://i.imgur.com/urCJ6XR.gif)

## ViewPager

The ```<ViewPager />``` is the base component of the library. Till now it acts like a simple view-carousel:

```javascript
import { ViewPager } from 'react-native-viewpager-carousel'

class ExampleCarousel extends PureComponent {

    constructor() {
        this.data = [
            { title: 'title 1' },
            { title: 'title 2' },
            { title: 'title 3' },
        ]
    }
    
    _renderPage = ({data}) => {
        return ( <Text>{item.title}</Text> )
    }

    render() {
        <ViewPager
            data={this.data}
            renderPage={this._renderPage}
        />
    }
}

```

### API

| prop name             | data type | default | functionality |
| --------------------- | --------- | ------- | ------------- |
| containerStyle        | style     | {}      | the component is wrapped into a ```<View />```. Styles to this ```<View />``` can be assigned through this property |
| contentContainerStyle | style     | {}      | posibility to set styles to the content container (the entire scrollable area) |
| data                  | array     | []      | a data array of objects |
| thresholdPages        | number    | 1       | number of pages left and right of the scrollable content (sneak preview) |
| pageWidth             | number    | {{screen width of device}} | width of page |
| scrollEnabled         | boolean   | true    | decleares wether the ViewPager sould be able to scroll by user or not |
| pageingEnabled        | boolean   | true    |  |
| experimentalMirroring | boolean   | false   | toggles the mirroring of the scrollposition of the threshold views - more information [here](https://github.com/tobiasMeinhardt/react-native-mirror) |
| showNativeScrollIndicator | boolean | false | native ScrollView indicator is disabled by default |
| renderPage            | function | () => {} | render callback for content page |
| onPageChange          | function | () => {} | callback when the page changes -> retuns the current pageNumber as first argument |
| onScroll              | function | () => {} | callback when the content area scrolls |

## TabbedPager

In addition to the ```<ViewPager />``` the ```<TabbedPager />``` component provides an additional renderFunction for Tabs above the content view. The following pseudo-code shows the basic usage with an ```<Image />``` as content and a ```<Text />``` as tab.

```javascript
import { TabbedPager } from 'react-native-viewpager-carousel'

class ExampleCarousel extends PureComponent {

    constructor() {
        this.data = [
            { title: 'title 1', url: 'http://...' },
            { title: 'title 2', url: 'http://...' },
            { title: 'title 3', url: 'http://...' },
        ]
    }
    
    _renderTab = ({data}) => {
        return ( <Text>{data.title}</Text> )
    }
    
    _renderPage = ({data}) => {
        return ( <Image source={{uri: data.url}} /> )
    }

    render() {
        <ViewPager
            data={this.data}
            renderTab={this._renderTab}
            renderPage={this._renderPage}
        />
    }
}
```

### API

| prop name             | data type | default       | functionality |
| --------------------- | --------- | ------------- | ------------- |
| data                  | array     | []            | a data array of objects |
| lazyrender            | boolean   | false         | lazyrender renders the active page only when its in the viewport |
| showTabIndicator      | boolean   | true          | toggles the tab indicator |
| tabIndicatorColor     | string    | 'transparent' | changes the color of the tab indicator |
| tabIndicatorHeight    | number    | 2             | height of tab indicator |
| renderPage            | function  | () => {}      | render callback for content page |
| renderTab             | function  | () => {}      | render callback for the tab |
| onPageChange          | function  | () => {}      | callback when the page changes -> retuns the current pageNumber as first argument |
| experimentalMirroring | boolean   | false         | toggles the mirroring of the scrollposition of the threshold views - more information [here](https://github.com/tobiasMeinhardt/react-native-mirror) |