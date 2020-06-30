import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  AsyncStorage,
  Animated,
  Dimensions,
  ImageBackground,
  RefreshControl,
  Vibration,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import { AppColors, AppFonts } from "../../theme";
import { AppText, Loader, AppAlert } from "../../components/ui";
import Slideshow from "react-native-image-slider-show";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import * as UserActions from "../../redux/user/actions";
import * as Network from "expo-network";
import { Actions } from "react-native-router-flux";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const TAG = "SuperMarket Home ";

const mapStateToProps = (state) => ({
  user_location_data: state.user.user_location_data,
  user_basket: state.user.user_basket,
  user_market_basket: state.user.user_market_basket,
  user_notifications: state.user.user_notifications,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  fontLoader: UserActions.fontLoader,
  getProducts: UserActions.getProducts,
  updateUserLocation: UserActions.updateUserLocation,
  getCategoryList: UserActions.getCategoryList,
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const IMAGE_SOURCE = "http://hd-x.in/file/show/0/";

const marginAnim = new Animated.Value(200);
class Home extends React.Component {
  constructor(props) {
    super(props);
    Animated.timing(marginAnim, {
      toValue: 0,
      duration: 800,
    }).start();

    this.state = {
      loading: false,
      refresh_data: false,
      expoPushToken: "",
      notification: {},
      position: 1,
      interval: null,
      dataSource: [
        {
          url:
            "https://www.eu-startups.com/wp-content/uploads/2020/05/supermarket-vegetables-fruits.jpg",
        },
        {
          url:
            "https://www.interest.co.nz/sites/default/files/feature_images/supermarket.jpg",
        },
        {
          url:
            "https://cdn-a.william-reed.com/var/wrbm_gb_food_pharma/storage/images/publications/food-beverage-nutrition/foodnavigator-asia.com/headlines/markets/hong-kong-protests-supermarket-sales-increase-while-other-retail-sectors-feel-the-pinch/10085144-1-eng-GB/Hong-Kong-protests-Supermarket-sales-increase-while-other-retail-sectors-feel-the-pinch_wrbm_large.jpg",
        },
        {
          url:
            "https://www.connexionfrance.com/var/connexion/storage/images/_aliases/social_network_image/media/images/supermarket-crisps/805491-1-eng-GB/supermarket-crisps.jpg",
        },
        {
          url:
            "https://i0.wp.com/www.globaltrademag.com/wp-content/uploads/2016/10/Groceries.jpg?fit=965%2C393&ssl=1",
        },
        {
          url:
            "https://www.supermarketnews.com/sites/supermarketnews.com/files/Kroger_produce_department-coronavirus_measures.jpg",
        },
        {
          url:
            "https://chabadvienna.com/wp-content/uploads/2018/02/4-550x320.jpg",
        },
      ],
    };
  }
  componentDidMount = async () => {
    // this.registerForPushNotificationsAsync();
    await this.getData();
    // this._notificationSubscription = Notifications.addListener(
    //   this._handleNotification
    // );
  };
  _handleNotification = (notification) => {
    Vibration.vibrate();
    this.setState({ notification: notification });
  };
  sendPushNotification = async () => {
    this.setState({ loading: true });
    var token = await AsyncStorage.getItem("expoPushToken");
    const message = {
      to: token,
      sound: "default",
      title: "Order",
      body: "you order with id 287121291271278 is accepted successfully",
      data: {
        data: "you order with id 287121291271278 is accepted successfully",
      },
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
      console.log("expoPushToken", token);
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

  componentWillMount = async () => {
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position:
            this.state.position === this.state.dataSource.length
              ? 0
              : this.state.position + 1,
        });
      }, 2000),
    });
  };
  onRefresh = () => {
    this.setState({ refresh_data: true }, function () {
      this.getData();
    });
  };
  getData = async () => {
    var refresh_data = this.state.refresh_data;
    refresh_data == false
      ? this.setState({ loading: true })
      : this.setState({ loading: false });
    try {
      var user_location = await AsyncStorage.getItem("user_location_data").then(
        (user_location_data) => {
          return JSON.parse(user_location_data);
        }
      );

      var id = user_location.store_data[2].shopid;
      this.setState({
        store_data: user_location.store_data[2],
      });

      var resp = await this.props.getCategoryList(id);
      var main_data = resp.data;
      await this.setState({
        main_data,
      });
      console.log("user notifications  ", this.props.user_notifications);
    } catch (error) {
      console.log(TAG + " getdata  :  ", error);
    }

    this.setState({
      loading: false,
      user_basket: this.props.user_basket,
      refresh_data: false,
    });
  };
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={{ justifyContent: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <AppText style={[AppFonts.h2bold, { color: AppColors.white }]}>
              {this.state.store_data && this.state.store_data.organizationname}
            </AppText>
            <Image
              style={{ height: 25, width: 25, marginHorizontal: 5 }}
              source={require("../../../assets/trolly-png.png")}
            ></Image>
          </View>
          <View style={{ flexDirection: "row" }}>
            <MaterialIcons
              name="location-on"
              size={13}
              color={AppColors.white}
              style={{ marginRight: 3 }}
            />
            <AppText style={[AppFonts.h5, { color: AppColors.white }]}>
              {this.state.store_data && this.state.store_data.locationname}
            </AppText>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View>
            <FontAwesome
              onPress={() => {
                // Actions.Notification();
                this.sendPushNotification();
              }}
              name="bell"
              size={23}
              color={AppColors.white}
            />
            {/* {this.props.user_market_basket != null &&
              this.props.user_market_basket.length != 0 && (
                <View
                  style={{
                    height: 18,
                    width: 18,
                    borderRadius: 9,
                    backgroundColor: AppColors.secondary_b,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: -5,
                    right: -8,
                  }}
                >
                  <AppText
                    style={[
                      AppFonts.h4,
                      { color: AppColors.primary, marginBottom: 2 },
                    ]}
                  >
                    {this.props.user_market_basket.length}
                  </AppText>
                </View>
              )} */}
          </View>
          <View style={{ marginLeft: 10 }}>
            <MaterialCommunityIcons
              onPress={() => Actions.S_Basket()}
              name="cart"
              size={28}
              color={AppColors.white}
            />
            {this.props.user_market_basket != null &&
              this.props.user_market_basket.length != 0 && (
                <View
                  style={{
                    height: 18,
                    width: 18,
                    borderRadius: 9,
                    backgroundColor: AppColors.secondary_b,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: -5,
                    right: -8,
                  }}
                >
                  <AppText
                    style={[
                      AppFonts.h4,
                      { color: AppColors.primary, marginBottom: 2 },
                    ]}
                  >
                    {this.props.user_market_basket.length}
                  </AppText>
                </View>
              )}
          </View>
        </View>
      </View>
    );
  };
  keyExtractor = (item, index) => index.toString();
  renderBody = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: AppColors.white,
          alignItems: "center",
        }}
      >
        <Slideshow
          arrowSize={0}
          dataSource={this.state.dataSource}
          position={this.state.position}
          onPositionChanged={(position) => {
            this.setState({ position });
          }}
        ></Slideshow>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh_data}
              onRefresh={this.onRefresh}
            ></RefreshControl>
          }
          style={{ marginTop: -(SCREEN_WIDTH / 3 - 80) }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={this.state.main_data}
          renderItem={this.mainCategoryView}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  mainCategoryView = ({ item }) => {
    return (
      <Animated.View style={{ marginTop: marginAnim }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            Actions.S_Subcategories({
              passingdata_home: item,
              callBack: () => {
                var user_basket = this.props.user_basket;
                this.setState({ user_basket });
              },
            });
          }}
          style={{
            height: SCREEN_WIDTH / 2 - 100,
            width: SCREEN_WIDTH / 2 - 50,
            backgroundColor: AppColors.white,
            borderWidth: 1,
            margin: 10,
            borderRadius: 20,
            elevation: 5,
            overflow: "hidden",
            borderColor: AppColors.grey99,
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              height: SCREEN_WIDTH / 2 - 140,
              width: SCREEN_WIDTH / 2 - 50,
            }}
            resizeMode={"contain"}
            source={{ uri: IMAGE_SOURCE + item.icon }}
          ></Image>
          <AppText
            style={[AppFonts.h5_bold, { textAlign: "center", marginTop: 5 }]}
          >
            {item.name}
          </AppText>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}
        {this.state.main_data && this.renderBody()}
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
  header: {
    height: Constants.statusBarHeight + 80,
    backgroundColor: AppColors.secondary,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: Constants.statusBarHeight,
    flexDirection: "row",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
