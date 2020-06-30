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

let TAG = "OrdersView ";

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
class OrdersView extends React.Component {
  constructor(props) {
    super(props);
    Animated.timing(marginAnim, {
      toValue: 0,
      duration: 600,
    }).start();
    this.state = {};
  }
  componentDidMount = async () => {
    this.getData();
  };
  getData = async () => {
    this.setState({ loading: true });
    var user_order_items = this.props.user_order_items.items.slice(0);
    this.setState({ user_order_items, loading: false });
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
          <AppText style={[AppFonts.h3_bold]}>
            Order ID:{" "}
            <AppText style={[AppFonts.h4]}>
              {this.props.user_order_items._id}
            </AppText>
          </AppText>
        </View>
      </View>
    );
  };
  productDetails = () => {
    return (
      <View style={{ minHeight: 60 }}>
        <FlatList
          style={{ marginTop: 5 }}
          data={this.state.user_order_items}
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
  orderTotal = () => {
    var item = this.props.user_order_items;

    return (
      <View
        style={{
          height: 60,
          marginHorizontal: 10,
          backgroundColor: "#99ffff",
          marginVertical: 10,
          padding: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText style={AppFonts.h3_bold}>Total : </AppText>
          <AppText style={AppFonts.h4}>₹ {item.amount}</AppText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText style={AppFonts.h3_bold}>Quantity : </AppText>
          <AppText style={AppFonts.h4}>{item.totalqty}</AppText>
        </View>
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AppText
            style={[
              AppFonts.h4,
              {
                color:
                  item.status == "rejected" ? AppColors.red : AppColors.green,
              },
            ]}
          >
            {item.status}
          </AppText>
          <View
            style={{
              height: 5,
              width: 5,
              borderRadius: 2.5,
              backgroundColor:
                item.status == "rejected" ? AppColors.red : AppColors.green,
              marginLeft: 3,
            }}
          ></View>
        </View>
      </View>
    );
  };
  orderAddress = () => {
    var item = this.props.user_order_items;
    return (
      <View
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
      </View>
    );
  };
  progressView = () => {
    return (
      <View
        style={{
          minHeight: 40,
          margin: 10,
          backgroundColor: AppColors.white,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View>
          <FontAwesome name="circle" size={25} color={AppColors.green} />
          {/* <AppText style={[AppFonts.h4]}>Order Confirmed</AppText> */}
        </View>
        <View
          style={{ height: 5, width: 120, backgroundColor: AppColors.green }}
        ></View>
        <FontAwesome name="circle" size={25} color={AppColors.green} />
        <View
          style={{ height: 5, width: 120, backgroundColor: AppColors.green }}
        ></View>

        <FontAwesome name="circle" size={25} color={AppColors.green} />
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}
        <ScrollView>
          {this.state.user_order_items && this.productDetails()}
          {this.orderAddress()}
          {this.orderTotal()}
          {/* {this.progressView()} */}
        </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(OrdersView);
