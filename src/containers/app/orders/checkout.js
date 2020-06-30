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
  user_basket: state.user.user_basket,
  user_location_data: state.user.user_location_data,
  user_orders: state.user.user_orders,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updateUserFavorites: UserActions.updateUserFavorites,
  updateUserBasket: UserActions.updateUserBasket,
  updateUserLocation: UserActions.updateUserLocation,
  createOrder: UserActions.createOrder,
  updateUserOrders: UserActions.updateUserOrders,
  createAddress: UserActions.createAddress,
};
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
      textinput_name: "",
      textinput_mobile: "",
      textinput_email: "",
      textinput_address: "",
      textinput_country: "",
      textinput_zipcode: "",
      textinput_city: "",
      textinput_state: "",
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
      console.log(TAG + " pre address  :  ", address);
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
          <AppText style={[AppFonts.h3_bold]}>Checkout</AppText>
        </View>
      </View>
    );
  };
  productDetails = () => {
    return (
      <View style={{ minHeight: 60 }}>
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
    return (
      <Animated.View
        style={{
          height: 60,
          backgroundColor: AppColors.white,
          marginHorizontal: 10,
          marginTop: marginAnim,
          marginBottom: 5,
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1, padding: 10 }}>
          <AppText style={[AppFonts.h3_bold]}>{item.name}</AppText>
          <AppText style={[AppFonts.h3, { color: AppColors.grey99 }]}>
            Qty : {item.qty}
          </AppText>
          <AppText
            style={[AppFonts.h3, { position: "absolute", top: 10, right: 10 }]}
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
                width: 18,
                borderRadius: 9,
                backgroundColor: item.color,
                marginHorizontal: 10,
              }}
            ></View>
            <View
              style={{
                height: 18,
                width: 18,
                borderRadius: 9,
                backgroundColor: AppColors.background,
                justifyContent: "center",
              }}
            >
              <AppText style={[AppFonts.h5, { textAlign: "center" }]}>
                {item.size}
              </AppText>
            </View>
          </View>
        </View>
        <View
          style={{
            width: 46,
            backgroundColor: AppColors.secondary,
            borderWidth: 0.5,
            borderColor: AppColors.grey,
          }}
        >
          <Image style={{ flex: 1 }} source={{ uri: item.image }}></Image>
        </View>
      </Animated.View>
    );
  };
  keyExtractor = (item, index) => index.toString();
  shippingAddress = () => {
    return (
      <View
        style={{
          minHeight: 40,
          backgroundColor: AppColors.white,
          margin: 10,
          marginTop: 5,
          padding: 5,
        }}
      >
        <AppText style={[AppFonts.h2_bold, { marginLeft: 10 }]}>
          Shipping Address
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
            this.onsaveAddress();
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
        address: address,
        country: country,
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
        console.log(TAG + " onsave address deliveryaddress  ", deliveryaddress);

        // deliveryaddress.push(resp.data.address);
        deliveryaddress.push(data);
        user_location_data.deliveryaddress = deliveryaddress;
        if (deliveryaddress.length == 1) {
          user_location_data.currentaddress = deliveryaddress[0];
        }
        await this.props.updateUserLocation(user_location_data);
        await AsyncStorage.setItem(
          "user_location_data",
          JSON.stringify(user_location_data)
        );

        var pre_savedaddress =
          this.state.saved_address && this.state.saved_address != null
            ? this.state.saved_address.slice(0)
            : [];
        // pre_savedaddress.push(resp.data.address);
        pre_savedaddress.deliveryaddress;
        this.setState({ new_address: false, saved_address: pre_savedaddress });
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
            AppFonts.h3_bold,
            { textAlign: "center", margin: 10, color: AppColors.white },
          ]}
        >
          PLACE ORDER
        </AppText>
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

    return (
      <View
        style={{
          height: 60,
          marginHorizontal: 10,
          // backgroundColor: "#99ffff",
          backgroundColor: AppColors.secondary,
          marginVertical: 10,
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        </View>
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
    var order_data =
      this.props.user_orders != null ? this.props.user_orders : [];
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
      order_data.push(data);
      await this.props.updateUserOrders(order_data);
      //   console.log(TAG + " create new order  :  resp :  ", resp);
      await AsyncStorage.setItem("user_orders", JSON.stringify(order_data));
      await this.props.updateUserBasket([]);
      await AsyncStorage.setItem("user_basket", JSON.stringify([]));
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
              AppFonts.h3_bold,
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
          marginHorizontal: 10,
          padding: 10,
        }}
      >
        <AppText style={[AppFonts.h3_bold]}>{item.name}</AppText>
        <AppText style={[AppFonts.h3]}>
          {item.address}
          {", "}
          {item.city}
          {" ,"}
          {item.state}
          {" ,"}
          {item.country}
          {", "}
          {item.zipcode}
        </AppText>
        <AppText style={[AppFonts.h4_bold]}>{item.mobile}</AppText>
        <AppText style={[AppFonts.h4_bold]}>{item.email}</AppText>

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
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="position" enabled>
          <ScrollView>
            {this.state.user_basket && this.productDetails()}
            {this.state.user_basket && this.orderTotal()}
            {this.state.saved_address ||
            this.state.selected_address ||
            this.state.new_address == false
              ? this.savesAddress()
              : null}
            {this.state.new_address == true ? this.shippingAddress() : null}
          </ScrollView>
        </KeyboardAvoidingView>
        {this.finishOrder()}
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
  render_header: {
    height: 50,
    backgroundColor: AppColors.white,
    borderWidth: 0.5,
    borderTopWidth: 0,
    borderColor: AppColors.grey,
    flexDirection: "row",
    alignItems: "center",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
