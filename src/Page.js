import React, { PureComponent } from 'react'
import { 
  View,
  StyleSheet,
} from 'react-native'

class Page extends PureComponent {

  constructor(props) {
    super(props)

    this.pageNumber = props.pageNumber
  }
  
  shouldComponentUpdate(nextProps) {

    this.pageNumber = nextProps.pageNumber

    return nextProps.shouldUpdate
  }

  _souldSwitchPage = () => {
    this.props.shoudSwitchPage(this.props.pageNumber)
  }

  render() {
    // console.warn('render')
    return (
      <View
        style={styles.rowContainer}
      >
        {this.props.renderChild(this.props.childData, this._souldSwitchPage)}
      </View>
    )
  }

}


const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
  },
})

Page.propTypes = {
  shouldUpdate: React.PropTypes.bool,
  children: React.PropTypes.any,
  childData: React.PropTypes.object,
  pageNumber: React.PropTypes.number,

  shoudSwitchPage: React.PropTypes.func,
  renderChild: React.PropTypes.func,
}

export default Page