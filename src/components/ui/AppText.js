import { Text } from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";
class AppText extends Component {
    componentDidMount=()=>{
        
    }
  Loadtext() {
    if (this.props.fontLoaded && this.props.fontLoaded == true) {
      return (
        <Text
          numberOfLines={
            this.props.numberOfLines ? this.props.numberOfLines : null
          }
          ellipsizeMode={
            this.props.ellipsizeMode ? this.props.ellipsizeMode : null
          }
          style={[this.props.style]}
        >
          {this.props.children}
        </Text>
      );
    }
  }
  render() {
    return this.Loadtext();
  }
}
const mapStateToProps = state => ({
  fontLoaded: state.user.fontLoaded
});
export default connect(mapStateToProps, {})(AppText);
