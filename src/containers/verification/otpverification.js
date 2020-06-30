import React, { useState } from "react";
import {
  Keyboard,
  Easing,
  StyleSheet,
  Animated,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ImageBackground,
  TextInput,
  AsyncStorage,
  TouchableHighlight,
  Share,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import * as _ from "lodash";

import { AppText, Loader, FadeView, AppAlert } from "../../components/ui";
import { connect } from "react-redux";
import { Video } from "expo-av";
import Constants from "expo-constants";

//styles
import { AppColors, AppFonts, AppSizes } from "../../theme/index";
import { Actions } from "react-native-router-flux";
import { Ionicons } from "@expo/vector-icons";
import * as ReadSms from "react-native-read-sms/ReadSms";
import * as UserActions from "../../redux/user/actions";

const mapStateToProps = (state) => ({
  user_data: state.user.user_data,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  verifyOtp: UserActions.verifyOtp,
  searchProfile: UserActions.searchProfile,
  updateUserInfo: UserActions.updateUserInfo,
};
const LOGGER_TAG = "OtpVerification";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const marginAnim = new Animated.Value(SCREEN_WIDTH * 2);
class OtpVerification extends React.Component {
  constructor(props) {
    super(props);
    setInterval(() => {
      Animated.timing(marginAnim, {
        toValue: 0,
        duration: 600,
      }).start();
    }, 700);

    this.verifyprofile_call_invoked = false;
    this.state = {
      screenWidth: AppSizes.screen.width,
      screenHeight: AppSizes.screen.height,
      loading: false,
      loading_message: "",
      keyboardHeight: 0,
      otp: {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
      },
    };
  }

  componentDidMount = async () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  };
  componentWillUnmount = () => {
    this.keyboardDidShowListener.remove();
  };
  _keyboardDidHide = (e) => {
    this.setState({
      keyboardHeight: 0,
    });
  };
  _keyboardDidShow = (e) => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
    });
  };
  onLayout = async (e) => {
    this.setState({
      screenWidth: e.nativeEvent.layout.width,
      screenHeight: e.nativeEvent.layout.height,
    });
  };

  ///////////////////////// operations ////////////////////////////
  verifyProfile = async () => {
    var otp = this.state.otp || {};
    var otp_fields = _.keys(otp);
    var otp_string = "";
    var is_otp_entered = true;

    otp_fields.forEach((v) => {
      otp_string += otp[v];
      if (otp[v].length == 0) {
        is_otp_entered = false;
      }
    });

    if (!is_otp_entered) {
      AppAlert({
        message: "Enter OTP",
      });
      return;
    }

    if (this.verifyprofile_call_invoked == false) {
      this.verifyprofile_call_invoked = true;
      this.setState({
        loading: true,
        loading_message: "Verifying",
      });
      try {
        var post_data = {
          Item: {
            otp: otp_string,
            contactno: this.props.contactno,
          },
        };

        var resp = await this.props.verifyOtp(post_data);

        if (resp.data.length != 0) {
          Actions.UserRegistration({ userdata: resp.data[0], navigateid: 1 });
        }else{
          AppAlert({
            message:"Otp is invalid"
          })
        }
      } catch (error) {
        console.log("OtpVerification : error : ", error);

        if (_.get(error, "data.error_description", null) != null) {
          AppAlert({
            message: error.data.error_description,
          });
        } else if (_.get(error, "message", null) != null) {
          AppAlert({
            message: error.message,
          });
        }
      }

      this.verifyprofile_call_invoked = false;
      this.setState({
        loading: false,
        loading_message: "",
      });
    }
  };
  ///////////////////////// UI METHODS ////////////////////////////

  renderHeader = () => {
    var title = "Verification Code";
    var description =
      "OTP has been sent to " + _.get(this.props, "contactno", "");
    return (
      <View>
        <View style={[styles.header_container_1]}>
          <AppText style={[styles.header_text_3]}>
            Online
            <AppText style={[styles.header_text_4]}>Market</AppText>
          </AppText>
        </View>
        <AppText style={[styles.header_text_1]}>{title}</AppText>
        <AppText style={[styles.header_text_2]}>{description}</AppText>
      </View>
    );
  };
  renderForm = () => {
    var otp = this.state.otp || {};
    var otp_fields = _.keys(otp);

    return (
      <View>
        <View style={[styles.form_container_1]}>
          {otp_fields.map((v, k) => {
            return (
              <View style={[styles.form_container_2]}>
                <TextInput
                  // multiline={true}
                  keyboardType="number-pad"
                  ref={"otp_field_" + v}
                  style={[styles.form_textinput_1]}
                  placeholder={""}
                  onFocus={() => {
                    otp[v] = "";
                    this.setState({
                      otp: { ...otp },
                    });
                  }}
                  value={this.state.otp[v]}
                  onChangeText={(text) => {
                    otp[v] = text.split("").pop();
                    this.setState({
                      otp: { ...otp },
                    });
                    if (k < otp_fields.length - 1)
                      this.refs["otp_field_" + otp_fields[k + 1]].focus();
                  }}
                />
              </View>
            );
          })}
        </View>
        <TouchableOpacity
          onPress={this.verifyProfile}
          style={[styles.form_container_3]}
        >
          <AppText style={[styles.form_text_1]}>Login</AppText>
          <Ionicons
            name="ios-arrow-dropright-circle"
            size={20}
            color={AppColors.primary}
          />
        </TouchableOpacity>
        {/* <Animated.View style={{ marginLeft: marginAnim }}>
          <Image
            style={{ height: 250, width: 250, alignSelf: "center" ,marginLeft:30}}
            source={require("../../../assets/trolly-png.png")}
          ></Image>
        </Animated.View> */}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Video
            source={require("../../../assets/video/logovideo.mp4")}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            // isLooping
            style={{ width: 300, height: 300 }}
          />
        </View>
      </View>
    );
  };
  render() {
    var current_screen_width = this.state.screenWidth;
    var current_screen_height = this.state.screenHeight;
    var is_portrait = this.state.screenWidth < this.state.screenHeight;
    return (
      <Animated.View onLayout={this.onLayout} style={[styles.container_1]}>
        <Loader
          // message={this.state.loading_message}
          visible={this.state.loading}
        />
        <ScrollView>
          {this.renderHeader()}
          {this.renderForm()}
        </ScrollView>
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  container_1: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingTop: Constants.statusBarHeight,
  },
  backdrop_container_1: { opacity: 0.2, position: "absolute" },
  header_container_1: {
    marginTop: 60,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  header_text_1: {
    ...AppFonts.h1_bold,
    color: AppColors.primary,
    textAlign: "center",
  },
  header_text_2: {
    ...AppFonts.h3,
    color: AppColors.secondary,
    textAlign: "center",
    marginTop: 10,
    marginHorizontal: 20,
  },
  header_text_3: {
    ...AppFonts.jumbotron_1,
    color: AppColors.secondary,
  },
  header_text_4: {
    ...AppFonts.jumbotron_1,
    color: AppColors.primary,
  },
  form_container_1: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 20,
    justifyContent: "center",
  },
  form_container_2: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: AppColors.grey80,
    marginHorizontal: 5,
    backgroundColor: AppColors.white,
  },
  form_textinput_1: {
    ...AppFonts.h2,
    color: AppColors.primary,
    textAlign: "center",
  },
  form_container_3: {
    flexDirection: "row",
    marginVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  form_text_1: {
    ...AppFonts.h1_bold,
    color: AppColors.primary,
    marginRight: 10,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(OtpVerification);
