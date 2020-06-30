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
} from "react-native";
import Constants from "expo-constants";
import { AppColors, AppFonts } from "../theme/index";
import { AppText, Loader, AppAlert } from "../components/ui/index";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
} from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import * as UserActions from "../redux/user/actions";
import * as Network from "expo-network";
import { Actions } from "react-native-router-flux";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

TAG = "NetworkError ";

const mapStateToProps = (state) => ({
  user_location_data: state.user.user_location_data,
  user_basket: state.user.user_basket,
  user_market_basket: state.user.user_market_basket,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  fontLoader: UserActions.fontLoader,
  getProducts: UserActions.getProducts,
  updateUserLocation: UserActions.updateUserLocation,
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const marginAnim = new Animated.Value(200);
class NetworkError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount = async () => {
    this.getData();
  };
  getData = async () => {
    try {
      this.setState({ loading: true });

      var status = await Network.getNetworkStateAsync();
      if (status.isConnected == true && status.isInternetReachable == true) {
        Actions.Launch();

        this.setState({ internetstaus: true });
      } else {
        this.setState({ internetstaus: false });
      }
    } catch (error) {
      this.setState({ internetstaus: false });
    }
    this.setState({ loading: false });
  };
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={{ justifyContent: "center" }}>
          <AppText style={[AppFonts.h1_bold, { color: AppColors.white }]}>
            {this.props.user_location_data &&
              this.props.user_location_data.store}
          </AppText>
          <AppText style={[AppFonts.h4, { color: AppColors.white }]}>
            {/* location name */}
            {this.props.user_location_data &&
              this.props.user_location_data.city}
          </AppText>
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
                AppAlert({ message: "You clicked Notifications" });
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
                    backgroundColor: AppColors.red,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: -5,
                    right: -8,
                  }}
                >
                  <AppText
                    style={[
                      AppFonts.h3_bold,
                      { color: AppColors.white, marginBottom: 2 },
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
                    backgroundColor: AppColors.red,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: -5,
                    right: -8,
                  }}
                >
                  <AppText
                    style={[
                      AppFonts.h3_bold,
                      { color: AppColors.white, marginBottom: 2 },
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

  onLayout = async (e) => {
    this.setState({
      screenWidth: e.nativeEvent.layout.width,
      screenHeight: e.nativeEvent.layout.height,
    });
  };
  errorInternetView = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: AppColors.background,
        }}
      >
        <Image
          style={{ height: 200, width: 200, alignSelf: "center" }}
          source={require("../../assets/networkerror.png")}
        ></Image>
        <AppText
          style={[
            AppFonts.h4,
            { marginTop: 20, marginBottom: 10, textAlign: "center" },
          ]}
        >
          CAN'T CONNECT TO THE INTERNET
        </AppText>
        <TouchableOpacity
          style={{ alignSelf: "center" }}
          onPress={() => {
            this.getData();
          }}
        >
          <AppText style={[AppFonts.h4bold, { color: AppColors.secondary }]}>
            TRY AGAIN
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    return this.errorInternetView();
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
export default connect(mapStateToProps, mapDispatchToProps)(NetworkError);
