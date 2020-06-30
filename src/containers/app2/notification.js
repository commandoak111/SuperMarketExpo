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
} from "@expo/vector-icons";
import * as UserActions from "../../redux/user/actions";
import { connect } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";
import { set } from "react-native-reanimated";

TAG = "Super market Notification ";

const mapStateToProps = (state) => ({
  user_location_data: state.user.user_location_data,
  user_notifications: state.user.user_notifications,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  fontLoader: UserActions.fontLoader,
  ApiCheck: UserActions.ApiCheck,
  updateUserLocation: UserActions.updateUserLocation,
  updateUserMarketOrders: UserActions.updateUserMarketOrders,
  updateUserMarketBasket: UserActions.updateUserMarketBasket,
};
const marginAnim = new Animated.Value(100);
const marginHoriAnim = new Animated.Value(100);
const fadeAnim = new Animated.Value(0);
class Notification extends React.Component {
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
      notification_data: [
        { message: "Your order is accepted by supermarket" },
        { message: "Your order will be delivered by our team by 7pm" },
        {
          message:
            "Your order Carrot with the orderid: hdd132323656235 is delivered successfully",
        },
      ],
    };
  }
  componentDidMount = async () => {
    this.getData();
  };
  getData = async () => {
    var notification_data = await AsyncStorage.getItem(
      "user_notification"
    ).then((v) => {
      return JSON.parse(v);
    });
    this.setState({ notification_data });
  };
  onLogout = async () => {
    this.setState({ loading: true });
    await Promise.all([
      AsyncStorage.setItem("user_location_data", ""),
      AsyncStorage.setItem("user_favorite", ""),
      AsyncStorage.setItem("user_market_basket", ""),
      AsyncStorage.setItem("user_market_orders", ""),
      this.props.updateUserLocation({}),
    ]);
    this.setState({ loading: false });

    await Actions.Launch();
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
          NOTIFICATIONS
        </AppText>
      </View>
    );
  };
  keyExtractor = (item, index) => index.toString();
  renderNotifications = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          minHeight: 52,
          //   margin: 5,
          padding: 5,
          borderBottomWidth: 0.5,
          borderColor: AppColors.grey,
          overflow: "hidden",
          backgroundColor: AppColors.white,
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="bell"
          size={25}
          color={AppColors.secondary}
        />
        <AppText
          style={[AppFonts.h5, { margin: 10, fontFamily: "Montserrat_Light" }]}
        >
          {item.message}
        </AppText>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}
        <FlatList
          contentContainerStyle={{ marginTop: 5 }}
          data={this.state.notification_data}
          renderItem={this.renderNotifications}
          keyExtractor={this.keyExtractor}
        ></FlatList>
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
export default connect(mapStateToProps, mapDispatchToProps)(Notification);
