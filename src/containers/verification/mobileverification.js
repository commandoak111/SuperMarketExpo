import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  AsyncStorage,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";
import Constants from "expo-constants";
import { AppColors, AppFonts } from "../../theme";
import * as _ from "lodash";
import { Video } from "expo-av";
import { AppText, Loader, AppAlert } from "../../components/ui";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
} from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import * as UserActions from "../../redux/user/actions";
import { Actions } from "react-native-router-flux";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { config } from "../../constants";

TAG = "SuperMarket Home ";

const mapStateToProps = (state) => ({
  user_location_data: state.user.user_location_data,
  user_basket: state.user.user_basket,
  user_market_basket: state.user.user_market_basket,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  getOtp: UserActions.getOtp,
  fontLoader: UserActions.fontLoader,
  getProducts: UserActions.getProducts,
  updateUserLocation: UserActions.updateUserLocation,
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const marginAnim = new Animated.Value(SCREEN_WIDTH * 2);
const rotateAnim = new Animated.Value(0);
const marginAnimEnd = new Animated.Value(0);
class Home extends React.Component {
  constructor(props) {
    super(props);
    setInterval(() => {
      Animated.timing(marginAnim, {
        toValue: 0,
        duration: 600,
      }).start();
    }, 700);
    Animated.timing(rotateAnim, {
      toValue: 180,
      duration: 1200,
    }).start();
    this.verifymobile_call_invoked = false;

    this.state = {
      loading: false,
      mobile: "",
    };
  }
  componentDidMount = async () => {
    this.getData();
  };

  getData = async () => {
    await this.setState({ loading: true });
    var captchaGuid = this.createUUID();
    var captchSrc = config.host_name + "file/Captcha/" + captchaGuid;
    console.log(
      "mobile verfication  :  getdata  :  capcha",
      captchaGuid,
      captchSrc
    );

    this.setState({ captchaGuid, captchSrc, loading: false });
  };
  createUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  keyExtractor = (item, index) => index.toString();
  onLayout = async (e) => {
    this.setState({
      screenWidth: e.nativeEvent.layout.width,
      screenHeight: e.nativeEvent.layout.height,
    });
  };
  renderHeader = () => {
    var title = "Phone Verification";
    var description =
      "We need to register your phone before gettting started !";
    return (
      <View>
        <View style={[styles.header_container_1]}>
          <AppText style={[styles.header_text_3]}>
            Online
            <AppText style={[styles.header_text_4]}>Market</AppText>
          </AppText>
        </View>
        <AppText style={[styles.header_text_1, { color: AppColors.primary }]}>
          {title}
        </AppText>
        <AppText style={[styles.header_text_2]}>{description}</AppText>
      </View>
    );
  };
  renderForm = () => {
    return (
      <View>
        <View
          style={{
            elevation: 0,
            borderWidth: 0,
            margin: 0,
            paddingVertical: 10,
            marginHorizontal: 15,
          }}
        >
          <View style={[styles.form_container_1]}>
            <Ionicons name="md-call" size={20} color={AppColors.primary} />
            <TextInput
              // multiline={true}
              style={[styles.form_textinput_1]}
              placeholder={"Phone"}
              value={this.state.mobile}
              keyboardType={"number-pad"}
              onChangeText={(v) => {
                this.setState({
                  mobile: v,
                });
              }}
              onSubmitEditing={() => {
                if (this.state.mobile.length != 10) {
                  AppAlert({ message: "Enter valid number" });
                } else {
                  this.refs.captcha.focus();
                }
              }}
            />
          </View>
          {this.state.captchSrc && (
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                alignItems: "center",
                marginHorizontal: 30,
                marginVertical: 20,
              }}
            >
              <Image
                style={{
                  height: 30,
                  flex: 0.5,
                  borderWidth: 0.3,
                  borderColor: AppColors.primary,
                  marginHorizontal: 10,
                }}
                source={{ uri: this.state.captchSrc }}
              ></Image>
              <TextInput
                ref={"captcha"}
                value={this.state.textinput_captcha}
                placeholder={"Enter capcha"}
                style={{
                  height: 30,
                  flex: 0.5,
                  borderWidth: 0.5,
                  paddingLeft: 10,
                  backgroundColor: AppColors.primary_tint_2,
                  ...AppFonts.h3,
                  marginHorizontal: 10,
                }}
                onChangeText={(text) => {
                  this.setState({ textinput_captcha: text });
                }}
                onSubmitEditing={() => {
                  this.verifyProfile();
                }}
              ></TextInput>
            </View>
          )}
          <TouchableOpacity
            onPress={this.verifyProfile}
            style={[styles.form_container_2]}
          >
            <AppText style={[styles.form_text_1]}>Verify</AppText>
            <Ionicons
              name="ios-arrow-dropright-circle"
              size={20}
              color={AppColors.primary}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            elevation: 3,
            borderWidth: 0,
            marginHorizontal: 15,
            marginBottom: 5,
            paddingTop: 8,
          }}
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
  verifyProfile = async () => {
    if (this.state.mobile.trim().length == 0) {
      AppAlert({
        message: "Enter Mobile No.",
      });
      return;
    }
    if (!this.state.textinput_captcha) {
      AppAlert({
        message: "Enter Capcha",
      });
      return;
    }

    if (this.verifymobile_call_invoked == false) {
      this.verifymobile_call_invoked = true;
      this.setState({
        loading: true,
        // loading_message: "Verifying",
      });
      try {
        var post_data = {
          Item: {
            contactno: this.state.mobile,
            otp: "",
            otpsent: false,
            captchGUID: this.state.captchaGuid,
            captchsrc: "file/Captcha/" + this.state.captchaGuid,
            captcha: this.state.textinput_captcha,
          },
          securitytoken: "String content",
        };
        var resp = await this.props.getOtp(post_data);
        if (resp && resp.data) {
          var issmssent = _.get(resp.data, "issmssent", null);
          var contactno = _.get(resp.data, "contactno", "");
          if (issmssent != false && contactno != null) {
            Actions.OtpVerification({ contactno: this.state.mobile });
            // Actions.OtpVerification({ id: profile_id, contactno });
            // AppAlert({ message: "otp send successully" });
            //   }
          } else {
            this.setState({ textinput_captcha: null });
            AppAlert({ message: "Please enter correct capcha" });
            this.getData();
          }
          //  else {
          // 	AppAlert({
          // 		message: "Your mobile is not registered with us"
          // 	});
        }
      } catch (error) {
        if (error.message) {
          AppAlert({
            message: error.message,
          });
        }
      }

      this.verifymobile_call_invoked = false;
      this.setState({
        loading: false,
        loading_message: "",
      });
    }
  };
  render() {
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
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 30,
    borderWidth: 0.5,
    borderRadius: 20,
    height: 40,
    backgroundColor: AppColors.primary_tint_2,
  },
  form_textinput_1: {
    ...AppFonts.h2,
    // lineHeight:40,
    flex: 1,
    marginLeft: 10,
    color: AppColors.primary,
  },
  form_container_2: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  form_text_1: {
    ...AppFonts.h1_bold,
    color: AppColors.primary,
    marginRight: 10,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
