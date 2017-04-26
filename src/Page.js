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

  onIsPanning = isPanning => {
    if (typeof this.child.setNativeProps == 'function')
      this.child.setNativeProps(isPanning ? {
        shouldBeScrollable: false,
      } : {
        shouldBeScrollable: true,
      })
  }

  _renderChild = () => {

    const child = React.cloneElement(
      this.props.renderChild({
        data: this.props.childData, 
        shouldSwitchPage: this._souldSwitchPage,
      }),
      {
        ref: node => {
          this.child = node
        },
      }
    )

    return child
  }

  render() {
    return (
      <View
        style={styles.rowContainer}
      >
        {this._renderChild()}
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