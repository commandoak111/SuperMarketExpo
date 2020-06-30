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
import { config } from "../../../constants";

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
const IMAGE_SOURCE = "http://hd-x.in/file/show/0/";
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
    var user_order_items = this.props.user_order_items.Orderitem.slice(0);
    this.setState({ user_order_items, loading: false });
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
            marginTop:5,
            flex: 1,
          }}
        >
          <AppText style={[AppFonts.h3_bold, { color: AppColors.white }]}>
            Order ID :{" "}
            <AppText style={[AppFonts.h4]}>
              {this.props.user_order_items.orderno}
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
          minHeight: 60,
          backgroundColor: AppColors.white,
          marginHorizontal: 10,
          marginTop: marginAnim,
          borderWidth: 0.2,
          elevation: 5,
          marginBottom: 5,
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 10,
            justifyContent: "space-between",
            paddingRight: 50,
          }}
        >
          <AppText style={[AppFonts.h4]}>{item.sproduct}</AppText>
          <AppText style={[AppFonts.h4, { color: AppColors.grey99 }]}>
            Qty : {item.qty}
          </AppText>
          <AppText
            style={[AppFonts.h4, { position: "absolute", top: 10, right: 10 }]}
          >
            ₹ {item.rate}
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
                {item.sproductunit}
              </AppText>
            </View>
          </View>
        </View>
        <View
          style={{
            width: 46,
            backgroundColor: AppColors.white,
            borderLeftWidth: 0.2,
            borderColor: AppColors.grey99,
            overflow: "hidden",
            padding: 5,
          }}
        >
          {item.icon.length == 0 ? (
            <View>
              <AppText style={[AppFonts.h5_light]}>image unavailable</AppText>
            </View>
          ) : (
            <Image
              style={{ flex: 1 }}
              resizeMode="center"
              source={{ uri: config.host_name + "file/show/0/" + item.icon }}
            ></Image>
          )}
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
          backgroundColor: AppColors.white,
          marginVertical: 10,
          marginTop: 5,
          padding: 10,
          justifyContent: "center",
          borderWidth: 0.2,
          elevation: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText style={[AppFonts.h3_bold, { color: AppColors.primary }]}>
            Total :{" "}
          </AppText>
          <AppText style={[AppFonts.h4, { color: AppColors.primary }]}>
            ₹ {item.totalamount}
          </AppText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText style={[AppFonts.h3_bold, { color: AppColors.primary }]}>
            Qty :{" "}
          </AppText>
          <AppText style={[AppFonts.h4, { color: AppColors.primary }]}>
            {item.totalqty}
          </AppText>
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
            {item.orderstatus}
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
    var item = this.props.user_order_items.address;
    return (
      <View
        style={{
          minHeight: 80,
          backgroundColor: AppColors.white,
          marginHorizontal: 10,
          padding: 10,
          borderWidth: 0.2,
          elevation: 5,
          marginVertical: 5,
        }}
      >
        <View
          style={{
            minHeight: 30,
            justifyContent: "center",
            borderBottomWidth: 0.2,
            paddingBottom: 5,
          }}
        >
          <AppText style={[AppFonts.h3]}>Shipping address</AppText>
        </View>
        <View style={{ paddingTop: 5 }}>
          <AppText style={[AppFonts.h4bold]}>
            {this.props.user_order_items.customername}
          </AppText>
          <AppText style={[AppFonts.h4, { fontFamily: "Montserrat_Light" }]}>
            {item.door}, {item.street}, {item.area},{item.landmark},{" "}
            {item.town}, {item.city}
          </AppText>
          <AppText style={[AppFonts.h4, { fontFamily: "Montserrat_Light" }]}>
            {item.contactno}
          </AppText>
          <AppText style={[AppFonts.h4, { fontFamily: "Montserrat_Light" }]}>
            {item.type}
          </AppText>
        </View>
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
});
export default connect(mapStateToProps, mapDispatchToProps)(OrdersView);
