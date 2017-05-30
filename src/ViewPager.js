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
    experimentalMirroring: false,
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
    
    const multiplicator = Math.ceil(this.props.thresholdPages / data.length)

    let thresholdDataFront = []
    let thresholdDataEnd = []

    for (let i = 0; i < multiplicator; i++) {
      thresholdDataFront = [...thresholdDataFront, ...[...data].reverse()]
      thresholdDataEnd = [...thresholdDataEnd, ...data]
    }

    const thresholdFront = thresholdDataFront.slice(0, this.props.thresholdPages).reverse()

    const thresholdEnd = thresholdDataEnd.slice(0, this.props.thresholdPages)

    const preparedData = [...thresholdFront, ...data, ...thresholdEnd]

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

    this.pageIndex = Math.ceil((offsetX / VIEWPORT_WIDTH) * 100) / 100

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

  _renderRow = ({item, index}) => {

    let row = (
      <View 
        key={index}
        style={[styles.rowContainer, {
          width: this.props.pageWidth,
        }]}
      >
        {this.props.renderRow({data: item})}
      </View>
    )

    if (this.props.experimentalMirroring === true) {
      if (index <= this.props.thresholdPages) {
        row = (
          <Mirror
            key={index}
            connectionId={'mirror-' + index}
            containerStyle={styles.mirror}
            mirroredProps={[
              scrollviewBootstrap,
            ]}
          >
            {row}
          </Mirror>
        )
      }

      if (index >= this.state.dataSource.length - this.props.thresholdPages - 1) {
        const idIndex = index - (this.state.dataSource.length - this.props.thresholdPages - 1)
        row = (
          <Mirror
            key={index}
            connectionId={'mirror-' + idIndex}
            containerStyle={styles.mirror}
            mirroredProps={[
              scrollviewBootstrap,
            ]}
          >
            {row}
          </Mirror>
        )
      }
    }

    return row
  }

  render() {
    this.pages = []
    return (
      <View style={this.props.containerStyle}>
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

          {this.state.dataSource.map((item, index) => {
            return this._renderRow({item, index})
          })}
        </ScrollView>
      </View>
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
    flexGrow: 1,
  },
  mirror: {
    flexGrow: 1,
  },
})


ViewPager.propTypes = {
  contentContainerStyle: React.PropTypes.any,
  containerStyle: React.PropTypes.any,
  data: React.PropTypes.arrayOf(
    React.PropTypes.object
  ),
  thresholdPages: React.PropTypes.number,
  pageWidth: React.PropTypes.number,
  disablePan: React.PropTypes.bool,
  pagingEnabled: React.PropTypes.bool,
  experimentalMirroring: React.PropTypes.bool,

  renderRow: React.PropTypes.func,
  onPageChange: React.PropTypes.func,
  onPan: React.PropTypes.func,
  onShouldSwitchToPage: React.PropTypes.func,
  onScroll: React.PropTypes.func,
}


export default ViewPager