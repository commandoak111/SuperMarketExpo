import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Vibration,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import { AppColors, AppSizes, AppFonts } from "../../theme/index";
import AppText from "./AppText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      screenWidth: 0,
      screenHeight: 0,
    };
  }
  componentDidMount = (props) => {
    this.setState({
      visible: this.props.visible,
    });
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      visible: nextProps.visible,
    });
  };
  componentWillUnmount = () => {
    this.setState({
      visible: false,
    });
  };
  onLayout = async (e) => {
    this.setState({
      screenWidth: e.nativeEvent.layout.width,
      screenHeight: e.nativeEvent.layout.height,
    });
  };
  hideModal = () => {
    this.setState({ visible: false });
  };
  render() {
    var message = this.props.message;
    return (
      <Modal
        // animationIn="fadeIn"
        // animationOut="fadeOut"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => {
          this.setState({ visible: false });
        }}
      >
        <View
          onLayout={this.onLayout}
          // onPress={this.hideModal}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(52, 52, 52, 0.5)",
          }}
        >
          {message && (
            <AppText
              style={[
                AppFonts.h2_bold,
                {
                  textAlign: "center",
                  color: AppColors.secondary,
                  padding: 10,
                },
              ]}
            >
              {message}
            </AppText>
          )}
          {/* <ActivityIndicator size="large" color={AppColors.secondary} /> */}
          <View
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: AppColors.white,
              borderWidth: 2,
              borderColor: AppColors.secondary,
              padding: 22,
              overflow: "hidden",
            }}
          >
            <Image
              style={{ height: 50, width: 50 }}
              source={require("../../../assets/loaderimage.gif")}
            ></Image>
          </View>
          <AppText
            style={[
              AppFonts.h5_bold,
              { marginVertical: 8, color: AppColors.secondary },
            ]}
          >
            loading...
          </AppText>
        </View>
      </Modal>
    );
  }
}
const opacity = "rgba(0, 0, 0, .6)";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
