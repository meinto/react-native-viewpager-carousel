import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
} from 'react-native'
import Mirror, { scrollviewBootstrap } from 'react-native-mirror'


const VIEWPORT_WIDTH = Dimensions.get('window').width

class ViewPager extends PureComponent {

  static defaultProps = {
    thresholdPages: 1,
    pageWidth: VIEWPORT_WIDTH,
    pagingEnabled: true,
    contentContainerStyle: {},
    renderRow: () => {},
    onPan: () => {},
    onPageChange: () => {},
    onScroll: () => {},
    disablePan: false,
    data: [],
  }

  constructor(props) {
    super(props)

    const initializedData = this._initializeData(this.props.data || [])

    this._pageWithDelta = (VIEWPORT_WIDTH - this.props.pageWidth) / 2

    this.pages = []

    this.state = {
      initializedData,
      dataSource: [...this._prepareData(initializedData)],
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.scrollView.scrollTo({
        x: (VIEWPORT_WIDTH - this._pageWithDelta) * this.props.thresholdPages,
        animated: false,
      })
    }, 0)
  }

  _initializeData = (data) => {
    return data.map((_data, index) => {
      return Object.assign({}, _data, { index })
    })
  }

  _prepareData = (data) => {
    let preparedData = []
    for (let i = (data.length - 1); i > (data.length - 1) - this.props.thresholdPages; i--) {
      preparedData = [data[i], ...preparedData]
    }

    preparedData = [...preparedData, ...data]

    for (let i = 0; i < this.props.thresholdPages; i++) {
      preparedData = [...preparedData, data[i]]
    }

    return [...preparedData]
  }

  _getPageNumberByIndex = index => {
    if (index === 0) return this.state.dataSource.length - 1
    if (index === this.state.dataSource.length - 1) return 1
    return index
  }

  _onScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x
    this.props.onScroll(offsetX)

    this.pageIndex = offsetX / VIEWPORT_WIDTH

    if (this.pageIndex % 1 === 0) {
      if (this.pageIndex === 0) {

        this.scrollView.scrollTo({
          animated: false, 
          x: VIEWPORT_WIDTH * (this.state.dataSource.length - 2),
        })

      } else if (this.pageIndex === this.state.dataSource.length - 1) {

        this.scrollView.scrollTo({
          animated: false, 
          x: VIEWPORT_WIDTH,
        })

      } else {

        const pageNumber = this._getPageNumberByIndex(this.pageIndex)
        this.props.onPageChange(pageNumber)

      }
    }
  }

  scroll = dx => {
    this.scrollView.scrollTo({
      animated: false, 
      x: dx / (VIEWPORT_WIDTH / (VIEWPORT_WIDTH / 2)) - this.props.pageWidth / 2 + (VIEWPORT_WIDTH / this.props.thresholdPages),
    })
  }

  scrollToPage = pageNumber => {
    this.scrollView.scrollTo({
      animated: true, 
      x: (pageNumber + this.props.thresholdPages) * VIEWPORT_WIDTH,
    })
  }

  _renderRow = ({item}) => {
    return (
      <View style={{flex: 1}}>
        {this.props.renderRow({data: item})}
      </View>
    )
  }

  render() {
    this.pages = []
    return (
      <ScrollView
        ref={(scrollView) => {
          this.scrollView = scrollView
        }}
        horizontal={true}
        pagingEnabled={this.props.pagingEnabled}
        onScroll={this._onScroll}
        contentContainerStyle={[styles.container, this.props.contentContainerStyle, {
          width: this.props.pageWidth * this.state.dataSource.length,
        }]}>

        {this.state.dataSource.map((item) => {
          return this._renderRow({item})
        })}
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    /*
     * bug in react-native
     * overflow style has to be set
     * https://github.com/facebook/react-native/issues/12926
     */
    overflow: 'scroll',
  },
  rowContainer: {
    flex: 1,
  },
})


ViewPager.propTypes = {
  contentContainerStyle: React.PropTypes.any,
  data: React.PropTypes.arrayOf(
    React.PropTypes.object
  ),
  thresholdPages: React.PropTypes.number,
  pageWidth: React.PropTypes.number,
  disablePan: React.PropTypes.bool,
  pagingEnabled: React.PropTypes.bool,

  renderRow: React.PropTypes.func,
  onPageChange: React.PropTypes.func,
  onPan: React.PropTypes.func,
  onShouldSwitchToPage: React.PropTypes.func,
  onScroll: React.PropTypes.func,
}


export default ViewPager