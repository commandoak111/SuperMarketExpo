import React from "react";
import {
  Easing,
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Vibration,
  Platform,
} from "react-native";

import Constants from "expo-constants";

import { connect } from "react-redux";
import { AppColors } from "../theme/index";
import { Actions } from "react-native-router-flux";
import * as Font from "expo-font";
import * as Network from "expo-network";
import { Video } from "expo-av";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

import * as UserActions from "../redux/user/actions";
import * as AppActions from "../redux/app/actions";
import { Loader, AppAlert } from "../components/ui";
const mapStateToProps = (state) => ({
  user_notifications: state.user.user_notifications,
  fontLoaded: state.app.fontLoaded,
});

TAG = "Launch ";
// Any actions to map to the component?
const mapDispatchToProps = {
  fontLoader: AppActions.fontLoader,
  updateUserLocation: UserActions.updateUserLocation,
  updateUserFavorites: UserActions.updateUserFavorites,
  updateUserBasket: UserActions.updateUserBasket,
  updateUserOrders: UserActions.updateUserOrders,
  updateUserMarketBasket: UserActions.updateUserMarketBasket,
  updateUserMarketOrders: UserActions.updateUserMarketOrders,
  updateUserNotifications: UserActions.updateUserNotifications,
};

class Launch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      screenWidth: 0,
      screenHeight: 0,
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    this._notificationSubscription = Notifications.addListener( 
      this._handleNotification
    );
    this.registerForPushNotificationsAsync();

    console.disableYellowBox = true;
    await Font.loadAsync({
      // 'any_name' : require('path_to_your_font_file')
      Arvin_Bold: require("@fonts/Arvin_Bold.ttf"),
      Arvin: require("@fonts/Arvin.ttf"),
      Montserrat_Regular: require("@fonts/Montserrat-Regular.otf"),
      Montserrat_Light: require("@fonts/Montserrat-Light.otf"),
      Montserrat_Bold: require("@fonts/Montserrat-Bold.ttf"),
      Bold: require("@fonts/Calibri_Bold.ttf"),
      Regular: require("@fonts/calibri.ttf"),
    });
    await this.props.fontLoader();
    // load data
    // this.setState({ loading: false });

    var user_location_data = await AsyncStorage.getItem(
      "user_location_data"
    ).then((user_location_data) => {
      return JSON.parse(user_location_data);
    });
    var user_favorite = await AsyncStorage.getItem("user_favorite").then(
      (user_favorite) => {
        return JSON.parse(user_favorite);
      }
    );
    var user_basket = await AsyncStorage.getItem("user_basket").then(
      (user_basket) => {
        return JSON.parse(user_basket);
      }
    );
    var user_orders = await AsyncStorage.getItem("user_orders").then(
      (user_orders) => {
        return JSON.parse(user_orders);
      }
    );
    var user_market_basket = await AsyncStorage.getItem(
      "user_market_basket"
    ).then((user_market_basket) => {
      return JSON.parse(user_market_basket);
    });
    var user_market_orders = await AsyncStorage.getItem(
      "user_market_orders"
    ).then((user_market_orders) => {
      return JSON.parse(user_market_orders);
    });
    var auth_token = await AsyncStorage.getItem("auth_token");
    if (user_orders == null) {
      this.props.updateUserOrders([]);
    } else {
      this.props.updateUserOrders(user_orders);
    }
    if (user_basket == null) {
      this.props.updateUserBasket([]);
    } else {
      this.props.updateUserBasket(user_basket);
    }
    if (user_favorite == null) {
      this.props.updateUserFavorites([]);
    } else {
      await this.props.updateUserFavorites(user_favorite);
    }
    if (user_market_basket == null) {
      this.props.updateUserMarketBasket([]);
    } else {
      this.props.updateUserMarketBasket(user_market_basket);
    }
    if (user_market_orders == null) {
      this.props.updateUserMarketOrders([]);
    } else {
      this.props.updateUserMarketOrders(user_market_orders);
    }
    setTimeout(async () => {
      try {
        var status = await Network.getNetworkStateAsync();
        if (status.isConnected == true && status.isInternetReachable == true) {
          if (this.props.fontLoaded) {
            if (!user_location_data || user_location_data == null) {
              await this.setState({ loading: false });

              // Actions.MobileVerification({ type: "reset" });
              if (auth_token) {
                Actions.Location({ type: "reset" });
              } else {
                Actions.UserRegistration({ type: "reset", navigateid: 2 });
              }
            } else {
              await this.props.updateUserLocation(user_location_data);
              await this.setState({ loading: false });
              Actions.S_App({ type: "reset" });
            }
          }
          console.log("entered if ", status);
        } else {
          console.log("entered if else", status);
          this.setState({ loading: false });
          Actions.NetworkError({ type: "reset" });
        }
      } catch (error) {
        this.setState({ loading: false });

        Actions.NetworkError({ type: "reset" });
      }
    }, 3200);
  };
  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      var token = await Notifications.getExpoPushTokenAsync();
      await AsyncStorage.setItem("expoPushToken", token);
      console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };
  _handleNotification = async (notification) => {
    var notification_data = await AsyncStorage.getItem(
      "user_notification"
    ).then((v) => {
      return JSON.parse(v);
    });
    if (notification_data) {
      var data = {};
      data.message = notification.data.data;
      notification_data.push(data);
    } else {
      notification_data = [];
      var data = {};
      data.message = notification.data.data;
      notification_data.push(data);
    }

    Vibration.vibrate();
    await AsyncStorage.setItem(
      "user_notification",
      JSON.stringify(notification_data)
    );
    this.setState({ notification: notification });
  };
  getData = async () => {};
  onLayout = async (e) => {
    var width = this.state.screenWidth;
    await this.setState({
      screenWidth: e.nativeEvent.layout.width,
      screenHeight: e.nativeEvent.layout.height,
    });
  };

  render() {
    return (
      <Animated.View onLayout={this.onLayout} style={[styles.container]}>
        {/* <Loader visible={this.state.loading} /> */}
        <Video
          source={require("../../assets/video/logovideo.mp4")}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={{ width: 300, height: 300 }}
        />
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Launch);
