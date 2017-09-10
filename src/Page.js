import React, { PureComponent } from 'react'
import { 
  View,
  Dimensions,
} from 'react-native'
import PropTypes from 'prop-types'


const VIEWPORT_WIDTH = Dimensions.get('window').width

export default class Page extends PureComponent {

  static propTypes = {
    children: PropTypes.any,
    lazyrender: PropTypes.bool,
    pageNumber: PropTypes.number,
    pageWidth: PropTypes.number,
    dev: PropTypes.bool,
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
    const borderWidth = this.props.dev ? 1 : 0
    return (
      <View
        style={{
          width: this.props.pageWidth,
          borderWidth,
        }}
      >
        {this.state.render && this.props.children}
      </View>
    )
  }
}
