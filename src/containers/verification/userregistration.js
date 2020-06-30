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
  ImageBackground,
  RefreshControl,
  Vibration,
  TextInput,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import { AppColors, AppFonts } from "../../theme";
import { AppText, Loader, AppAlert } from "../../components/ui";
import * as _ from "lodash";
import Slideshow from "react-native-image-slider-show";
import {
  Ionicons,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import * as UserActions from "../../redux/user/actions";
import * as Network from "expo-network";
import { Actions } from "react-native-router-flux";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const TAG = "SuperMarket UserRegistration ";

const mapStateToProps = (state) => ({
  user_location_data: state.user.user_location_data,
  user_basket: state.user.user_basket,
  user_market_basket: state.user.user_market_basket,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  fontLoader: UserActions.fontLoader,
  getProducts: UserActions.getProducts,
  updateUserLocation: UserActions.updateUserLocation,
  getCategoryList: UserActions.getCategoryList,
  createAccount: UserActions.createAccount,
  userLogin: UserActions.userLogin,
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const IMAGE_SOURCE = "http://hd-x.in/file/show/0/";

const marginAnim = new Animated.Value(200);
class UserRegistration extends React.Component {
  constructor(props) {
    super(props);
    Animated.timing(marginAnim, {
      toValue: 0,
      duration: 800,
    }).start();

    this.state = {
      loading: false,
      refresh_data: false,
      textinput_mobile: "",
      textinput_password: "",
    };
  }
  componentDidMount = async () => {
    await this.getData();
  };

  onRefresh = () => {
    this.setState({ refresh_data: true }, function () {
      this.getData();
    });
  };
  getData = async () => {
    var userdata = this.props.userdata;
    console.log(TAG + " getdata  :  userata ", userdata);
  };
  renderHeader = () => {
    return (
      <View style={styles.render_header}>
        {/* <Ionicons
          onPress={() => Actions.pop()}
          name="md-arrow-back"
          size={25}
          color={AppColors.white}
          style={{ marginHorizontal: 10 }}
        /> */}
        <View
          style={{
            height: 40,
            justifyContent: "center",
            marginLeft: 10,
            flex: 1,
          }}
        >
          <AppText
            style={[
              AppFonts.h3_bold,
              { color: AppColors.white, textAlign: "center" },
            ]}
          >
            User Registration
          </AppText>
        </View>
      </View>
    );
  };
  keyExtractor = (item, index) => index.toString();
  onLogin = async () => {
    this.setState({ loading: true });
    var mobile = this.state.textinput_mobile;
    var password = this.state.textinput_password;
    if (mobile.length == 0) {
      AppAlert({
        message: "Enter mobile",
      });
    } else if (password.length == 0) {
      AppAlert({
        message: "Enter password",
      });
    } else {
      var postData = {
        grant_type: "password",
        username: mobile,
        password: password,
        client_id: "InfyPOS",
        client_secret: "KareInfinity",
      };
      try {
        var user_location_data = this.props.user_location_data;
        var resp = await this.props.userLogin(postData);

        var token = resp.data.access_token;
        await AsyncStorage.setItem("auth_token", token);
        this.setState({
          textinput_name: "",
          textinput_email: "",
          textinput_password: "",
          textinput_confirmpassword: "",
        });
        if (user_location_data && user_location_data.store_data) {
          Actions.S_App({ type: "reset" });
        } else {
          Actions.Location({ type: "reset" });
        }
      } catch (error) {
        console.log("Userregistration error  :  ", error);
        if (error.status == 400) {
          AppAlert({
            message: "Username or password is invalid",
          });
        }
      }
    }
    this.setState({ loading: false });
  };
  onRegisterUser = async () => {
    this.setState({ loading: true });
    var name = this.state.textinput_name;
    var email = this.state.textinput_email;
    var password = this.state.textinput_password;
    var confirmpassword = this.state.textinput_confirmpassword;
    if (name.length == 0) {
      AppAlert({
        message: "Enter Name",
      });
    } else if (email.length == 0) {
      AppAlert({
        message: "Enter email",
      });
    } else if (password.length == 0) {
      AppAlert({
        message: "Enter password",
      });
    } else if (confirmpassword.length == 0) {
      AppAlert({
        message: "Enter confirm password",
      });
    } else if (password != confirmpassword) {
      AppAlert({
        message: "password and confim password should be same",
      });
    } else {
      var postData = {
        Item: {
          grant_type: "password",
          contactno: this.props.userdata.contactno,
          otp: this.props.userdata.otp,
          emailid: email,
          name: name,
          password: password,
          otpsent: true,
          // client_id: "InfyPOS",
          // client_secret: "KareInfinity",
        },
      };
      try {
        var resp = await this.props.createAccount(postData);
        if (resp.data != null && resp.data.message == null) {
          var postData = {
            grant_type: "password",
            username: resp.data.contactno,
            password: resp.data.password,
            client_id: "InfyPOS",
            client_secret: "KareInfinity",
          };
          try {
            var resp = await this.props.userLogin(postData);

            var token = resp.data.access_token;
            await AsyncStorage.setItem("auth_token", token);
            this.setState({
              textinput_name: "",
              textinput_email: "",
              textinput_password: "",
              textinput_confirmpassword: "",
            });
            Actions.Location({ type: "reset" });
          } catch (error) {}
          Actions.Locaion({ type: "reset" });
        } else if (resp.data.message != null) {
          AppAlert({ message: resp.data.message });
        }
      } catch (error) {}
    }
    this.setState({ loading: false });
  };
  renderLoginBody = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Image
          style={{ height: 300, width: 300, alignSelf: "center" }}
          source={require("../../../assets/applogo.png")}
        ></Image>
        <View style={styles.text_view}>
          <AntDesign
            name="mobile1"
            color={AppColors.white}
            size={25}
            style={{ marginHorizontal: 12 }}
          />
          <TextInput
            ref={"ref_name"}
            value={this.state.textinput_mobile}
            placeholder={"Mobile"}
            keyboardType="number-pad"
            style={{ flex: 1, ...AppFonts.h4, color: AppColors.white }}
            onChangeText={(text) => {
              this.setState({ textinput_mobile: text });
            }}
            onSubmitEditing={() => {
              this.refs.ref_username.focus();
            }}
          ></TextInput>
        </View>
        <View style={styles.text_view}>
          <MaterialCommunityIcons
            name="key-variant"
            color={AppColors.white}
            size={23}
            style={{ marginHorizontal: 12 }}
          />
          <TextInput
            ref={"ref_username"}
            value={this.state.textinput_password}
            secureTextEntry={true}
            placeholder={"Password"}
            style={{ flex: 1, ...AppFonts.h4, color: AppColors.white }}
            onChangeText={(text) => {
              this.setState({ textinput_password: text });
            }}
            onSubmitEditing={() => {
              this.onLogin();
            }}
          ></TextInput>
        </View>

        <TouchableOpacity
          onPress={() => {
            this.onLogin();
          }}
          style={[
            {
              height: 40,
              marginVertical: 10,
              marginHorizontal: 20,
              justifyContent: "center",
              backgroundColor: AppColors.white,
              borderWidth: 0.8,
              elevation: 5,
            },
          ]}
        >
          <AppText
            style={[
              AppFonts.h3_bold,
              { color: AppColors.primary, textAlign: "center" },
            ]}
          >
            LOG IN
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Actions.MobileVerification();
          }}
          style={{}}
        >
          <AppText
            style={[
              AppFonts.h4,
              { textAlign: "right", marginRight: 20, marginVertical: 10 },
            ]}
          >
            Create new account?
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };
  renderBody = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Image
          style={{ height: 300, width: 300, alignSelf: "center" }}
          source={require("../../../assets/applogo.png")}
        ></Image>
        <View style={styles.text_view}>
          <FontAwesome
            name="user"
            color={AppColors.white}
            size={25}
            style={{ marginHorizontal: 15 }}
          />
          <TextInput
            ref={"ref_name"}
            value={this.state.textinput_name}
            placeholder={"Name"}
            style={{ flex: 1, ...AppFonts.h4, color: AppColors.white }}
            onChangeText={(text) => {
              this.setState({ textinput_name: text });
            }}
            onSubmitEditing={() => {
              this.refs.ref_organization_code.focus();
            }}
          ></TextInput>
        </View>
        <View style={styles.text_view}>
          <MaterialIcons
            name="email"
            color={AppColors.white}
            size={25}
            style={{ marginHorizontal: 12 }}
          />
          <TextInput
            ref={"ref_organization_code"}
            value={this.state.textinput_email}
            placeholder={"E-mail"}
            style={{ flex: 1, ...AppFonts.h4, color: AppColors.white }}
            onChangeText={(text) => {
              this.setState({ textinput_email: text });
            }}
            onSubmitEditing={() => {
              var sample = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
              if (!this.state.textinput_email.match(sample)) {
                AppAlert({ message: "Enter valid email address" });
              } else {
                this.refs.ref_username.focus();
              }
            }}
          ></TextInput>
        </View>
        <View style={styles.text_view}>
          <MaterialCommunityIcons
            name="key-variant"
            color={AppColors.white}
            size={23}
            style={{ marginHorizontal: 12 }}
          />
          <TextInput
            ref={"ref_username"}
            value={this.state.textinput_password}
            placeholder={"Password"}
            secureTextEntry={true}
            style={{ flex: 1, ...AppFonts.h4, color: AppColors.white }}
            onChangeText={(text) => {
              this.setState({ textinput_password: text });
            }}
            onSubmitEditing={() => {
              this.refs.ref_password.focus();
            }}
          ></TextInput>
        </View>
        <View style={styles.text_view}>
          <MaterialCommunityIcons
            name="key-variant"
            color={AppColors.white}
            size={23}
            style={{ marginHorizontal: 12 }}
          />
          <TextInput
            ref={"ref_password"}
            value={this.state.textinput_confirmpassword}
            secureTextEntry={true}
            placeholder={"Confirm password"}
            style={{ flex: 1, ...AppFonts.h4, color: AppColors.white }}
            onChangeText={(text) => {
              this.setState({ textinput_confirmpassword: text });
            }}
            onSubmitEditing={() => {
              this.onRegisterUser();
            }}
          ></TextInput>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.onRegisterUser();
          }}
          style={[
            {
              height: 40,
              marginVertical: 10,
              marginHorizontal: 20,
              justifyContent: "center",
              backgroundColor: AppColors.white,
              borderWidth: 0.8,
              elevation: 5,
            },
          ]}
        >
          <AppText
            style={[
              AppFonts.h3_bold,
              { color: AppColors.primary, textAlign: "center" },
            ]}
          >
            SIGN UP
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Actions.UserRegistration({ navigateid: 2 })}
          style={{}}
        >
          <AppText
            style={[
              AppFonts.h4,
              { textAlign: "right", marginRight: 20, marginVertical: 10 },
            ]}
          >
            Already have an account?
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    var showlogin =
      this.props.navigateid && this.props.navigateid == 1 ? false : true;
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading} />
        {/* {this.renderHeader()} */}
        {showlogin == true ? this.renderLoginBody() : this.renderBody()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    // marginTop: Constants.statusBarHeight,
  },
  render_header: {
    height: Constants.statusBarHeight + 50,
    backgroundColor: AppColors.secondary,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingTop: Constants.statusBarHeight,
  },

  text_view: {
    height: 40,
    flexDirection: "row",
    marginVertical: 10,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    marginHorizontal: 20,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(UserRegistration);
