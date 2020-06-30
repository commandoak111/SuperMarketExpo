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
  MaterialIcons,
} from "@expo/vector-icons";
import StickyParalaxHeader from "react-native-sticky-parallax-header";

let TAG = "Checkout ";

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
class Checkout extends React.Component {
  constructor(props) {
    super(props);

    Animated.timing(marginAnim, {
      toValue: 0,
      duration: 600,
    }).start();

    this.state = {
      new_address: false,
      loading: false,
      editBasket: false,
      checked_items: [],
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
    this.getData();
  };
  componentWillUnmount = async () => {
    if (this.props.callBack) {
      await this.props.callBack();
    }
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
        {this.state.editBasket == true ? (
          <Entypo
            onPress={() => this.setState({ editBasket: false })}
            name="cross"
            size={25}
            style={{ marginHorizontal: 10 }}
          />
        ) : (
          <Ionicons
            onPress={() => Actions.pop()}
            name="md-arrow-back"
            size={25}
            style={{ marginHorizontal: 10 }}
          />
        )}
        <View
          style={{
            height: 40,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginLeft: 10,
            flex: 1,
          }}
        >
          {this.state.editBasket == false ? (
            <AppText style={[AppFonts.h3_bold]}>Checkout</AppText>
          ) : (
            <AppText style={[AppFonts.h3_bold]}>Select items to delete</AppText>
          )}
          {this.state.editBasket == false ? (
            <FontAwesome
              onPress={() => {
                this.setState({ editBasket: true });
              }}
              name="edit"
              size={25}
              color={AppColors.primary}
              style={{ marginHorizontal: 10 }}
            />
          ) : (
            <MaterialCommunityIcons
              onPress={() => {
                this.onDeleteCheckedItems();
              }}
              name="delete"
              size={24}
              color={AppColors.primary}
              style={{ marginHorizontal: 10 }}
            />
          )}
        </View>
      </View>
    );
  };
  onDeleteCheckedItems = async () => {
    var checked_items = this.state.checked_items.slice(0);
    if (checked_items.length != 0) {
      var user_basket = this.state.user_basket.slice(0);
      console.log(checked_items, user_basket);
      var indexes = [];
      user_basket.forEach((v, k) => {
        checked_items.forEach((u) => {
          if (v.id == u.id) {
            indexes.push(k);
          }
        });
      });
      for (let i = indexes.length - 1; i >= 0; i--) {
        user_basket.splice(indexes[i], 1);
      }
      if (user_basket.length == 0) {
        Actions.S_App({ type: "reset" });
      }
      await this.setState({ user_basket });
      await this.props.updateUserMarketBasket(user_basket);
      await AsyncStorage.setItem(
        "user_market_basket",
        JSON.stringify(user_basket)
      );
      this.setState({ editBasket: false });
    } else {
      AppAlert({
        message: "No items selected",
      });
    }
  };
  productDetails = () => {
    return (
      <View style={{ minHeight: 60, backgroundColor: AppColors }}>
        <FlatList
          style={{ marginTop: 5 }}
          data={this.state.user_basket}
          renderItem={this.productDetailView}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  productDetailView = ({ item }) => {
    var checked = this.state.checked_items.findIndex((v) => {
      return v.id == item.id;
    });
    return (
      <View style={{}}>
        {checked == -1 ? (
          <MaterialIcons
            onPress={() => {
              var checked_items = this.state.checked_items.slice(0);
              checked_items.push(item);
              console.log("checked items ", checked_items);
              this.setState({ checked_items });
            }}
            name="radio-button-unchecked"
            size={24}
            color={
              this.state.editBasket == false
                ? AppColors.background
                : AppColors.primary
            }
            style={{
              position: "absolute",
              top: 20,
              left: 8,
            }}
          />
        ) : (
          <MaterialIcons
            onPress={() => {
              var checked_items = this.state.checked_items.slice(0);
              checked_items.splice(checked, 1);
              console.log("unchecked items ", checked_items);
              this.setState({ checked_items });
            }}
            name="radio-button-checked"
            size={24}
            color={AppColors.secondary}
            style={{
              position: "absolute",
              top: 20,
              left: 8,
            }}
          />
        )}
        <Animated.View
          style={{
            height: 60,
            backgroundColor: AppColors.white,
            marginHorizontal: 10,
            marginLeft: this.state.editBasket == true ? 35 : 10,
            marginTop: marginAnim,
            borderWidth: 0.5,
            marginBottom: 5,
            flexDirection: "row",
          }}
        >
          <View
            style={{ flex: 1, padding: 10, justifyContent: "space-between" }}
          >
            <AppText style={[AppFonts.h4]}>{item.name}</AppText>
            <AppText style={[AppFonts.h4, { color: AppColors.grey99 }]}>
              Qty : {item.qty}
            </AppText>
            <AppText
              style={[
                AppFonts.h4,
                { position: "absolute", top: 10, right: 10 },
              ]}
            >
              ₹ {item.price}
            </AppText>
            <View
              style={{
                position: "absolute",
                bottom: 7,
                right: 10,
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  height: 18,
                  minWidth: 18,
                  borderRadius: 9,
                  backgroundColor: AppColors.background,
                  justifyContent: "center",
                }}
              >
                <AppText
                  style={[
                    AppFonts.h5_bold,
                    { textAlign: "center", marginHorizontal: 10 },
                  ]}
                >
                  {item.selected_weight}
                </AppText>
              </View>
            </View>
          </View>
          <View
            style={{
              width: 46,
              backgroundColor: AppColors.white,
              borderWidth: 0.5,
              borderColor: AppColors.grey,
            }}
          >
            <Image
              style={{ flex: 1, resizeMode: "contain" }}
              source={{ uri: item.image }}
            ></Image>
          </View>
        </Animated.View>
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
        <View style={{}}>
          <View>
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
          <View>
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
          // this.onPlaceOrder();
          Actions.S_DeliveryAddress({
            callBack: () => {
              this.getData();
            },
          });
        }}
        style={{
          minHeight: 40,
          backgroundColor: AppColors.secondary,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppText
          style={[
            AppFonts.h3bold,
            { textAlign: "center", margin: 10, color: AppColors.white },
          ]}
        >
          CONTINUE
        </AppText>
        <AntDesign
          name="arrowright"
          color={AppColors.white}
          size={25}
          style={{ position: "absolute", right: 10, top: 8 }}
        />
      </TouchableOpacity>
    );
  };
  orderTotal = () => {
    var item = this.props.user_basket.slice(0);
    var amount = 0;
    var totalqty = 0;
    item.forEach((v) => {
      amount += v.price * v.qty;
      totalqty += v.qty;
    });
    var deliverycharge = amount - amount;
    return (
      <View
        style={{
          minHeight: 60,
          marginHorizontal: 10,
          // backgroundColor: "#99ffff",
          backgroundColor: AppColors.white,
          marginVertical: 10,
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
      totalamount += v.price * v.qty;
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
      Actions.pop();
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
      <View style={{ minHeight: 40 }}>
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
            this.setState({ new_address: true });
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
          backgroundColor: AppColors.white,
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
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}
        {this.state.new_address == false && (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="position" enabled>
            <ScrollView>
              {this.state.user_basket && this.productDetails()}
              {this.state.user_basket && this.orderTotal()}
              {/* {this.state.saved_address ||
              this.state.selected_address ||
              this.state.new_address == false
                ? this.savesAddress()
                : null} */}
            </ScrollView>
          </KeyboardAvoidingView>
        )}
        {/* {this.state.new_address == true ? this.shippingAddress() : null} */}

        {this.state.new_address == false && this.finishOrder()}
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
});
export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
