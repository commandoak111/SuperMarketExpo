import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  AsyncStorage,
  FlatList,
  Image,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
} from "react-native";
import moment from "moment";
import Constants from "expo-constants";
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
import StickyParalaxHeader from "react-native-sticky-parallax-header";

let TAG = "DeliveryAddress ";
import MapView, { Marker } from "react-native-maps";

import ModalV1 from "react-native-modal";

import { connect } from "react-redux";
import { AppColors, AppFonts } from "../../../theme/index";
import { Actions } from "react-native-router-flux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import * as UserActions from "../../../redux/user/actions";
import { AppText, Loader, AppAlert } from "../../../components/ui/index";
import { TextInput, ScrollView } from "react-native-gesture-handler";

const mapStateToProps = (state) => ({
  user_favorite: state.user.user_favorite,
  user_basket: state.user.user_market_basket,
  user_location_data: state.user.user_location_data,
  user_orders: state.user.user_orders,
  user_market_orders: state.user.user_market_orders,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updateUserFavorites: UserActions.updateUserFavorites,
  updateUserMarketBasket: UserActions.updateUserMarketBasket,
  updateUserLocation: UserActions.updateUserLocation,
  createOrder: UserActions.createOrder,
  updateUserMarketOrders: UserActions.updateUserMarketOrders,
  addUserAddress: UserActions.addUserAddress,
  getUserAddress: UserActions.getUserAddress,
  placeOrder: UserActions.placeOrder,
};
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const marginAnim = new Animated.Value(200);
class DeliveryAddress extends React.Component {
  constructor(props) {
    super(props);

    Animated.timing(marginAnim, {
      toValue: 0,
      duration: 600,
    }).start();

    this.state = {
      new_address: false,
      show_map: false,
      show_continue: false,
      loading: false,
      show_order_placed: false,
      selected_slot: { id: -1, name: "" },
      textinput_deliveryinstruction: null,
      // textinput_name: "",
      // textinput_mobile: "",
      // textinput_door: "",
      // textinput_street: "",
      // textinput_area: "",
      // textinput_landmark: "",
      // textinput_town: "",
      // textinput_city: "",
      // textinput_state: "",
    };
  }
  componentDidMount = async () => {
    //  this.getCurrentLocation();
    this.getData();
  };
  componentWillUnmount = async () => {
    if (this.props.callBack) {
      await this.props.callBack();
    }
  };
  getCurrentLocation = async () => {
    this.setState({ loading: true });
    if (Platform.OS === "android" && !Constants.isDevice) {
      // permission not granted
    } else {
      let status = await Permissions.askAsync(Permissions.LOCATION);
      if (status.status !== "granted") {
        console.log(TAG + " location status  :  ", status);
      } else {
        let locationv1 = await Location.getCurrentPositionAsync();
        var location = {
          latitude: locationv1.coords.latitude,
          longitude: locationv1.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        var localaddress = await Location.reverseGeocodeAsync(location);
        var user_location_data = localaddress[0];
        this.setState({
          current_location: user_location_data,
          textinput_zipcode: user_location_data.postalCode,
          textinput_state: user_location_data.region,
          textinput_address: user_location_data.street,
          textinput_city: user_location_data.city,
        });
        this.setState({ location, picked_location: location });
      }
    }
    this.setState({ loading: false });
  };
  getLocationUsingLatLng = async (lat, lng) => {
    this.setState({ loading: true });
    var location = {
      latitude: lat,
      longitude: lng,
    };
    var localaddress = await Location.reverseGeocodeAsync(location);
    var user_location_data = localaddress[0];
    var comma = user_location_data.name != null ? " ," : "";
    this.setState({
      current_location: user_location_data,
      textinput_zipcode: user_location_data.postalCode,
      textinput_state: user_location_data.region,
      textinput_address: user_location_data.street,
      textinput_city: user_location_data.city,
      loading: false,
    });
    console.log("location on drag get location using lat ", user_location_data);
  };
  keyExtractor = (item, index) => index.toString();
  onRegionChange = (region) => {
    this.setState({ location: region });
  };
  getData = async () => {
    this.setState({ loading: true });
    var user_basket = this.props.user_basket.slice(0);
    var resp = await this.props.getUserAddress();
    var user_location_data = resp.data;
    // store data
    var storedata = this.props.user_location_data.store_data[2];

    console.log(user_location_data);
    this.setState({
      textinput_country: user_location_data.country,
      textinput_zipcode: user_location_data.postalCode,
      textinput_state: user_location_data.region,
    });
    if (user_location_data) {
      var address = user_location_data;
      if (address == null || address.length == 0) {
        this.setState({ new_address: true });
      }
      this.setState({
        textinput_name: address.name,
        textinput_mobile: address.mobile,
        textinput_email: address.email,
        textinput_address: address.address,
        textinput_country: address.country,
        textinput_zipcode: address.zipcode,
        textinput_city: address.city,
        textinput_state: address.state,
        saved_address: address,
        storedata,
      });
      console.log(
        TAG + " pre address  :  ",
        address,
        user_basket,
        this.props.user_location_data
      );
    }
    this.setState({ user_basket });
    this.setState({ loading: false });
  };
  renderHeader = () => {
    return (
      <View style={styles.render_header}>
        <Ionicons
          onPress={() => Actions.pop()}
          name="md-arrow-back"
          size={25}
          color={AppColors.white}
          style={{ marginHorizontal: 10 }}
        />
        <View
          style={{
            height: 40,
            justifyContent: "center",
            marginLeft: 10,
            flex: 1,
          }}
        >
          <AppText style={[AppFonts.h3_bold, { color: AppColors.white }]}>
            Delivery Address
          </AppText>
        </View>
      </View>
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
          <TouchableOpacity
            onPress={() => {
              this.setState({
                selected_type: "Home",
              });
            }}
            style={{ flex: 0.3, flexDirection: "row", alignItems: "center" }}
          >
            {this.state.selected_type != "Home" ? (
              <FontAwesome
                name="circle-o"
                size={18}
                color={AppColors.primary}
                style={{ marginRight: 5 }}
              />
            ) : (
              <AntDesign
                name="checkcircle"
                size={16}
                color={AppColors.secondary}
                style={{ marginRight: 5 }}
              />
            )}
            <AppText
              style={[
                AppFonts.h4,
                {
                  color:
                    this.state.selected_type != "Home"
                      ? AppColors.primary
                      : AppColors.secondary,
                },
              ]}
            >
              Home
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                selected_type: "Office",
              });
            }}
            style={{ flex: 0.3, flexDirection: "row", alignItems: "center" }}
          >
            {this.state.selected_type != "Office" ? (
              <FontAwesome
                name="circle-o"
                size={18}
                color={AppColors.primary}
                style={{ marginRight: 5 }}
              />
            ) : (
              <AntDesign
                name="checkcircle"
                size={16}
                color={AppColors.secondary}
                style={{ marginRight: 5 }}
              />
            )}
            <AppText
              style={[
                AppFonts.h4,
                {
                  color:
                    this.state.selected_type != "Office"
                      ? AppColors.primary
                      : AppColors.secondary,
                },
              ]}
            >
              Office
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                selected_type: "Other",
              });
            }}
            style={{ flex: 0.3, flexDirection: "row", alignItems: "center" }}
          >
            {this.state.selected_type != "Other" ? (
              <FontAwesome
                name="circle-o"
                size={18}
                color={AppColors.primary}
                style={{ marginRight: 5 }}
              />
            ) : (
              <AntDesign
                name="checkcircle"
                size={16}
                color={AppColors.secondary}
                style={{ marginRight: 5 }}
              />
            )}
            <AppText
              style={[
                AppFonts.h4,
                {
                  color:
                    this.state.selected_type != "Other"
                      ? AppColors.primary
                      : AppColors.secondary,
                },
              ]}
            >
              Other
            </AppText>
          </TouchableOpacity>
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
                this.onsaveAddress();
              }}
              value={this.state.textinput_type}
              // placeholder="State"
            ></TextInput>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            this.onsaveAddress();
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
  onDeleteAddress = async (item) => {
    var user_location_data = this.props.user_location_data;
    var deliveryaddress =
      user_location_data.deliveryaddress &&
      user_location_data.deliveryaddress.slice(0);
    var saved_address = this.state.saved_address.slice(0);
    var index = saved_address.findIndex((v) => {
      return item == v;
    });
    if (index != -1) {
      console.log(
        "deleted entered index ",
        index,
        saved_address,
        deliveryaddress,
        user_location_data
      );

      deliveryaddress.splice(index, 1);
      user_location_data.deliveryaddress = deliveryaddress;
      this.setState({ saved_address: deliveryaddress });
      await this.props.updateUserLocation(user_location_data);
      await AsyncStorage.setItem(
        "user_location_data",
        JSON.stringify(user_location_data)
      );
    }
  };
  onsaveAddress = async () => {
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
    var selected_slot = this.state.selected_slot;
    var email_sample = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
    if (!name) {
      AppAlert({ message: "Enter name" });
    } else if (!mobile) {
      AppAlert({ message: "Enter mobile no" });
      // } else if (!email.match(email_sample)) {
      //   AppAlert({ message: "Enter valid email" });
    } else if (!door || !street || !area || !landmark || !town || !city) {
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
      try {
        var resp = await this.props.addUserAddress(data);
        var user_location_data = this.props.user_location_data;
        // var deliveryaddress =
        //   user_location_data.deliveryaddress &&
        //   user_location_data.deliveryaddress != null
        //     ? user_location_data.deliveryaddress
        //     : [];

        var deliveryaddress = resp.data;
        // deliveryaddress.push(resp.data);
        // deliveryaddress.push(data);
        user_location_data.deliveryaddress = deliveryaddress;
        if (deliveryaddress.length == 1) {
          user_location_data.currentaddress = deliveryaddress[0];
        }

        var pre_savedaddress = deliveryaddress;

        await this.props.updateUserLocation(user_location_data);
        await AsyncStorage.setItem(
          "user_location_data",
          JSON.stringify(user_location_data)
        );

        this.setState({
          new_address: false,
          saved_address: pre_savedaddress,
          textinput_name: "",
          textinput_mobile: "",
          textinput_email: "",
          textinput_address: "",
          textinput_country: "",
          textinput_zipcode: "",
          textinput_city: "",
          textinput_state: "",
        });
      } catch (error) {
        console.log(TAG + " onsave address  :  error  :  ", error);
      }
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  };

  finishOrder = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.onPlaceOrder();
        }}
        style={{ minHeight: 40, backgroundColor: AppColors.secondary }}
      >
        <AppText
          style={[
            AppFonts.h3bold,
            { textAlign: "center", margin: 10, color: AppColors.white },
          ]}
        >
          PLACE ORDER
        </AppText>
      </TouchableOpacity>
    );
  };

  onPlaceOrder = async () => {
    this.setState({ loading: true });
    var selected_slot = this.state.selected_slot;
    if (this.state.selected_address != null) {
      if (selected_slot.id == -1) {
        AppAlert({ message: "Select slot" });
      } else {
        var selected_address = this.state.selected_address;
        // var deliveryaddress = {
        //   name: selected_address.name,
        //   mobile: selected_address.mobile,
        //   email: selected_address.email,
        //   address: selected_address.address,
        //   country: selected_address.country,
        //   zipcode: selected_address.zipcode,
        //   city: selected_address.city,
        //   state: selected_address.state,
        // };
        await this.createNewOrder(selected_address);
        this.setState({
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
    } else {
      AppAlert({ message: "Select delivery address" });
    }
    this.setState({ loading: false });
  };
  createNewOrder = async (deliveryaddress) => {
    var user_basket = this.state.user_basket.slice(0);
    var totalqty = 0;
    var totalamount = 0;
    user_basket.forEach((v, k) => {
      totalqty += v.qty;
      totalamount += v.selected_weight.unitprice * v.qty;
      user_basket[k].unitprice = v.selected_weight.unitprice;
      user_basket[k].unitmrp = v.selected_weight.unitmrp;
      user_basket[k].unitvalue = v.selected_weight.unitvalue;
    });
    var user_market_orders =
      this.props.user_market_orders != null
        ? this.props.user_market_orders
        : [];
    var data = {
      Item: {
        delivery: this.state.selected_slot,
        address: deliveryaddress,
        shop: this.state.storedata,
        products: user_basket,
        qty: totalqty,
        total: totalamount,
        instruction: this.state.textinput_deliveryinstruction,
        // date: moment().utc().local().format("lll"),
      },
    };
    console.log(TAG + " create new order  :  data :  ", data);
    try {
      var resp = await this.props.placeOrder(data);
      this.setState({ orderdetails: resp.data });
      // // order_data.push(resp.data.order);
      // user_market_orders.push(data);
      // await this.props.updateUserMarketOrders(user_market_orders);
      // //   console.log(TAG + " create new order  :  resp :  ", resp);
      // await AsyncStorage.setItem(
      //   "user_market_orders",
      //   JSON.stringify(user_market_orders)
      // );
      await this.props.updateUserMarketBasket([]);
      await AsyncStorage.setItem("user_market_basket", JSON.stringify([]));
      // // await Actions.S_App({ type: "reset" });
      this.sendPushNotification();
      this.setState({ show_order_placed: true });
      // // AppAlert({
      // //   message:
      // //     ` Success...
      // // OrderID:` + JSON.stringify(resp.data.order._id),
      // // });
    } catch (error) {
      console.log(TAG + " create new order  :  resp :  error", error);
    }
  };
  savesAddress = () => {
    return (
      <View style={{ minHeight: 40, marginTop: 10 }}>
        <View
          style={{
            minHeight: 30,
            borderWidth: 0.3,
            borderBottomWidth: 0.1,
            marginHorizontal: 10,
            marginTop: 5,
            paddingBottom: 8,
            padding: 10,
          }}
        >
          <AppText style={[AppFonts.h3]}>Delivery Address</AppText>
        </View>
        <FlatList
          contentContainerStyle={{
            borderWidth: 0.2,
            borderBottomWidth: 0,
            elevation: 5,
            borderColor: AppColors.grey,
            paddingRight: 0.2,
            marginHorizontal: 10,
            marginBottom: 10,
            backgroundColor: AppColors.background,
          }}
          data={this.state.saved_address}
          renderItem={this.savedAddressView}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
        ></FlatList>
        <TouchableOpacity
          onPress={() => {
            this.setState({ new_address: true });
            // Actions.NewAddress({
            //   callBack: () => this.getData(),
            // });
          }}
          style={{
            height: 35,
            marginTop: 5,
            margin: 10,
            backgroundColor: AppColors.secondary,
            justifyContent: "center",
          }}
        >
          <AppText
            style={[
              AppFonts.h4_bold,
              { textAlign: "center", color: AppColors.white },
            ]}
          >
            ADD NEW ADDRESS
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };
  savedAddressView = ({ item }) => {
    var addr = this.state.selected_address && this.state.selected_address;
    if (item == addr) {
      var checked = true;
    } else {
      var checked = false;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          if (checked) {
            this.setState({ selected_address: null });
          } else {
            this.setState({ selected_address: item });
          }
        }}
        activeOpacity={0.7}
        onLongPress={() => {
          AppAlert({
            message: "Are you sure?",
            options: [
              {
                text: "NO",
                onPress: () => {
                  return null;
                },
              },
              {
                text: "YES",
                onPress: () => {
                  this.onDeleteAddress(item);
                },
              },
            ],
          });
        }}
        style={{
          minHeight: 80,
          backgroundColor:
            checked == true ? AppColors.lightpink : AppColors.white,
          borderBottomWidth: 0.1,
          elevation: 5,
          marginBottom: 0.4,
          padding: 10,
        }}
      >
        <AppText style={[AppFonts.h3]}>{item.contact}</AppText>
        <AppText style={[AppFonts.h4, { fontFamily: "Montserrat_Light" }]}>
          {item.door}
          {", "}
          {item.street}
          {" ,"}
          {item.area}
          {" ,"}
          {item.landmark}
          {", "}
          {item.town}
          {", "}
          {item.city}
        </AppText>
        <AppText style={[AppFonts.h4, { fontFamily: "Montserrat_Light" }]}>
          {item.contactno}
        </AppText>
        <AppText style={[AppFonts.h4, { fontFamily: "Montserrat_Light" }]}>
          {item.type}
        </AppText>

        {checked == true ? (
          <MaterialCommunityIcons
            onPress={async () => {
              await this.setState({ selected_address: null });
            }}
            style={{ position: "absolute", bottom: 10, right: 10 }}
            name={"checkbox-marked"}
            size={25}
            color={AppColors.secondary}
          />
        ) : (
          <MaterialCommunityIcons
            onPress={async () =>
              await this.setState({ selected_address: item })
            }
            style={{ position: "absolute", bottom: 10, right: 10 }}
            name={"checkbox-blank-outline"}
            size={25}
            color={AppColors.secondary}
          />
        )}
      </TouchableOpacity>
    );
  };
  orderTotal = () => {
    var item = this.props.user_basket.slice(0);
    var amount = 0;
    var mrp = 0;
    var totalqty = 0;
    item.forEach((v) => {
      amount += v.qty * v.selected_weight.unitprice;
      mrp += v.qty * v.selected_weight.unitmrp;
      totalqty += v.qty;
    });
    var deliverycharge = mrp - amount;
    return (
      <View
        style={{
          minHeight: 60,
          marginHorizontal: 10,
          // backgroundColor: "#99ffff",
          backgroundColor: AppColors.white,
          marginTop: 10,
          borderWidth: 0.5,
          padding: 10,
          elevation: 10,
          // flexDirection: "row",
          // justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 5,
            justifyContent: "space-between",
          }}
        >
          <AppText style={[AppFonts.h4, { color: AppColors.primary }]}>
            Total:
          </AppText>
          <AppText style={[AppFonts.h4, { color: AppColors.primary }]}>
            ₹ {amount}
          </AppText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 5,
            marginBottom: 5,
            justifyContent: "space-between",
          }}
        >
          <AppText style={[AppFonts.h4, { color: AppColors.primary }]}>
            Delivery fee:
          </AppText>
          <AppText style={[AppFonts.h4, { color: AppColors.red }]}>
            ₹ {deliverycharge}
          </AppText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopWidth: 0.6,
            borderBottomWidth: 0.6,
            paddingVertical: 8,
            marginBottom: 5,
            borderColor: AppColors.primary,
          }}
        >
          <AppText style={[AppFonts.h4, { color: AppColors.primary }]}>
            Amount to pay:
          </AppText>
          <AppText style={[AppFonts.h4, { color: AppColors.green }]}>
            ₹ {amount + deliverycharge}
          </AppText>
        </View>
        {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText style={[AppFonts.h3_bold, { color: AppColors.white }]}>
            Total :{" "}
          </AppText>
          <AppText style={[AppFonts.h4, { color: AppColors.white }]}>
            ₹ {amount}
          </AppText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText style={[AppFonts.h4, { color: AppColors.white }]}>
            {totalqty}
          </AppText>
          <AppText style={[AppFonts.h3_bold, { color: AppColors.white }]}>
            {" "}
            : Quantity
          </AppText>
        </View> */}
      </View>
    );
  };
  mapView = () => {
    return (
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <MapView
          onMapReady={() => this.setState({ loading: false })}
          style={[styles.map, { flex: 1 }]}
          onPress={(e) => {
            this.setState({ picked_location: e.nativeEvent.coordinate });
            var lat = e.nativeEvent.coordinate.latitude;
            var lng = e.nativeEvent.coordinate.longitude;
            this.getLocationUsingLatLng(lat, lng);
          }}
          onLongPress={(e) => {
            this.setState({ picked_location: e.nativeEvent.coordinate });
            var lat = e.nativeEvent.coordinate.latitude;
            var lng = e.nativeEvent.coordinate.longitude;
            this.getLocationUsingLatLng(lat, lng);
          }}
          mapType={Platform.OS == "android" ? "standard" : "standard"}
          initialRegion={this.state.location}
          onRegionChange={this.onRegionChange}
        >
          <Marker coordinate={this.state.picked_location} />
        </MapView>
        {this.state.current_location && (
          <View
            style={{
              // position: "absolute",
              // bottom: 0,
              // left: 0,
              // flex:1,
              // width: SCREEN_WIDTH,
              height: SCREEN_WIDTH / 2,
              backgroundColor: AppColors.primary,
              justifyContent: "space-evenly",
              paddingVertical: 10,
              borderWidth: 1,
            }}
          >
            <AppText
              style={[
                AppFonts.h3bold,
                {
                  color: AppColors.white,
                  textAlign: "left",
                  marginLeft: 20,
                },
              ]}
            >
              Drop pin to select delivery address
            </AppText>
            <View
              style={{
                height: 40,
                marginHorizontal: 20,
                borderWidth: 1,
                borderColor: AppColors.white,
                borderRadius: 10,
                paddingHorizontal: 10,
                justifyContent: "center",
              }}
            >
              <AppText
                style={[AppFonts.h4_light, { color: AppColors.white }]}
                numberOfLines={1}
              >
                {this.state.current_location.name}
                {","}
                {this.state.current_location.street}
                {","}
                {this.state.current_location.city}
                {","}
                {this.state.current_location.region}
                {","}
                {this.state.current_location.postalCode}
              </AppText>
            </View>
            <AppText
              style={[
                AppFonts.h4bold,
                {
                  color: AppColors.white,
                  textAlign: "left",
                  marginLeft: 20,
                },
              ]}
            >
              CITY : {this.state.current_location.city}
              {this.state.current_location.city != null ? "," : ""}
              {this.state.current_location.region}
            </AppText>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  show_continue: false,
                  show_map: false,
                  new_address: true,
                });
              }}
              style={{
                height: 40,
                marginHorizontal: 20,
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: AppColors.secondary,
                justifyContent: "center",
              }}
            >
              <AppText
                style={[
                  AppFonts.h4bold,
                  {
                    color: AppColors.primary,
                    textAlign: "center",
                  },
                ]}
              >
                Continue
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        {this.state.current_location && (
          <TouchableOpacity
            onPress={() => {
              this.setState({ show_map: false, new_address: true });
            }}
            style={{
              height: 25,
              paddingHorizontal: 10,
              paddingRight: 5,
              backgroundColor: AppColors.primary,
              position: "absolute",
              top: 20,
              right: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText style={[AppFonts.h4bold, { color: AppColors.white }]}>
              SKIP
            </AppText>
            <AntDesign name="right" size={15} color={AppColors.white} />
            <AntDesign
              name="right"
              size={15}
              color={AppColors.white}
              style={{ marginLeft: -8 }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  orderSuccessView = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            height: SCREEN_WIDTH / 1.5,
            width: SCREEN_WIDTH / 1.3,
            backgroundColor: AppColors.white,
            justifyContent: "space-evenly",
            padding: 20,
          }}
        >
          <FontAwesome
            name="check-circle"
            size={60}
            color={AppColors.green}
            style={{ alignSelf: "center" }}
          />
          <AppText
            style={[
              AppFonts.h1bold,
              { color: AppColors.green, textAlign: "center" },
            ]}
          >
            Thank You
          </AppText>
          <AppText
            style={[
              AppFonts.h3_bold,
              { color: AppColors.green, textAlign: "center" },
            ]}
          >
            Thank You For Shopping
          </AppText>
          <AppText
            style={[
              AppFonts.h4bold,
              { color: AppColors.green, textAlign: "center" },
            ]}
          >
            Order ID :
          </AppText>

          <TouchableOpacity
            onPress={() => {
              this.setState({ show_order_placed: false });
              Actions.S_App({ type: "reset" });
            }}
            style={{
              height: 30,
              justifyContent: "center",
              marginHorizontal: 20,
              marginVertical: 10,
              backgroundColor: AppColors.green,
              borderWidth: 0.5,
              borderColor: AppColors.white,
            }}
          >
            <AppText
              style={[
                AppFonts.h4bold,
                { color: AppColors.white, textAlign: "center" },
              ]}
            >
              Continue Shopping
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  deliverySlotView = () => {
    var slot_data = [
      { id: 1, name: "6AM-8AM" },
      { id: 2, name: "9AM-10AM" },
      { id: 3, name: "11AM-12PM" },
      { id: 4, name: "1PM-2PM" },
      { id: 5, name: "3PM-4PM" },
      { id: 6, name: "5PM-7PM" },
      { id: 7, name: "9PM-10PM" },
    ];
    var selected_slot = this.state.selected_slot;
    return (
      <View
        style={{
          minHeight: 50,
          marginHorizontal: 10,
          marginTop: 10,
          elevation: 5,
          padding: 10,
          borderWidth: 0.2,
          backgroundColor: AppColors.white,
        }}
      >
        <View
          style={{
            height: 30,
            borderBottomWidth: 0.2,
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <AppText style={[AppFonts.h3]}>Delivery slot</AppText>
        </View>
        <FlatList
          numColumns={3}
          data={slot_data}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    selected_slot: item,
                  });
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: SCREEN_WIDTH / 3 - 5,
                  marginBottom: 5,
                }}
              >
                {selected_slot && selected_slot.id != item.id ? (
                  <Entypo
                    name="circle"
                    size={18}
                    color={AppColors.primary}
                    style={{ marginRight: 5 }}
                  />
                ) : (
                  <AntDesign
                    name="checkcircle"
                    size={18}
                    color={AppColors.secondary}
                    style={{ marginRight: 5 }}
                  />
                )}
                <AppText
                  style={[
                    selected_slot && selected_slot.id != item.id
                      ? AppFonts.h4
                      : AppFonts.h4bold,
                    {
                      color:
                        selected_slot && selected_slot.id != item.id
                          ? AppColors.primary
                          : AppColors.secondary,
                    },
                  ]}
                >
                  {item.name}
                </AppText>
              </TouchableOpacity>
            );
          }}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  deliveryInstructionView = () => {
    return (
      <View
        style={{
          minHeight: 50,
          marginHorizontal: 10,
          marginTop: 10,
          elevation: 5,
          padding: 10,
          borderWidth: 0.2,
          backgroundColor: AppColors.white,
        }}
      >
        <AppText style={[AppFonts.h3, { marginBottom: 0 }]}>
          Delivery Instructions
        </AppText>
        <TextInput
          value={this.state.textinput_deliveryinstruction}
          placeholder={"type here"}
          onChangeText={(text) => {
            this.setState({ textinput_deliveryinstruction: text });
          }}
          multiline={true}
          style={{
            ...AppFonts.h4,
            minHeight: 40,
            borderWidth: 0.5,
            paddingLeft: 10,
            marginVertical: 10,
          }}
        ></TextInput>
      </View>
    );
  };
  sendPushNotification = async () => {
    // var expoPushToken = await AsyncStorage.getItem("expoPushToken");
    var expoPushToken = ExponentPushToken[rWgVIKNQyLnTqqTeEVBWDu];

    var data = this.state.orderdetails;
    this.setState({ loading: true });
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Order",
      body:
        data.customername +
        " placed order with id " +
        data.orderno +
        " is waiting for approval",
      data: { data: "goes here" },
      _displayInForeground: true,
    };
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    this.setState({ loading: false });
  };
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="position" enabled>
          <ScrollView>
            {this.state.user_basket && this.orderTotal()}
            {this.deliverySlotView()}
            {this.deliveryInstructionView()}
            {/* {(this.state.saved_address && this.state.saved_address) ||
            (this.state.selected_address && this.state.saved_address) ||
            (this.state.new_address == false && this.state.saved_address)
              ? this.savesAddress()
              : null} */}
            {this.state.saved_address && this.savesAddress()}
          </ScrollView>
        </KeyboardAvoidingView>

        {this.finishOrder()}
        <Modal
          transparent={true}
          animationType="slide"
          visible={this.state.new_address}
          onRequestClose={() => this.setState({ new_address: false })}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
              {this.shippingAddress()}
            </KeyboardAvoidingView>
          </View>
        </Modal>
        <ModalV1
          transparent={true}
          animationIn={"bounceIn"}
          animationOut={"bounceOut"}
          isVisible={this.state.show_order_placed}
          onBackButtonPress={() => {}}
        >
          {this.orderSuccessView()}
        </ModalV1>
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
    paddingTop: Constants.statusBarHeight,
    backgroundColor: AppColors.secondary,
    borderWidth: 0.5,
    borderTopWidth: 0,
    borderColor: AppColors.grey,
    flexDirection: "row",
    alignItems: "center",
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

  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(DeliveryAddress);
