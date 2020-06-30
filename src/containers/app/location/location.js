import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
  Image,
  Dimensions,
  Animated,
  ImageBackground,
  BackHandler,
} from "react-native";
import Constants from "expo-constants";

let TAG = "location ";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  Feather,
  FontAwesome,
  EvilIcons,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import * as Font from "expo-font";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { AppColors, AppFonts, AppAlert } from "../../../theme/index";
import { Actions } from "react-native-router-flux";

import * as Location from "expo-location";
import * as _ from "lodash";
import * as Permissions from "expo-permissions";

import * as UserActions from "../../../redux/user/actions";
import { AppText, Loader, AnimatedLoader } from "../../../components/ui/index";
import { TextInput } from "react-native-gesture-handler";
import { config } from "../../../constants";
const mapStateToProps = (state) => ({
  fontLoader: state.user.fontLoader,
  user_location_data: state.user.user_location_data,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  fontLoader: UserActions.fontLoader,
  ApiCheck: UserActions.ApiCheck,
  updateUserLocation: UserActions.updateUserLocation,
  updateUserBasket: UserActions.updateUserBasket,
  updateUserFavorites: UserActions.updateUserFavorites,
  getCityList: UserActions.getCityList,
  getShopList: UserActions.getShopList,
};
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const IMAGE_SOURCE = "http://hd-x.in/file/show/0/";
const marginAnim = new Animated.Value(100);
class LocationV1 extends React.Component {
  constructor(props) {
    super(props);
    Animated.timing(marginAnim, {
      toValue: 0,
      duration: 600,
    }).start();
    this.state = {
      loading: false,
      show_store: false,
      modal_visible: false,
      branch_visible: false,
      selected_city: null,
      selected_store: null,
      selected_branch: { name: "Select branch" },
      textinput_city: "",
      textinput_store: "",
      search_city_list: [],
      city_list: [],
      store_data: [],
      search_store_data: [],
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    this.getData();
    this.setState({ loading: false });
  };
  getData = async () => {
    this.setState({ loading: true });
    try {
      var resp = await this.props.getCityList();
      this.setState({ city_list: resp.data, search_city_list: resp.data });
    } catch (error) {}

    this.setState({ loading: false });
  };
  getCurrentLocation = async () => {
    this.setState({ loading: true });
    if (Platform.OS === "android" && !Constants.isDevice) {
      // permission not granted
    } else {
      let status = await Permissions.askAsync(Permissions.LOCATION);
      if (status.status !== "granted") {
      } else {
        let locationv1 = await Location.getCurrentPositionAsync();
        var location = {
          latitude: locationv1.coords.latitude,
          longitude: locationv1.coords.longitude,
        };
        var localaddress = await Location.reverseGeocodeAsync(location);
        var user_location_data = localaddress[0];
        try {
          await AsyncStorage.setItem(
            "user_location_data",
            JSON.stringify(user_location_data)
          );

          await this.props.updateUserLocation(user_location_data);
        } catch (error) {
          console.log(TAG + "user location updated  :  error", error);
        }
        if (
          user_location_data.city != null ||
          user_location_data.region != null
        ) {
          Actions.App();
        }
      }
    }
    this.setState({ loading: false });
  };
  modalBody = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: AppColors.primary,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 40,
            borderWidth: 0.5,
            borderColor: AppColors.white,
            marginHorizontal: 20,
            justifyContent: "center",
            paddingLeft: 10,
            backgroundColor: AppColors.white,
          }}
        >
          <TextInput placeholder="Enter cityname"></TextInput>
        </View>
        <View
          style={{
            height: 40,
            borderWidth: 0.5,
            borderColor: AppColors.white,
            marginHorizontal: 20,
            justifyContent: "center",
            paddingLeft: 10,
            backgroundColor: AppColors.white,
            marginTop: 10,
          }}
        >
          <TextInput placeholder="Enter Store"></TextInput>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.setState({ modal_visible: false }), Actions.App();
          }}
          style={{
            height: 40,
            borderWidth: 0.5,
            borderColor: AppColors.white,
            marginHorizontal: 20,
            justifyContent: "center",
            paddingLeft: 10,
            backgroundColor: AppColors.secondary,
            marginTop: 10,
          }}
        >
          <AppText style={[AppFonts.h3_bold, { textAlign: "center" }]}>
            Let's Go
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };
  renderGetLocation = () => {
    return (
      <TouchableOpacity
        onPress={() => this.getCurrentLocation()}
        style={styles.location_box}
      >
        <AppText style={AppFonts.h3_bold}>Set current location</AppText>

        {/* <TouchableOpacity
      onPress={() => this.setState({ modal_visible: true })}
      style={styles.location_box}
    >
      <AppText style={AppFonts.h3_bold}>Set location Manually</AppText>
    </TouchableOpacity> */}
      </TouchableOpacity>
    );
  };
  textFilter = (letter) => {
    var results = [];
    var myArray = this.state.city_list.slice(0);
    var len = myArray.length;
    for (var i = 0; i < len; i++) {
      if (myArray[i].name.indexOf(letter) == 0) results.push(myArray[i]);
    }
    return results;
  };
  textStoreFilter = (letter) => {
    var results = [];
    var myArray = this.state.store_data.slice(0);
    var len = myArray.length;
    for (var i = 0; i < len; i++) {
      if (myArray[i].name.indexOf(letter) == 0) results.push(myArray[i]);
    }
    return results;
  };
  renderHeader = () => {
    var icon_data = this.state.search_city_list.slice(0);
    return (
      <Animated.View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: AppColors.secondary,
            paddingTop: Constants.statusBarHeight,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              onPress={() => Actions.pop()}
              name="md-arrow-back"
              size={25}
              color={AppColors.white}
              style={{
                position: "absolute",
                left: 10,
                top: 12,
                marginHorizontal: 10,
              }}
            />
            <View
              style={{
                height: 40,
                justifyContent: "center",
                marginLeft: 10,
                flex: 1,
              }}
            >
              <AppText
                style={[
                  AppFonts.h2_bold,
                  { color: AppColors.white, textAlign: "center", marginTop: 5 },
                ]}
              >
                Location
              </AppText>
            </View>
          </View>
          <TextInput
            placeholder={"Search here"}
            style={{
              ...AppFonts.h5,
              alignItems: "center",
              height: 35,
              borderWidth: 1,
              backgroundColor: AppColors.white,
              borderColor: AppColors.grey99,
              marginHorizontal: 20,
              marginVertical: 10,
              // borderRadius: 20,
              paddingLeft: 20,
            }}
            onChangeText={(text) => {
              this.setState({ textinput_city: text });
              var result = this.textFilter(text);
              this.setState({ search_city_list: result });
            }}
            value={this.state.textinput_city}
          ></TextInput>
        </View>

        <FlatList
          numColumns={3}
          style={{ width: SCREEN_WIDTH, marginHorizontal: 20 }}
          data={icon_data}
          renderItem={this.cityView}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </Animated.View>
    );
  };
  cityView = ({ item }) => {
    var icon = item.icon;
    return (
      <Animated.View style={{ marginRight: marginAnim }}>
        <TouchableOpacity
          onPress={async () => {
            this.setState({
              selected_city: item,
              textinput_city: "",
              show_store: true,
            });
          }}
          style={{
            overflow: "hidden",
            marginVertical: 15,
            // borderRadius:15,
            marginHorizontal: 17,
            // borderWidth: this.state.selected_city == item ? 1 : 0,
            // borderColor: AppColors.grey,
            // borderWidth: 1,
            // borderColor: AppColors.primary,
            borderRadius: 5,
            // backgroundColor: "#e6e6e6",
          }}
        >
          <Image
            style={{
              height: SCREEN_WIDTH / 3 - 50,
              width: SCREEN_WIDTH / 3 - 50,
              // borderRadius: (SCREEN_WIDTH / 4 - 20) / 2,
              // borderRadius:10,
              // borderWidth: 3,
              // borderColor: AppColors.grey80,
              // backgroundColor: AppColors.white,
            }}
            resizeMode="contain"
            source={{ uri: IMAGE_SOURCE + item.icon }}
          ></Image>
          <AppText
            style={[
              AppFonts.h5_light,
              {
                color: AppColors.primary,
                textAlign: "center",
                marginVertical: 5,
              },
            ]}
          >
            {item.name}
          </AppText>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  keyExtractor = (item, index) => index.toString();
  renderStore = () => {
    var icon_data = this.state.search_store_data.slice(0);
    return (
      <View
        style={{
          flex: 1,
          // backgroundColor: "#e6e6e6",
          backgroundColor: AppColors.white,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            backgroundColor: AppColors.secondary,
            paddingTop: Constants.statusBarHeight,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ show_store: false });
              }}
              style={{
                marginHorizontal: 20,
                marginTop: 5,
                width: 50,
                // backgroundColor: AppColors.white,
              }}
            >
              <Ionicons
                name="md-arrow-back"
                size={25}
                color={AppColors.white}
              />
            </TouchableOpacity>

            <View
              style={{
                height: 40,
                justifyContent: "center",
                marginLeft: 10,
                flex: 1,
              }}
            >
              <AppText
                style={[
                  AppFonts.h2_bold,
                  {
                    color: AppColors.white,
                    textAlign: "center",
                    marginTop: 5,
                    marginLeft: -80,
                  },
                ]}
              >
                Select store
              </AppText>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.setState({ branch_visible: true });
            }}
            style={{
              height: 36,
              borderWidth: 0.5,
              margin: 10,
              marginHorizontal: 15,
              backgroundColor: AppColors.white,
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name="location-on"
              size={20}
              color={AppColors.primary}
              style={{ position: "absolute", left: 10, top: 8 }}
            />
            <AppText
              style={[AppFonts.h5, { textAlign: "left", marginLeft: 40 }]}
            >
              {this.state.selected_branch.name}
            </AppText>
            <Entypo
              name="chevron-thin-down"
              size={20}
              color={AppColors.primary}
              style={{ position: "absolute", right: 10, top: 8 }}
            />
          </TouchableOpacity>
          {/* <TextInput
            placeholder={"Search here"}
            style={{
              alignItems: "center",
              height: 40,
              borderWidth: 1,
              backgroundColor: AppColors.white,
              borderColor: AppColors.grey99,
              borderRadius: 20,
              marginHorizontal: 20,
              marginVertical: 10,
              // borderRadius: 20,
              paddingLeft: 10,
            }}
            onChangeText={(text) => {
              this.setState({ textinput_store: text });
              var result = this.textStoreFilter(text);
              this.setState({ search_store_data: result });
            }}
            value={this.state.textinput_store}
          ></TextInput> */}
        </View>
        <FlatList
          // numColumns={3}
          style={{ borderTopWidth: 0, marginHorizontal: 15, marginTop: 10 }}
          data={icon_data}
          renderItem={this.storeView}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  storeView = ({ item }) => {
    var icon = item.icon;

    return (
      <TouchableOpacity
        onPress={async () => {
          // var user_location_data = _.get(this.props.user_location_data,"",null)
          var user_location_data = this.props.user_location_data
            ? this.props.user_location_data
            : {};
          await this.setState({ selected_store: item });
          console.log(
            "pre check data ",
            this.state.selected_city,
            this.state.selected_store,
            item
          );
          var items = user_location_data;
          items.store_data = [
            this.state.selected_city,
            this.state.selected_branch,
            this.state.selected_store,
          ];

          try {
            await AsyncStorage.setItem(
              "user_location_data",
              JSON.stringify(items)
            );

            await this.props.updateUserLocation(items);
          } catch (error) {
            console.log(TAG + "user location updated  :  error", error);
          }
          Actions.S_App({ type: "reset" });
        }}
        style={{
          overflow: "hidden",
          paddingVertical: 5,
          flexDirection: "row",
          alignItems: "center",
          // backgroundColor: "#e6e6e6",
          // backgroundColor:AppColors.white,
          // marginBottom: 5,
          // borderWidth: 5,
          borderWidth: 0.1,
          // paddingVertical:10,
          elevation: 2,
          // borderColor: AppColors.lightpink,
          // borderBottomWidth: 0.2,
          // borderLeftWidth: 0.2,
          // borderRightWidth: 0.2,
          // marginHorizontal: 25,
        }}
      >
        <Image
          style={{
            height: SCREEN_WIDTH / 4 - 40,
            width: SCREEN_WIDTH / 4 - 40,
            marginHorizontal: 15,
            marginVertical: 10,
            // paddingRight: 15,
            // borderRadius: (SCREEN_WIDTH / 3 - 40) / 2,
            borderWidth: 0,
            // borderColor: AppColors.lightpink,
            // borderColor: AppColors.primary,
            backgroundColor: AppColors.white,
          }}
          source={{ uri: config.host_name + "file/show/0/" + item.icon }}
        ></Image>
        <View style={{}}>
          <AppText
            numberOfLines={2}
            style={[
              AppFonts.h4bold,
              {
                color: AppColors.primary,
                overflow: "hidden",
              },
            ]}
          >
            {item.organizationname.toUpperCase()}
          </AppText>
          <AppText
            numberOfLines={2}
            style={[
              AppFonts.h4_light,
              {
                color: AppColors.grey,
                overflow: "hidden",
              },
            ]}
          >
            {item.locationname.toLowerCase()}
          </AppText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              marginVertical: 5,
            }}
          >
            {item.support_bakery && (
              <Image
                style={{ height: 18, width: 18 }}
                source={require("../../../../assets/svg/bakery.png")}
              ></Image>
            )}
            {item.support_vegitable && (
              <Image
                style={{ height: 18, width: 18 }}
                source={require("../../../../assets/svg/vegitables.png")}
              ></Image>
            )}
            {item.support_fruit && (
              <Image
                style={{ height: 18, width: 18 }}
                source={require("../../../../assets/svg/mangofruit.png")}
              ></Image>
            )}
            {item.support_meat && (
              <Image
                style={{ height: 18, width: 18 }}
                source={require("../../../../assets/svg/fish.png")}
              ></Image>
            )}
            {item.support_grocery && (
              <Image
                style={{ height: 18, width: 18 }}
                source={require("../../../../assets/svg/grocery.png")}
              ></Image>
            )}
          </View>
        </View>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            flex:1,
            height: SCREEN_WIDTH / 4 - 40,
            padding:15,
            paddingBottom:10
          }}
        >
          <Image
            style={{ height: 20, width: 20 }}
            source={require("../../../../assets/svg/bakery.png")}
          ></Image>
          <Image
            style={{ height: 20, width: 20 }}
            source={require("../../../../assets/svg/vegitables.png")}
          ></Image>
          <Image
            style={{ height: 20, width: 20 }}
            source={require("../../../../assets/svg/mangofruit.png")}
          ></Image>
          <Image
            style={{ height: 20, width: 20 }}
            source={require("../../../../assets/svg/fish.png")}
          ></Image>
          <Image
            style={{ height: 20, width: 20 }}
            source={require("../../../../assets/svg/grocery.png")}
          ></Image>
        </View> */}
      </TouchableOpacity>
    );
  };

  BranchList = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          this.setState({ loading: true });
          var resp = await this.props.getShopList(item.id);
          console.log(TAG + " shop list  :  getdata  :  ", resp, item.id);

          this.setState({
            store_data: resp.data,
            search_store_data: resp.data,
            selected_branch: item,
            loading: false,
            branch_visible: false,
          });
        }}
        style={{
          height: 35,
          marginHorizontal: 20,
          justifyContent: "center",
          backgroundColor: AppColors.secondary,
          marginBottom: 10,
          borderWidth: 0.5,
        }}
      >
        <AppText
          style={[AppFonts.h4, { textAlign: "center", color: AppColors.white }]}
        >
          {item.name}
        </AppText>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View
        style={styles.container}
        // blurRadius={1}
        // source={{
        //   uri:
        //     "https://text1magpull-10516.kxcdn.com/wp-content/uploads/2019/08/Fabric.jpg",
        // }}
      >
        <Loader visible={this.state.loading}></Loader>
        {/* {this.renderGetLocation()} */}
        {this.state.show_store == false && this.renderHeader()}
        {this.state.show_store && this.renderStore()}

        <Modal
          // animationType="none"
          transparent={false}
          isVisible={this.state.modal_visible}
          onBackButtonPress={() => {
            this.setState({ modal_visible: false });
          }}
        >
          {this.renderStore()}
        </Modal>
        <Modal
          animationIn="bounceIn"
          animationOut="bounceOut"
          transparent={true}
          isVisible={this.state.branch_visible}
          onBackButtonPress={() => {
            this.setState({ branch_visible: false });
          }}
        >
          <FlatList
            contentContainerStyle={{ flex: 1, justifyContent: "center" }}
            data={
              this.state.selected_city
                ? this.state.selected_city.region
                : [1, 2, 3]
            }
            renderItem={this.BranchList}
            keyExtractor={this.keyExtractor}
          ></FlatList>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#e6e6e6",
    backgroundColor: AppColors.white,
    // marginTop: Constants.statusBarHeight,
    // borderWidth: 2,
    borderColor: AppColors.primary,
    borderBottomWidth: 0,
    // justifyContent: "center",
  },
  location_box: {
    height: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 40,
    marginBottom: 10,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(LocationV1);
