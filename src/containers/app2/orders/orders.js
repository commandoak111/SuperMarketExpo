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
  Animated,
  Dimensions,
  RefreshControl,
} from "react-native";
import Constants from "expo-constants";
import moment from "moment";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import StickyParalaxHeader from "react-native-sticky-parallax-header";

let TAG = "Orders ";

import { connect } from "react-redux";

import * as _ from "lodash";
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
  user_orders: state.user.user_market_orders,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updateUserFavorites: UserActions.updateUserFavorites,
  updateUserBasket: UserActions.updateUserBasket,
  getActiveOrder: UserActions.getActiveOrder,
  getCompletedOrder: UserActions.getCompletedOrder,
  getCancelledOrder: UserActions.getCancelledOrder,
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const IMAGE_SOURCE = "http://hd-x.in/file/show/0/";
const marginAnim = new Animated.Value(100);
const marginLeftAnim = new Animated.Value(SCREEN_WIDTH);
class Orders extends React.Component {
  constructor(props) {
    super(props);
    Animated.timing(marginAnim, {
      toValue: 0,
      duration: 800,
    }).start();
    Animated.timing(marginLeftAnim, {
      toValue: 0,
      duration: 800,
    }).start();
    this.state = {
      loading: false,
      refresh_data: false,
      selected_order_category: "CURRENT",
    };
  }
  componentDidMount = () => {
    this.getData();
  };
  onRefresh = () => {
    this.setState({ refresh_data: true }, async function () {
      this.getData();
    });
  };
  getData = async () => {
    var refresh_data = this.state.refresh_data;
    refresh_data == false
      ? this.setState({ loading: true })
      : this.setState({ loading: false });

    var resp = await this.props.getActiveOrder();

    // var user_orders =
    //   this.props.user_orders != null ? this.props.user_orders.slice(0) : [];
    // var resp = await this.props.getOrders();

    // var local = await this.compareOrders(user_orders, resp.data);
    this.setState({
      user_orders: resp.data,
      loading: false,
      refresh_data: false,
    });
  };
  compareOrders = async (local, api) => {
    local.forEach((v, key) => {
      api.forEach((u) => {
        if (v._id == u._id) {
          local[key] = u;
        }
      });
    });
    return local;
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
            Orders
          </AppText>
        </View>
      </View>
    );
  };
  renderBody = () => {
    var selected_order_category = this.state.selected_order_category;
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 35,
            flexDirection: "row",
            marginHorizontal: 40,
            borderWidth: 0.5,
            marginVertical: 15,
            marginBottom: 5,
            borderColor: AppColors.secondary,
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              this.setState({
                selected_order_category: "CURRENT",
                loading: true,
              });
              var resp = await this.props.getActiveOrder();
              this.setState({ user_orders: resp.data, loading: false });
            }}
            style={{
              flex: 0.5,
              backgroundColor:
                selected_order_category == "CURRENT"
                  ? AppColors.secondary
                  : AppColors.white,
              justifyContent: "center",
            }}
          >
            <AppText
              style={[
                AppFonts.h4bold,
                {
                  color:
                    selected_order_category == "CURRENT"
                      ? AppColors.white
                      : AppColors.secondary,
                  textAlign: "center",
                },
              ]}
            >
              CURRENT
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              this.setState({
                selected_order_category: "HISTORY",
                loading: true,
              });
              var resp = await this.props.getCompletedOrder();
              this.setState({ user_orders: resp.data, loading: false });
            }}
            style={{
              flex: 0.5,
              backgroundColor:
                selected_order_category == "HISTORY"
                  ? AppColors.secondary
                  : AppColors.white,
              justifyContent: "center",
            }}
          >
            <AppText
              style={[
                AppFonts.h4bold,
                {
                  color:
                    selected_order_category == "HISTORY"
                      ? AppColors.white
                      : AppColors.secondary,
                  textAlign: "center",
                },
              ]}
            >
              HISTORY
            </AppText>
          </TouchableOpacity>
        </View>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh_data}
              onRefresh={this.onRefresh}
            ></RefreshControl>
          }
          style={{ marginTop: 5 }}
          data={this.state.user_orders}
          renderItem={this.orderlistView}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  orderlistView = ({ item }) => {
    var len = item.Orderitem.length;
    var date = moment(item.orderdate).utc().format("lll");
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.S_OrdersView({
            user_order_items: item,
          });
        }}
        style={{
          height: 140,
          backgroundColor: AppColors.white,
          margin: 10,
          borderWidth: 0.5,
          marginVertical: 5,
          padding: 10,
          elevation: 5,
          justifyContent: "space-evenly",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText style={[AppFonts.h4bold]}>Order No</AppText>
          <AppText style={[AppFonts.h4_bold, { color: AppColors.grey }]}>
            {item.orderno}
          </AppText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText style={[AppFonts.h4bold]}>Date</AppText>
          <AppText style={[AppFonts.h4_bold, { color: AppColors.grey }]}>
            {date}
          </AppText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText style={[AppFonts.h4bold]}>Total Items</AppText>
          <AppText style={[AppFonts.h4_bold, { color: AppColors.grey }]}>
            {item.totalqty}
          </AppText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText style={[AppFonts.h4bold]}>Total price</AppText>
          <AppText style={[AppFonts.h4_bold, { color: AppColors.grey }]}>
            ₹ {item.totalamount}
          </AppText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText style={[AppFonts.h4bold]}>Status</AppText>
          <AppText style={[AppFonts.h4_bold, { color: AppColors.green }]}>
            {item.orderstatus}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };
  keyExtractor = (item, index) => index.toString();
  emptyBasketView = () => {
    var selected_order_category = this.state.selected_order_category;
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            backgroundColor: AppColors.white,
          },
        ]}
      >
        <View
          style={{
            height: 35,
            flexDirection: "row",
            marginHorizontal: 40,
            borderWidth: 0.5,
            marginVertical: 15,
            marginBottom: 5,
            borderColor: AppColors.secondary,
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              this.setState({
                selected_order_category: "CURRENT",
                loading: true,
              });
              var resp = await this.props.getActiveOrder();
              this.setState({ user_orders: resp.data, loading: false });
            }}
            style={{
              flex: 0.5,
              backgroundColor:
                selected_order_category == "CURRENT"
                  ? AppColors.secondary
                  : AppColors.white,
              justifyContent: "center",
            }}
          >
            <AppText
              style={[
                AppFonts.h4bold,
                {
                  color:
                    selected_order_category == "CURRENT"
                      ? AppColors.white
                      : AppColors.secondary,
                  textAlign: "center",
                },
              ]}
            >
              CURRENT
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              this.setState({
                selected_order_category: "HISTORY",
                loading: true,
              });
              var resp = await this.props.getCompletedOrder();
              this.setState({ user_orders: resp.data, loading: false });
            }}
            style={{
              flex: 0.5,
              backgroundColor:
                selected_order_category == "HISTORY"
                  ? AppColors.secondary
                  : AppColors.white,
              justifyContent: "center",
            }}
          >
            <AppText
              style={[
                AppFonts.h4bold,
                {
                  color:
                    selected_order_category == "HISTORY"
                      ? AppColors.white
                      : AppColors.secondary,
                  textAlign: "center",
                },
              ]}
            >
              HISTORY
            </AppText>
          </TouchableOpacity>
        </View>

        {/* {this.renderHeader()} */}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Animated.View style={{ marginLeft: marginLeftAnim }}>
            <Image
              style={{
                height: 300,
                marginVertical: 20,
                resizeMode: "contain",
                alignSelf: "center",
                marginLeft: 30,
              }}
              source={require("../../../../assets/trolly-png.png")}
            ></Image>
          </Animated.View>
          <Animated.View style={{ marginRight: marginLeftAnim }}>
            <TouchableOpacity
              onPress={() => Actions.S_Home()}
              style={{
                height: 40,
                justifyContent: "center",
                marginHorizontal: 25,
                borderRadius: 20,
                backgroundColor: AppColors.secondary,
              }}
            >
              <AppText
                style={[
                  AppFonts.h3_bold,
                  { textAlign: "center", color: AppColors.white },
                ]}
              >
                START SHOPPING
              </AppText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}
        {this.state.user_orders && this.state.user_orders.length == 0
          ? this.emptyBasketView()
          : this.renderBody()}
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
export default connect(mapStateToProps, mapDispatchToProps)(Orders);
