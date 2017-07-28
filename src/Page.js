import React, { PureComponent } from 'react'
import { 
  View,
  Dimensions,
} from 'react-native'


const VIEWPORT_WIDTH = Dimensions.get('window').width

export default class Page extends PureComponent {

  static propTypes = {
    children: React.PropTypes.any,
    lazyrender: React.PropTypes.bool,
    pageNumber: React.PropTypes.number,
    pageWidth: React.PropTypes.number,
    dev: React.PropTypes.bool,
  }

  static defaultProps = {
    dev: false,
    children: null,
    lazyrender: false,
    pageNumber: 0,
    pageWidth: VIEWPORT_WIDTH,
  }

  constructor(props) {
    super(props)

    this.state = {
      render: !this.props.lazyrender || (this.props.lazyrender && this.props.pageNumber === 1),
    }
  }

  onPageChange = (pageNumber) => {
    if (
      this.props.lazyrender === true && 
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
          borderWidth: this.props.dev ? 1 : 0
        }}
      >
        {this.state.render && this.props.children}
      </View>
    )
  }
}
