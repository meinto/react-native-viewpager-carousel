import React, { PureComponent } from 'react'
import { 
  View,
  Dimensions,
} from 'react-native'


const VIEWPORT_WIDTH = Dimensions.get('window').width

export default class Page extends PureComponent {

  static propTypes = {
    children: React.PropTypes.any,
    lazyload: React.PropTypes.bool,
    pageNumber: React.PropTypes.number,
    pageWidth: React.PropTypes.number,
  }

  static defaultProps = {
    children: null,
    lazyload: false,
    pageNumber: 0,
    pageWidth: VIEWPORT_WIDTH,
  }

  constructor(props) {
    super(props)

    this.state = {
      render: !this.props.lazyload || (this.props.lazyload && this.props.pageNumber === 1),
    }
  }

  onPageChange = (pageNumber) => {
    if (
      this.props.lazyload === true && 
      pageNumber === this.props.pageNumber &&
      this.state.render === false
    ) {
      this.setState({
        render: true,
      })
    }
  }

  render() {
    return (
      <View
        style={{
          width: this.props.pageWidth,
        }}
      >
        {this.state.render && this.props.children}
      </View>
    )
  }
}
