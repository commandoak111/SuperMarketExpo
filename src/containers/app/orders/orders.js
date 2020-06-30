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

let TAG = "Orders ";

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
  user_orders: state.user.user_orders,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updateUserFavorites: UserActions.updateUserFavorites,
  updateUserBasket: UserActions.updateUserBasket,
  getOrders: UserActions.getOrders,
};

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount = () => {
    this.getData();
  };
  getData = async () => {
    this.setState({ loading: true });
    var user_orders = this.props.user_orders.slice(0);
    // var resp = await this.props.getOrders();
    // console.log(TAG + " getdata  :  resp", resp);

    // var local = await this.compareOrders(user_orders, resp.data);
    this.setState({ user_orders, loading: false });
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
          <AppText style={[AppFonts.h3_bold]}>Orders</AppText>
        </View>
      </View>
    );
  };
  renderBody = () => {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ marginTop: 5 }}
          data={this.state.user_orders}
          renderItem={this.orderlistView}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  orderlistView = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.OrdersView({
            user_order_items: item,
          });
        }}
        style={{
          height: 120,
          backgroundColor: AppColors.white,
          margin: 10,
          marginVertical: 5,
          flexDirection: "row",
        }}
      >
        <View style={{ justifyContent: "space-around", flex: 1, padding: 10 }}>
          <AppText style={[AppFonts.h4_bold]}>Order ID: {item._id}</AppText>
          <AppText style={[AppFonts.h3]}>
            <AppText style={[AppFonts.h3_bold]}>Products :</AppText>
            {item.items[0].name}...
          </AppText>
          <AppText style={[AppFonts.h3]}>
            <AppText style={[AppFonts.h3_bold]}>Qty :</AppText> {item.totalqty}
          </AppText>
          <AppText style={[AppFonts.h3]}>
            <AppText style={[AppFonts.h3_bold]}>Amount :</AppText> {item.amount}
          </AppText>
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
        </View>
        <View
          style={{
            width: 91,
            backgroundColor: AppColors.secondary,
            borderWidth: 0.5,
            borderColor: AppColors.grey99,
          }}
        >
          <Image
            style={{ flex: 1 }}
            source={{ uri: item.items[0].image }}
          ></Image>
        </View>
      </TouchableOpacity>
    );
  };
  keyExtractor = (item, index) => index.toString();
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}
        {this.renderBody()}
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
export default connect(mapStateToProps, mapDispatchToProps)(Orders);
