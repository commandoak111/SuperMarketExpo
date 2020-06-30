import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  AsyncStorage,
  Animated,
  TextInput,
  Modal,
} from "react-native";
import Constants from "expo-constants";
import { AppColors, AppFonts } from "../../theme";
import { Loader, AppText, AppAlert } from "../../components/ui";
import * as _ from "lodash";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
  AntDesign,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import * as UserActions from "../../redux/user/actions";
import * as AppActions from "../../redux/user/actions";
import { connect } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";
import { set } from "react-native-reanimated";

TAG = "Super market Account ";

const mapStateToProps = (state) => ({
  user_location_data: state.user.user_location_data,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  fontLoader: AppActions.fontLoader,
  ApiCheck: UserActions.ApiCheck,
  updateUserLocation: UserActions.updateUserLocation,
  updateUserMarketOrders: UserActions.updateUserMarketOrders,
  updateUserMarketBasket: UserActions.updateUserMarketBasket,
  onLogout: UserActions.onLogout,
  addUserAddress: UserActions.addUserAddress,
  getUserAddress: UserActions.getUserAddress,
};
const marginAnim = new Animated.Value(100);
const marginHoriAnim = new Animated.Value(100);
const fadeAnim = new Animated.Value(0);
class S_Account extends React.Component {
  constructor(props) {
    super(props);

    Animated.timing(marginAnim, {
      toValue: 10,
      duration: 800,
    }).start();
    Animated.timing(marginHoriAnim, {
      toValue: 15,
      duration: 800,
    }).start();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1600,
    }).start();

    this.state = {
      loading: false,
      show_newaddress: false,
      textinput_name: "",
      textinput_mobile: "",
      textinput_email: "",
      textinput_address: "",
      textinput_country: "",
      textinput_zipcode: "",
      textinput_city: "",
      textinput_state: "",
      user_options: [
        { name: "Orders", icon: "ios-apps" },
        // { name: "Wishlist", icon: "ios-heart" },
        { name: "Cart", icon: "md-cart" },
        { name: "Notifications", icon: "md-notifications-outline" },
        { name: "Change Store", icon: "exchange" },
        { name: "Logout", icon: "md-log-out" },
      ],
    };
  }
  componentDidMount = async () => {
    this.getData();
  };
  getData = async () => {
    this.setState({ loading: true });
    var len =
      this.props.user_location_data &&
      this.props.user_location_data.currentaddress
        ? this.props.user_location_data.currentaddress.length
        : 0;
    try {
      var token = await AsyncStorage.getItem("expoPushToken");
      this.setState({ expoPushToken:token });
      var resp = await this.props.getUserAddress();
      var address = resp.data;

      if (address.length != 0) {
        var len = address.length;
        if (
          this.props.user_location_data &&
          this.props.user_location_data.currentaddress
        ) {
          this.setState({
            currentaddress: this.props.user_location_data.currentaddress,
          });
        } else {
          console.log("account  :  ", address, len);

          this.setState({ currentaddress: address[len - 1] });
        }
      }
    } catch (error) {}
    this.setState({ loading: false });
  };
  onLogout = async () => {
    this.setState({ loading: true });
    await Promise.all([
      AsyncStorage.setItem("user_location_data", ""),
      AsyncStorage.setItem("auth_token", ""),
      AsyncStorage.setItem("user_market_basket", ""),
      AsyncStorage.setItem("user_market_orders", ""),
      // this.props.updateUserLocation({}),
    ]);

    await this.props.onLogout();
    Actions.UserRegistration({ type: "reset", navigateid: 2 });
    // await Actions.Launch();
  };
  onChangeStore = async () => {
    this.setState({ loading: true });
    await Promise.all([
      AsyncStorage.setItem("user_favorite", ""),
      AsyncStorage.setItem("user_market_basket", ""),
      AsyncStorage.setItem("user_market_orders", ""),
      this.props.updateUserMarketOrders([]),
      this.props.updateUserMarketBasket([]),
    ]);
    this.setState({ loading: false });

    await Actions.Location();
  };
  renderHeader = () => {
    return (
      <View style={styles.render_header}>
        <AppText
          style={[
            AppFonts.h2_bold,
            { marginLeft: 15, textAlign: "center", color: AppColors.white },
          ]}
        >
          MY ACCOUNT
        </AppText>
      </View>
    );
  };
  imageHeader = () => {
    return (
      <View style={{ height: 260 }}>
        <Image
          style={{ height: 200, width: "100%" }}
          source={require("../../../assets/accountbg.jpg")}
        ></Image>
        <View
          style={{
            height: 120,
            width: 120,
            borderRadius: 60,
            backgroundColor: AppColors.background,
            borderWidth: 0.5,
            overflow: "hidden",
            position: "absolute",
            bottom: 0,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Image
            style={{ height: 110, width: 110 }}
            source={{
              uri:
                "https://cdn1.iconfinder.com/data/icons/bokbokstars-121-classic-stock-icons-1/512/person-man.png",
            }}
          ></Image>
          {/* <MaterialCommunityIcons
            name="account"
            size={90}
            color={AppColors.white}
          /> */}
        </View>
      </View>
    );
  };
  userDetails = () => {
    // var len =
    //   this.props.user_location_data &&
    //   this.props.user_location_data.deliveryaddress
    //     ? this.props.user_location_data.deliveryaddress.length
    //     : 0;
    // var deliveryaddress = _.get(
    //   this.props.user_location_data,
    //   "deliveryaddress[0]",
    //   null
    // );
    // var address = _.get(
    //   this.props.user_location_data,
    //   "currentaddress",
    //   deliveryaddress
    // );
    // this.props.user_location_data.currentaddress &&
    // this.props.user_location_data.currentaddress;
    var address = this.state.currentaddress;
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        {this.state.currentaddress && this.state.currentaddress != null && (
          <AppText style={[AppFonts.h2_bold]}>{address.contact}</AppText>
        )}
        <View style={{ flexDirection: "row" }}>
          {this.state.currentaddress == null ? (
            <AppText
              style={[
                AppFonts.h3,
                { marginTop: 10, fontFamily: "Montserrat_Light" },
              ]}
            >
              Add address here
            </AppText>
          ) : (
            <View style={{ marginHorizontal: 20 }}>
              <AppText
                style={[
                  AppFonts.h5,
                  {
                    numberOfLines: 2,
                    textAlign: "center",
                    fontFamily: "Montserrat_Light",
                  },
                ]}
              >
                {address.door}, {address.street}, {address.area},
                {address.landmark}, {address.town}, {address.city}
              </AppText>
              <AppText
                style={[
                  AppFonts.h4bold,
                  {
                    numberOfLines: 2,
                    textAlign: "center",
                    fontFamily: "Montserrat_Light",
                  },
                ]}
              >
                {address.contactno}
              </AppText>
              <AppText
                style={[
                  AppFonts.h5,
                  {
                    numberOfLines: 2,
                    textAlign: "center",
                    fontFamily: "Montserrat_Light",
                  },
                ]}
              >
                {address.email}
              </AppText>
            </View>
          )}
          <Entypo
            onPress={() => this.setState({ show_newaddress: true })}
            name="pencil"
            size={18}
            color={AppColors.grey}
            style={{
              // marginHorizontal: 5,
              // marginTop: address == null ? 10 : 0,
              position: "absolute",
              top: address == null ? 10 : -4,
              right: address == null ? -30 : -10,
            }}
          />
        </View>
      </View>
    );
  };
  changeCurrentAddress = async () => {
    this.setState({ loading: true });
    var name = this.state.textinput_name;
    var mobile = this.state.textinput_mobile;
    // var email = this.state.textinput_email;
    var door = this.state.textinput_door;
    var street = this.state.textinput_street;
    var area = this.state.textinput_area;
    var landmark = this.state.textinput_landmark;
    var town = this.state.textinput_town;
    var city = this.state.textinput_city;
    var type = this.state.textinput_type;
    var selected_type = this.state.selected_type;
    var email_sample = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;

    if (name.length == 0) {
      AppAlert({ message: "Enter name" });
    } else if (mobile.length != 10) {
      AppAlert({ message: "Enter valid mobile no" });
      // } else if (!email.match(email_sample)) {
      //   AppAlert({ message: "Enter valid email" });
    } else if (
      door.length == 0 ||
      street.length == 0 ||
      area.length == 0 ||
      landmark.length == 0 ||
      town.length == 0 ||
      city.length == 0
    ) {
      AppAlert({ message: "Fill all fields" });
    } else {
      var data = {
        Item: {
          type: selected_type == "Other" ? type : selected_type,
          contact: name,
          contactno: mobile,
          // email: email,
          door: door,
          street: street,
          area: area,
          town: town,
          landmark: landmark,
          city: city,
        },
      };
      var resp = await this.props.addUserAddress(data);

      var user_location_data = this.props.user_location_data;

      user_location_data.currentaddress = data.Item;
      await this.props.updateUserLocation(user_location_data);
      await AsyncStorage.setItem(
        "user_location_data",
        JSON.stringify(user_location_data)
      );
      this.setState({
        show_newaddress: false,
        textinput_name: "",
        textinput_mobile: "",
        textinput_door: "",
        textinput_street: "",
        textinput_area: "",
        textinput_landmark: "",
        textinput_city: "",
        textinput_town: "",
        textinput_type: "",
        selected_type: "",
      });
    }
    this.setState({ loading: false });
  };
  userOptions = () => {
    return (
      <View style={{ minHeight: 60, marginVertical: 10 }}>
        <FlatList
          contentContainerStyle={{ alignSelf: "center" }}
          numColumns={3}
          data={this.state.user_options}
          renderItem={this.userOptionsView}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  };
  userOptionsView = ({ item, index }) => {
    return (
      <Animated.View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 20,
          marginTop: marginAnim,
          marginLeft: marginHoriAnim,
          marginVertical: 15,
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (index == 0) {
              Actions.S_Orders();
            } else if (index == 1) {
              Actions.S_Basket();
            } else if (index == 2) {
              Actions.Notification();
            } else if (index == 3) {
              this.onChangeStore();
            } else if (index == 4) {
              this.onLogout();
            }
          }}
          style={{
            // height: 70,
            // width: 70,
            height: 70,
            width: 70,
            borderWidth: 3,
            borderColor: AppColors.grey,
            borderRadius: 35,
            backgroundColor: AppColors.white,
            alignItems: "center",
            marginBottom: 5,
            justifyContent: "center",
          }}
        >
          <Animated.View>
            {item.icon == "exchange" ? (
              <FontAwesome name={item.icon} size={32} color={AppColors.grey} />
            ) : (
              <Ionicons name={item.icon} size={40} color={AppColors.grey} />
            )}
          </Animated.View>
        </TouchableOpacity>
        <AppText style={[AppFonts.h5bold]}>{item.name}</AppText>
      </Animated.View>
    );
  };
  keyExtractor = (item, index) => index.toString();
  shippingAddress = () => {
    return (
      <View
        style={{
          // minHeight: 40,
          flex: 1,
          backgroundColor: AppColors.white,
          padding: 20,
        }}
      >
        {/* <AppText style={[AppFonts.h2_bold, { marginLeft: 10 }]}>
          Shipping Address
        </AppText> */}
        <AppText
          style={[
            styles.font_text,
            {
              color:
                this.state.textinput_name &&
                this.state.textinput_name.length != 0 &&
                AppColors.grey,
              // : AppColors.s_secondary,
            },
          ]}
        >
          Name*
        </AppText>
        <View style={[styles.textinput_v1]}>
          <MaterialCommunityIcons
            name="account"
            size={25}
            color={AppColors.grey}
          />
          <TextInput
            style={styles.font_textinput}
            onChangeText={(text) => {
              this.setState({ textinput_name: text });
            }}
            onSubmitEditing={() => {
              this.refs.textinput_mobile.focus();
            }}
            value={this.state.textinput_name}
            // placeholder="Name"
          ></TextInput>
        </View>
        <AppText
          style={[
            styles.font_text,
            {
              color:
                this.state.textinput_mobile &&
                this.state.textinput_mobile.length == 10 &&
                AppColors.grey,
              // : AppColors.s_secondary,
            },
          ]}
        >
          Mobile*
        </AppText>
        <View style={[styles.textinput_v1]}>
          <AntDesign name="mobile1" size={25} color={AppColors.grey} />
          <TextInput
            ref={"textinput_mobile"}
            onSubmitEditing={() => {
              this.refs.textinput_address.focus();
            }}
            style={styles.font_textinput}
            keyboardType="number-pad"
            onChangeText={(text) => {
              this.setState({ textinput_mobile: text });
            }}
            value={this.state.textinput_mobile}
            // placeholder="Mobile"
          ></TextInput>
        </View>
        {/* <AppText
          style={[
            styles.font_text,
            {
              color:
                this.state.textinput_email &&
                this.state.textinput_email.length != 10 &&
                AppColors.grey,
              // : AppColors.s_secondary,
            },
          ]}
        >
          E-mail*
        </AppText> */}
        {/* <View style={[styles.textinput_v1]}>
          <MaterialCommunityIcons
            name="email"
            size={25}
            color={AppColors.grey}
          />
          <TextInput
            ref={"textinput_email"}
            onSubmitEditing={() => {
              this.refs.textinput_address.focus();
            }}
            style={styles.font_textinput}
            keyboardType="email-address"
            onChangeText={(text) => {
              this.setState({ textinput_email: text });
            }}
            value={this.state.textinput_email}
            // placeholder="E-mail"
          ></TextInput>
        </View> */}
        <AppText
          style={[
            styles.font_text,
            {
              color:
                this.state.textinput_address &&
                this.state.textinput_address.length != 0 &&
                AppColors.grey,
              // : AppColors.s_secondary,
            },
          ]}
        >
          Door*
        </AppText>
        <View style={[styles.textinput_v1]}>
          <FontAwesome5 name="door-open" size={20} color={AppColors.grey} />
          <TextInput
            ref={"textinput_address"}
            onSubmitEditing={() => {
              this.refs.textinput_country.focus();
            }}
            style={styles.font_textinput}
            // multiline={true}
            onChangeText={(text) => {
              this.setState({ textinput_door: text });
            }}
            value={this.state.textinput_door}
            // placeholder="Address"
          ></TextInput>
        </View>
        <AppText
          style={[
            styles.font_text,
            {
              color:
                this.state.textinput_country &&
                this.state.textinput_country.length != 0 &&
                AppColors.grey,
              // : AppColors.s_secondary,
            },
          ]}
        >
          Street*
        </AppText>

        <View style={[styles.textinput_v1]}>
          <FontAwesome name="address-book" size={24} color={AppColors.grey} />
          <TextInput
            ref={"textinput_country"}
            onSubmitEditing={() => {
              this.refs.textinput_zipcode.focus();
            }}
            style={styles.font_textinput}
            onChangeText={(text) => {
              this.setState({ textinput_street: text });
            }}
            value={this.state.textinput_street}
            // placeholder="Country"
          ></TextInput>
        </View>
        <AppText
          style={[
            styles.font_text,
            {
              color:
                this.state.textinput_zipcode &&
                this.state.textinput_zipcode.length == 6 &&
                AppColors.grey,
              // : AppColors.s_secondary,
            },
          ]}
        >
          Area*
        </AppText>
        <View style={[styles.textinput_v1]}>
          <AntDesign name="codepen" size={25} color={AppColors.grey} />
          <TextInput
            ref={"textinput_zipcode"}
            onSubmitEditing={() => {
              this.refs.textinput_state.focus();
            }}
            style={styles.font_textinput}
            onChangeText={(text) => {
              this.setState({ textinput_area: text });
            }}
            value={this.state.textinput_area}
            // placeholder="Zipcode"
          ></TextInput>
        </View>
        <AppText
          style={[
            styles.font_text,
            {
              color:
                this.state.textinput_state &&
                this.state.textinput_state.length != 6 &&
                AppColors.grey,
              // : AppColors.s_secondary,
            },
          ]}
        >
          Landmark*
        </AppText>
        <View style={[styles.textinput_v1]}>
          <FontAwesome5 name="landmark" size={23} color={AppColors.grey} />
          <TextInput
            ref={"textinput_state"}
            style={styles.font_textinput}
            onChangeText={(text) => {
              this.setState({ textinput_landmark: text });
            }}
            onSubmitEditing={() => {
              this.refs.textinput_town.focus();
            }}
            value={this.state.textinput_landmark}
            // placeholder="State"
          ></TextInput>
        </View>
        <AppText
          style={[
            styles.font_text,
            {
              color:
                this.state.textinput_state &&
                this.state.textinput_state.length != 6 &&
                AppColors.grey,
              // : AppColors.s_secondary,
            },
          ]}
        >
          Town*
        </AppText>
        <View style={[styles.textinput_v1]}>
          <MaterialCommunityIcons
            name="city-variant"
            size={25}
            color={AppColors.grey}
          />
          <TextInput
            ref={"textinput_town"}
            style={styles.font_textinput}
            onChangeText={(text) => {
              this.setState({ textinput_town: text });
            }}
            onSubmitEditing={() => {
              this.refs.textinput_city.focus();
            }}
            value={this.state.textinput_town}
            // placeholder="State"
          ></TextInput>
        </View>

        <AppText
          style={[
            styles.font_text,
            {
              color:
                this.state.textinput_city &&
                this.state.textinput_city.length != 6 &&
                AppColors.grey,
              // : AppColors.s_secondary,
            },
          ]}
        >
          City*
        </AppText>
        <View style={[styles.textinput_v1]}>
          <MaterialCommunityIcons
            name="city"
            size={25}
            color={AppColors.grey}
          />
          <TextInput
            ref={"textinput_city"}
            onSubmitEditing={() => {
              // this.refs.textinput_state.focus();
            }}
            style={styles.font_textinput}
            onChangeText={(text) => {
              this.setState({ textinput_city: text });
            }}
            value={this.state.textinput_city}
            // placeholder="City"
          ></TextInput>
        </View>
        <AppText
          style={[
            styles.font_text,
            {
              color:
                this.state.textinput_state &&
                this.state.textinput_state.length != 6 &&
                AppColors.grey,
              // : AppColors.s_secondary,
            },
          ]}
        >
          type*
        </AppText>
        <View
          style={{ flexDirection: "row", alignItems: "center", height: 30 }}
        >
          <View
            style={{ flex: 0.3, flexDirection: "row", alignItems: "center" }}
          >
            {this.state.selected_type != "Home" ? (
              <FontAwesome
                onPress={() => {
                  this.setState({
                    selected_type: "Home",
                  });
                }}
                name="circle-o"
                size={18}
                color={AppColors.primary}
                style={{ marginRight: 5 }}
              />
            ) : (
              <FontAwesome
                name="circle"
                size={18}
                color={AppColors.primary}
                style={{ marginRight: 5 }}
              />
            )}
            <AppText style={[AppFonts.h4]}>Home</AppText>
          </View>
          <View
            style={{ flex: 0.3, flexDirection: "row", alignItems: "center" }}
          >
            {this.state.selected_type != "Office" ? (
              <FontAwesome
                onPress={() => {
                  this.setState({
                    selected_type: "Office",
                  });
                }}
                name="circle-o"
                size={18}
                color={AppColors.primary}
                style={{ marginRight: 5 }}
              />
            ) : (
              <FontAwesome
                name="circle"
                size={18}
                color={AppColors.primary}
                style={{ marginRight: 5 }}
              />
            )}
            <AppText style={[AppFonts.h4]}>Office</AppText>
          </View>
          <View
            style={{ flex: 0.3, flexDirection: "row", alignItems: "center" }}
          >
            {this.state.selected_type != "Other" ? (
              <FontAwesome
                onPress={() => {
                  this.setState({
                    selected_type: "Other",
                  });
                }}
                name="circle-o"
                size={18}
                color={AppColors.primary}
                style={{ marginRight: 5 }}
              />
            ) : (
              <FontAwesome
                name="circle"
                size={18}
                color={AppColors.primary}
                style={{ marginRight: 5 }}
              />
            )}
            <AppText style={[AppFonts.h4]}>Other</AppText>
          </View>
        </View>
        {this.state.selected_type == "Other" && (
          <View style={[styles.textinput_v1]}>
            <MaterialCommunityIcons
              name="home-city"
              size={25}
              color={AppColors.grey}
            />
            <TextInput
              ref={"textinput_type"}
              style={styles.font_textinput}
              onChangeText={(text) => {
                this.setState({ textinput_type: text });
              }}
              onSubmitEditing={() => {
                this.changeCurrentAddress();
              }}
              value={this.state.textinput_type}
              // placeholder="State"
            ></TextInput>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            this.changeCurrentAddress();
          }}
          style={{
            // position: "absolute",
            // bottom: 30,
            // left: 20,
            height: 35,
            marginTop: 20,
            // width: "100%",
            backgroundColor: AppColors.secondary,
            // margin: 10,
            borderWidth: 1,
            borderColor: AppColors.grey99,
            justifyContent: "center",
          }}
        >
          <AppText
            style={[
              AppFonts.h3_bold,
              { color: AppColors.white, textAlign: "center" },
            ]}
          >
            SAVE ADDRESS
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}
        {this.imageHeader()}
        {this.userDetails()}
        {this.userOptions()}
        {this.state.expoPushToken && (
          <View style={{ position: "absolute", bottom: 20, right: 20 }}>
            <AppText style={[AppFonts.h5_light]}>
              {this.state.expoPushToken}
            </AppText>
          </View>
        )}
        <Modal
          transparent={true}
          visible={this.state.show_newaddress}
          onRequestClose={() => this.setState({ show_newaddress: false })}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            {this.shippingAddress()}
          </View>
        </Modal>
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
    borderWidth: 0.5,
    borderColor: AppColors.grey,
    paddingTop: Constants.statusBarHeight,
    justifyContent: "center",
  },
  font_textinput: {
    ...AppFonts.h3,
    height: 30,
    // borderBottomWidth: 1,
    flex: 1,
    borderColor: AppColors.grey80,
    textDecorationColor: AppColors.grey80,
    paddingLeft: 5,
    backgroundColor: AppColors.white,
    marginBottom: -2,
  },
  font_text: {
    ...AppFonts.h4,
    color: AppColors.grey,
  },
  textinput_v1: {
    marginTop: 5,
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-end",
    paddingBottom: 3,
    borderBottomWidth: 1,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(S_Account);
