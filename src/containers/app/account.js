import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  AsyncStorage,
  Animated,
  Modal,
  TextInput,
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
} from "@expo/vector-icons";
import * as UserActions from "../../redux/user/actions";
import { connect } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";
import { set } from "react-native-reanimated";

TAG = "Account ";

const mapStateToProps = (state) => ({
  user_location_data: state.user.user_location_data,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  fontLoader: UserActions.fontLoader,
  ApiCheck: UserActions.ApiCheck,
  updateUserLocation: UserActions.updateUserLocation,
  updateUserOrders: UserActions.updateUserOrders,
  updateUserBasket: UserActions.updateUserBasket,
};
const marginAnim = new Animated.Value(100);
const fadeAnim = new Animated.Value(0);
class Account extends React.Component {
  constructor(props) {
    super(props);

    Animated.timing(marginAnim, {
      toValue: 10,
      duration: 800,
    }).start();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1600,
    }).start();

    this.state = {
      loading: false,
      show_newaddress: false,
      user_options: [
        { name: "Orders", icon: "ios-apps" },
        { name: "Wishlist", icon: "ios-heart" },
        { name: "Cart", icon: "md-cart" },
        { name: "Notifications", icon: "md-notifications-outline" },
        { name: "Change Store", icon: "exchange" },
        { name: "Logout", icon: "md-log-out" },
      ],
    };
  }
  componentDidMount = async () => {};
  onLogout = async () => {
    this.setState({ loading: true });
    await Promise.all([
      AsyncStorage.setItem("user_location_data", ""),
      AsyncStorage.setItem("user_favorite", ""),
      AsyncStorage.setItem("user_basket", ""),
      AsyncStorage.setItem("user_orders", ""),
      this.props.updateUserLocation({}),
    ]);
    this.setState({ loading: false });

    await Actions.Launch({ type: "reset" });
  };
  onChangeStore = async () => {
    this.setState({ loading: true });
    await Promise.all([
      AsyncStorage.setItem("user_favorite", ""),
      AsyncStorage.setItem("user_basket", ""),
      AsyncStorage.setItem("user_orders", ""),
      this.props.updateUserOrders([]),
      this.props.updateUserBasket([]),
    ]);
    this.setState({ loading: false });

    await Actions.Location({ type: "reset" });
  };
  renderHeader = () => {
    return (
      <View style={styles.render_header}>
        <View
          style={{
            height: 40,
            backgroundColor: AppColors.white,
            justifyContent: "center",
          }}
        >
          <AppText style={[AppFonts.h2_bold, { marginLeft: 15 }]}>
            Account
          </AppText>
        </View>
      </View>
    );
  };
  imageHeader = () => {
    return (
      <View style={{ height: 260 }}>
        <Image
          style={{ height: 200 }}
          source={{
            uri:
              "data:image/jpeg;base64,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",
          }}
        ></Image>
        <View
          style={{
            height: 120,
            width: 120,
            borderRadius: 60,
            backgroundColor: AppColors.grey,
            position: "absolute",
            bottom: 0,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="account"
            size={90}
            color={AppColors.white}
          />
        </View>
      </View>
    );
  };
  userDetails = () => {
    var len =
      this.props.user_location_data &&
      this.props.user_location_data.deliveryaddress
        ? this.props.user_location_data.deliveryaddress.length
        : 0;
    var address = _.get(this.props.user_location_data, "currentaddress", null);
    // this.props.user_location_data.currentaddress &&
    // this.props.user_location_data.currentaddress;
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        {address != null && (
          <AppText style={[AppFonts.h2_bold]}>{address.name}</AppText>
        )}
        <View style={{ flexDirection: "row" }}>
          {address == null ? (
            <AppText style={[AppFonts.h3, { marginTop: 10 }]}>
              Add address here
            </AppText>
          ) : (
            <View style={{ marginHorizontal: 20 }}>
              <AppText
                style={[AppFonts.h3, { numberOfLines: 2, textAlign: "center" }]}
              >
                {address.address}, {address.city}, {address.state},{" "}
                {address.country}, {address.zipcode}
              </AppText>
              <AppText
                style={[AppFonts.h3, { numberOfLines: 2, textAlign: "center" }]}
              >
                {address.mobile}
              </AppText>
              <AppText
                style={[AppFonts.h3, { numberOfLines: 2, textAlign: "center" }]}
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
              marginHorizontal: 5,
              marginTop: address == null ? 10 : 0,
            }}
          />
        </View>
      </View>
    );
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
          marginLeft: marginAnim,
          marginVertical: 15,
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (index == 0) {
              Actions.Orders();
            } else if (index == 1) {
              Actions.Favorite();
            } else if (index == 2) {
              Actions.Basket();
            } else if (index == 3) {
              AppAlert({ message: "you clicked Notifications" });
            } else if (index == 4) {
              this.onChangeStore();
            } else if (index == 5) {
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
        <AppText style={[AppFonts.h4]}>{item.name}</AppText>
      </Animated.View>
    );
  };
  keyExtractor = (item, index) => index.toString();
  changeCurrentAddress = async () => {
    this.setState({ loading: true });
    var name = this.state.textinput_name;
    var mobile = this.state.textinput_mobile;
    var email = this.state.textinput_email;
    var address = this.state.textinput_address;
    var country = this.state.textinput_country;
    var zipcode = this.state.textinput_zipcode;
    var city = this.state.textinput_city;
    var state = this.state.textinput_state;
    var email_sample = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
    if (name.length == 0) {
      AppAlert({ message: "Enter name" });
    } else if (mobile.length != 10) {
      AppAlert({ message: "Enter valid mobile no" });
    } else if (!email.match(email_sample)) {
      AppAlert({ message: "Enter valid email" });
    } else if (
      address.length == 0 ||
      country.length == 0 ||
      zipcode.length == 0 ||
      city.length == 0 ||
      state.length == 0
    ) {
      AppAlert({ message: "Fill all fields" });
    } else {
      var data = {
        name: name,
        mobile: mobile,
        email: email,
        address: address,
        country: country,
        zipcode: zipcode,
        city: city,
        state: state,
      };

      var user_location_data = this.props.user_location_data;
      var deliveryaddress =
        user_location_data.deliveryaddress &&
        user_location_data.deliveryaddress != null
          ? user_location_data.deliveryaddress
          : [];

      deliveryaddress.push(data);
      user_location_data.deliveryaddress = deliveryaddress;
      user_location_data.currentaddress = data;
      await this.props.updateUserLocation(user_location_data);
      await AsyncStorage.setItem(
        "user_location_data",
        JSON.stringify(user_location_data)
      );
      this.setState({
        show_newaddress: false,
        textinput_name: "",
        textinput_mobile: "",
        textinput_email: "",
        textinput_address: "",
        textinput_country: "",
        textinput_zipcode: "",
        textinput_city: "",
        textinput_state: "",
      });
    }
    this.setState({ loading: false });
  };
  shippingAddress = () => {
    return (
      <View
        style={{
          minHeight: 40,
          backgroundColor: AppColors.white,
          margin: 10,
          marginHorizontal: 30,
          marginTop: 5,
          padding: 5,
        }}
      >
        <AppText style={[AppFonts.h2_bold, { marginLeft: 10 }]}>
          ADD Address
        </AppText>
        <TextInput
          style={{
            height: 35,
            borderWidth: 1,
            borderColor: AppColors.grey99,
            margin: 10,
            paddingLeft: 10,
            backgroundColor: AppColors.white,
          }}
          onChangeText={(text) => {
            this.setState({ textinput_name: text });
          }}
          onSubmitEditing={() => {
            this.refs.textinput_mobile.focus();
          }}
          value={this.state.textinput_name}
          placeholder="Name"
        ></TextInput>
        <TextInput
          ref={"textinput_mobile"}
          onSubmitEditing={() => {
            this.refs.textinput_email.focus();
          }}
          style={{
            height: 35,
            borderWidth: 1,
            borderColor: AppColors.grey99,
            margin: 10,
            paddingLeft: 10,
            backgroundColor: AppColors.white,
          }}
          keyboardType="number-pad"
          onChangeText={(text) => {
            this.setState({ textinput_mobile: text });
          }}
          value={this.state.textinput_mobile}
          placeholder="Mobile"
        ></TextInput>
        <TextInput
          ref={"textinput_email"}
          onSubmitEditing={() => {
            this.refs.textinput_address.focus();
          }}
          style={{
            height: 35,
            borderWidth: 1,
            borderColor: AppColors.grey99,
            margin: 10,
            paddingLeft: 10,
            backgroundColor: AppColors.white,
          }}
          keyboardType="email-address"
          onChangeText={(text) => {
            this.setState({ textinput_email: text });
          }}
          value={this.state.textinput_email}
          placeholder="E-mail"
        ></TextInput>
        <TextInput
          ref={"textinput_address"}
          onSubmitEditing={() => {
            this.refs.textinput_country.focus();
          }}
          style={{
            minHeight: 35,
            borderWidth: 1,
            borderColor: AppColors.grey99,
            margin: 10,
            paddingLeft: 10,
            backgroundColor: AppColors.white,
          }}
          multiline={true}
          onChangeText={(text) => {
            this.setState({ textinput_address: text });
          }}
          value={this.state.textinput_address}
          placeholder="Address"
        ></TextInput>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            ref={"textinput_country"}
            onSubmitEditing={() => {
              this.refs.textinput_zipcode.focus();
            }}
            style={{
              height: 35,
              flex: 1,
              borderWidth: 1,
              borderColor: AppColors.grey99,
              margin: 10,
              paddingLeft: 10,
              backgroundColor: AppColors.white,
            }}
            onChangeText={(text) => {
              this.setState({ textinput_country: text });
            }}
            value={this.state.textinput_country}
            placeholder="Country"
          ></TextInput>
          <TextInput
            ref={"textinput_zipcode"}
            onSubmitEditing={() => {
              this.refs.textinput_city.focus();
            }}
            style={{
              height: 35,
              borderWidth: 1,
              flex: 1,
              borderColor: AppColors.grey99,
              margin: 10,
              paddingLeft: 10,
              backgroundColor: AppColors.white,
            }}
            keyboardType={"number-pad"}
            onChangeText={(text) => {
              this.setState({ textinput_zipcode: text });
            }}
            value={this.state.textinput_zipcode}
            placeholder="Zipcode"
          ></TextInput>
        </View>
        <TextInput
          ref={"textinput_city"}
          onSubmitEditing={() => {
            this.refs.textinput_state.focus();
          }}
          style={{
            height: 35,
            borderWidth: 1,
            borderColor: AppColors.grey99,
            margin: 10,
            paddingLeft: 10,
            backgroundColor: AppColors.white,
          }}
          onChangeText={(text) => {
            this.setState({ textinput_city: text });
          }}
          value={this.state.textinput_city}
          placeholder="City"
        ></TextInput>
        <TextInput
          ref={"textinput_state"}
          style={{
            height: 35,
            borderWidth: 1,
            borderColor: AppColors.grey99,
            margin: 10,
            paddingLeft: 10,
            backgroundColor: AppColors.white,
          }}
          onChangeText={(text) => {
            this.setState({ textinput_state: text });
          }}
          onSubmitEditing={() => {
            this.onPlaceOrder();
          }}
          value={this.state.textinput_state}
          placeholder="State"
        ></TextInput>
        <TouchableOpacity
          onPress={() => {
            this.changeCurrentAddress();
          }}
          style={{
            height: 35,
            backgroundColor: AppColors.secondary,
            margin: 10,
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
    backgroundColor: AppColors.background,
    marginTop: Constants.statusBarHeight,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Account);
