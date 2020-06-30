import PropTypes from "prop-types";
import React, { Component } from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { FadeView } from "./index";
const propTypes = {
  renderView: PropTypes.func.isRequired,
  renderCollapseView: PropTypes.func.isRequired,
  collapse: PropTypes.bool,
  tension: PropTypes.number,
  animate: PropTypes.bool
};
const defaultProps = {
  collapse: false,
  tension: 10,
  animate: true
};

class CollapseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: this.props.collapse,
      animation: new Animated.Value(0),
      tension: this.props.tension,
      renderView: this.props.renderView,
      renderCollapseView: this.props.renderCollapseView,
      startpoint:null,
      endpoint:null
    };
  }
  componentWillReceiveProps = next_props => {
    this.setState({
      collapse: this.state.collapse,
      animation: new Animated.Value(0),
      tension: next_props.tension || this.state.tension,
      renderView: next_props.renderView || this.state.renderView,
      renderCollapseView:
        next_props.renderCollapseView || this.state.renderCollapseView
    });
  };

  collapse = () => {
    const { startpoint, endpoint, animation, collapse } = this.state;
    let startAnim = collapse ? endpoint + startpoint : startpoint;
    let endAnim = collapse ? startpoint : startpoint + endpoint;
    this.setState({
      prev_state: this.state.collapse,
      collapse: !this.state.collapse
    });

    animation.setValue(startAnim);
    Animated.spring(this.state.animation, {
      toValue: endAnim,
      tension: this.state.tension
    }).start();
  };

  startpoint = layout => {
    if (!this.state.collapse)
      this.setState({
        animation: new Animated.Value(layout.nativeEvent.layout.height)
      });
    this.setState({
      startpoint: layout.nativeEvent.layout.height
    });
  };

  endpoint = layout => {
    if (this.state.collapse)
      this.setState({
        animation: new Animated.Value(layout.nativeEvent.layout.height)
      });
    this.setState({
      endpoint: layout.nativeEvent.layout.height
    });
  };

  render() {
    const { startpoint, endpoint, animation, collapse } = this.state;
    return (
      <Animated.View
        style={[
          { backgroundColor: "transparent", overflow: "hidden" },
          !this.state.collapse &&
            this.props.animate &&
            this.state.startpoint &&
            this.state.endpoint && { height: this.state.animation }
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={async () => {
            await this.collapse();
            if (this.props.onPress) {
              this.props.onPress();
            }
          }}
          onLayout={this.startpoint}
        >
          {this.state.renderView(this.state.collapse)}
        </TouchableOpacity>
        {/* {(this.state.collapse || this.state.prev_state == true) && (
          <FadeView onLayout={this.endpoint}>
            {this.state.renderCollapseView(this.state.collapse)}
          </FadeView>
        )} */}
        {this.state.collapse && (
          /* <FadeView animate={this.state.collapse} onLayout={this.endpoint}> */
          <FadeView onLayout={this.endpoint}>
            {this.props.renderCollapseView(this.state.collapse)}
          </FadeView>
        )}
      </Animated.View>
    );
  }
}

CollapseView.propTypes = propTypes;
CollapseView.defaultProps = defaultProps;
export default CollapseView;
