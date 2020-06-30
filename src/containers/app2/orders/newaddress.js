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
import Constants from "expo-constants";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import StickyParalaxHeader from "react-native-sticky-parallax-header";

let TAG = "NewAddress ";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

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
  createAddress: UserActions.createAddress,
};
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const marginAnim = new Animated.Value(200);
class NewAddress extends React.Component {
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
      // textinput_name: "",
      // textinput_mobile: "",
      // textinput_email: "",
      // textinput_address: "",
      // textinput_country: "",
      // textinput_zipcode: "",
      // textinput_city: "",
      // textinput_state: "",
    };
  }
  componentDidMount = async () => {
    await this.getCurrentLocation();
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
        var location1 = {
          latitude: locationv1.coords.latitude,
          longitude: locationv1.coords.longitude,
        };
        var localaddress = await Location.reverseGeocodeAsync(location1);
        var user_location_data = localaddress[0];
        this.setState({
          current_location: user_location_data,
          textinput_zipcode: user_location_data.postalCode,
          textinput_state: user_location_data.region,
          textinput_address: user_location_data.street,
          textinput_city: user_location_data.city,
        });
        this.setState({ location, picked_location: location1 });
      }
    }
    this.setState({ loading: false });
  };
  getLocationUsingLatLng = async (lat, lng) => {
    await this.setState({ loading: true });
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
    var user_location_data = this.props.user_location_data;
    console.log(user_location_data);
    this.setState({
      textinput_country: user_location_data.country,
      textinput_zipcode: user_location_data.postalCode,
      textinput_state: user_location_data.region,
    });
    if (user_location_data && user_location_data.deliveryaddress) {
      var address = user_location_data.deliveryaddress;
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
      });
      console.log(TAG + " pre address  :  ", address, user_basket);
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
            Select Location
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
        <View style={styles.textinput_style}>
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
        <View style={styles.textinput_style}>
          <TextInput
            ref={"textinput_mobile"}
            onSubmitEditing={() => {
              this.refs.textinput_email.focus();
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
        <AppText
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
        </AppText>
        <View style={styles.textinput_style}>
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
        </View>
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
          Address1*
        </AppText>
        <View style={styles.textinput_style}>
          <TextInput
            ref={"textinput_address"}
            onSubmitEditing={() => {
              this.refs.textinput_country.focus();
            }}
            style={styles.font_textinput}
            // multiline={true}
            onChangeText={(text) => {
              this.setState({ textinput_address: text });
            }}
            value={this.state.textinput_address}
            // placeholder="Address"
          ></TextInput>
        </View>
        <View style={{}}>
          <View style={styles.textinput_style}>
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
              Address2*
            </AppText>

            <TextInput
              ref={"textinput_country"}
              onSubmitEditing={() => {
                this.refs.textinput_zipcode.focus();
              }}
              style={styles.font_textinput}
              onChangeText={(text) => {
                this.setState({ textinput_country: text });
              }}
              value={this.state.textinput_country}
              // placeholder="Country"
            ></TextInput>
          </View>
          <View style={styles.textinput_style}>
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
              Zipcode*
            </AppText>
            <TextInput
              ref={"textinput_zipcode"}
              onSubmitEditing={() => {
                this.refs.textinput_city.focus();
              }}
              style={styles.font_textinput}
              keyboardType={"number-pad"}
              onChangeText={(text) => {
                this.setState({ textinput_zipcode: text });
              }}
              value={this.state.textinput_zipcode}
              // placeholder="Zipcode"
            ></TextInput>
          </View>
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
        <View style={styles.textinput_style}>
          <TextInput
            ref={"textinput_city"}
            onSubmitEditing={() => {
              this.refs.textinput_state.focus();
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
          State*
        </AppText>
        <View style={styles.textinput_style}>
          <TextInput
            ref={"textinput_state"}
            style={styles.font_textinput}
            onChangeText={(text) => {
              this.setState({ textinput_state: text });
            }}
            onSubmitEditing={() => {
              this.onPlaceOrder();
            }}
            value={this.state.textinput_state}
            // placeholder="State"
          ></TextInput>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.onsaveAddress();
          }}
          style={{
            position: "absolute",
            bottom: 30,
            left: 20,
            height: 35,
            width: "100%",
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
        address: address + " ," + country,
        // country: country,
        zipcode: zipcode,
        city: city,
        state: state,
      };
      try {
        // var resp = await this.props.createAddress(data);
        var user_location_data = this.props.user_location_data;
        var deliveryaddress =
          user_location_data.deliveryaddress &&
          user_location_data.deliveryaddress != null
            ? user_location_data.deliveryaddress
            : [];

        // deliveryaddress.push(resp.data.address);
        deliveryaddress.push(data);
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

        await this.setState({
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
        Actions.pop();
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
    if (this.state.selected_address != null) {
      var selected_address = this.state.selected_address;
      var deliveryaddress = {
        name: selected_address.name,
        mobile: selected_address.mobile,
        email: selected_address.email,
        address: selected_address.address,
        country: selected_address.country,
        zipcode: selected_address.zipcode,
        city: selected_address.city,
        state: selected_address.state,
      };
      await this.createNewOrder(deliveryaddress);
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
    } else {
      AppAlert({ message: "Select delivery address" });
    }
    this.setState({ loading: false });
  };
  createNewOrder = async (deliveryaddress) => {
    var user_basket = this.state.user_basket.slice(0);
    var totalqty = 0;
    var totalamount = 0;
    user_basket.forEach((v) => {
      totalqty += v.qty;
      totalamount += v.selected_weight.unitprice * v.qty;
    });
    var user_market_orders =
      this.props.user_market_orders != null
        ? this.props.user_market_orders
        : [];
    var data = {
      items: user_basket,
      totalqty: totalqty,
      amount: totalamount,
      name: deliveryaddress.name,
      mobile: deliveryaddress.mobile,
      email: deliveryaddress.email,
      address: deliveryaddress.address,
      country: deliveryaddress.country,
      zipcode: deliveryaddress.zipcode,
      city: deliveryaddress.city,
      state: deliveryaddress.state,
    };
    console.log(TAG + " create new order  :  data :  ", data);
    try {
      // var resp = await this.props.createOrder(data);
      // order_data.push(resp.data.order);
      user_market_orders.push(data);
      await this.props.updateUserMarketOrders(user_market_orders);
      //   console.log(TAG + " create new order  :  resp :  ", resp);
      await AsyncStorage.setItem(
        "user_market_orders",
        JSON.stringify(user_market_orders)
      );
      await this.props.updateUserMarketBasket([]);
      await AsyncStorage.setItem("user_market_basket", JSON.stringify([]));
      await Actions.S_App({ type: "reset" });
      AppAlert({
        message: ` Success...`,
      });
      // AppAlert({
      //   message:
      //     ` Success...
      // OrderID:` + JSON.stringify(resp.data.order._id),
      // });
    } catch (error) {
      console.log(TAG + " create new order  :  resp :  error", error);
    }
  };
  savesAddress = () => {
    return (
      <View style={{ minHeight: 40, marginTop: 10 }}>
        <FlatList
          contentContainerStyle={{
            borderWidth: 0.5,
            marginHorizontal: 10,
            backgroundColor: AppColors.background,
          }}
          data={this.state.saved_address}
          renderItem={this.savedAddressView}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
        ></FlatList>
        <TouchableOpacity
          onPress={() => {
            this.setState({ show_map: true, loading: true });
          }}
          style={{
            height: 35,
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
          borderWidth: 0.2,
          // marginHorizontal: 10,
          padding: 10,
        }}
      >
        <AppText style={[AppFonts.h3]}>{item.name}</AppText>
        <AppText style={[AppFonts.h4, { fontFamily: "Montserrat_Light" }]}>
          {item.address}
          {", "}
          {item.city}
          {" ,"}
          {item.state}
          {" ,"}
          {/* {item.country}
          {", "} */}
          {item.zipcode}
        </AppText>
        <AppText style={[AppFonts.h4, { fontFamily: "Montserrat_Light" }]}>
          {item.mobile}
        </AppText>
        <AppText style={[AppFonts.h4, { fontFamily: "Montserrat_Light" }]}>
          {item.email}
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
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
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
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}

        {this.state.location && this.mapView()}
        <Modal
          transparent={true}
          animationType="slide"
          visible={this.state.new_address}
          onRequestClose={() => this.setState({ new_address: false })}
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
    // flex:1,
    borderBottomWidth: 1,
    borderColor: AppColors.grey80,
    textDecorationColor: AppColors.grey80,
    paddingLeft: 0,
    backgroundColor: AppColors.white,
    marginBottom: 10,
  },
  font_text: {
    ...AppFonts.h4,
    color: AppColors.grey,
  },
  textinput_style: {
    // flexDirection: "row",
    // alignItems: "flex-end",
    // justifyContent:"flex-end",
    // borderBottomWidth:0.5
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(NewAddress);
