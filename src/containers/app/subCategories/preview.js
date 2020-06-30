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

let TAG = "PreView ";

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
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updateUserFavorites: UserActions.updateUserFavorites,
  updateUserBasket: UserActions.updateUserBasket,
};

class PreView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selected_quantity: 1,
    };
  }
  componentWillUnmount = () => {
    if (this.props.callBack) {
      this.props.callBack();
    }
  };
  componentDidMount = async () => {
    var preview_data = this.props.preview_data;
    var active_color = preview_data.active_color == true ? true : false;
    console.log(
      TAG + "didmount  :  preview data  :  ",
      preview_data,
      this.props.user_basket
    );

    await this.setState({ preview_data, active_color });
  };
  onLayout = async (e) => {
    this.setState({
      screenWidth: e.nativeEvent.layout.width,
      screenHeight: e.nativeEvent.layout.height,
    });
  };
  renderHeader = () => {
    var width = parseInt(this.state.screenWidth);
    var height = (width * 4) / 3;
    return (
      <ImageBackground
        style={{
          height: height,
          width: this.state.screenWidth,
          overflow: "visible",
        }}
        resizeMode="contain"
        source={{ uri: this.state.preview_data.image }}
      ></ImageBackground>
    );
  };
  stickyHeader = () => {
    var width = parseInt(this.state.screenWidth);
    var height = (width * 4) / 3;
    return (
      <StickyParalaxHeader
        headerType="TabbedHeader"
        // backgroundColor={AppColors.white}
        headerHeight={height}
        backgroundImage={10}
      />
    );
  };
  updateUserFavoriteData = async (item) => {
    var SUBTAG = "updateUserFavoriteData";
    var user_favorite =
      this.props.user_favorite != undefined || this.props.user_favorite != null
        ? this.props.user_favorite
        : [];

    if (user_favorite.length != 0) {
      var index = user_favorite.findIndex((v) => {
        return v._id == item._id;
      });
    } else {
      var index = -1;
    }

    if (index == -1) {
      item.active_color = true;

      await this.setState({ active_color: true });
      user_favorite.push(item);
    } else {
      item.active_color = false;

      await this.setState({ active_color: false });
      user_favorite.splice(index, 1);
    }
    try {
      await AsyncStorage.setItem(
        "user_favorite",
        JSON.stringify(user_favorite)
      );
    } catch (error) {}
    await this.props.updateUserFavorites(user_favorite);
  };
  renderProductDetail = (height) => {
    return (
      <View
        style={{
          height: 100,
          backgroundColor: AppColors.white,
          position: "absolute",
          top: height - 50,
          left: 10,
          right: 10,
          padding: 10,
          borderWidth: 1,
          borderColor: AppColors.background,
        }}
      >
        <AppText style={[AppFonts.h1, {}]}>
          {this.state.preview_data.name}
        </AppText>
        <AppText style={[AppFonts.h2_bold, {}]}>
          {this.state.preview_data.description}
        </AppText>
        <AppText style={[AppFonts.h5, {}]}>
          {this.state.preview_data.brand}
        </AppText>
        <View style={{ position: "absolute", bottom: 10, right: 10 }}>
          <AppText style={[AppFonts.h2_bold, { color: AppColors.green }]}>
            ₹ {this.state.preview_data.price}
          </AppText>
        </View>
      </View>
    );
  };
  renderDescription = () => {
    return (
      <View
        style={{
          minHeight: 100,
          flex: 1,
          marginTop: 60,
          marginHorizontal: 10,
          padding: 10,
          backgroundColor: AppColors.white,
          borderWidth: 1,
          borderColor: AppColors.background,
        }}
      >
        <AppText style={[AppFonts.h2_bold, {}]}>Description</AppText>
        <AppText style={[AppFonts.h3]}>
          Material: Nylon, Inner Material: Polyester, Capacity: 25 Liters,
          Color: Air Force Blue, Special Features: Back Padding, Earphone Cord
          Support, Laptop Compartment, Water Bottle / Umbrella Pouch, Zip
          Closure, Padded Handles Package Contents: 1 Laptop/College Backpack
          Warranty type: Manufacturer, 1 year domestic warranty Closure: Zipper
          Strap: Adjustable
        </AppText>
      </View>
    );
  };
  renderAdditionalDetails = () => {
    var colors = this.state.preview_data.color.slice(0);
    var sizes = this.state.preview_data.size.slice(0);

    return (
      <View
        style={{
          minHeight: 300,
          flex: 1,
          margin: 10,
          padding: 10,
          backgroundColor: AppColors.white,
          borderWidth: 1,
          borderColor: AppColors.background,
        }}
      >
        <View
          style={{ height: 40, flex: 1, backgroundColor: AppColors.background }}
        >
          <AppText style={[AppFonts.h3, { margin: 5 }]}>Color</AppText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            {colors.map((value, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ selected_color: value });
                  }}
                  style={{
                    height: 36,
                    width: 36,
                    borderRadius: 18,
                    backgroundColor: value,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {this.state.selected_color &&
                    this.state.selected_color == value && (
                      <Entypo name="check" size={25} color={AppColors.white} />
                    )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View
          style={{
            height: 40,
            flex: 1,
            backgroundColor: AppColors.background,
            marginTop: 10,
          }}
        >
          <AppText style={[AppFonts.h3, { margin: 5 }]}>Size</AppText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            {sizes.map((value, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ selected_size: value });
                  }}
                  style={{
                    height: 36,
                    width: 36,
                    borderRadius: 18,
                    backgroundColor:
                      this.state.selected_size == value
                        ? AppColors.green
                        : AppColors.white,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText style={[AppFonts.h3_bold]}>{value}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View
          style={{
            height: 40,
            flex: 1,
            backgroundColor: AppColors.background,
            marginTop: 10,
          }}
        >
          <AppText style={[AppFonts.h3, { margin: 5 }]}>Quantity</AppText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Entypo
              onPress={() => {
                var selected_quantity = this.state.selected_quantity - 1;
                if (selected_quantity > 0) {
                  this.setState({ selected_quantity });
                }
              }}
              name="circle-with-minus"
              size={35}
              color={AppColors.red}
            />
            <AppText style={[AppFonts.h3_bold]}>
              {this.state.selected_quantity}
            </AppText>
            <Entypo
              onPress={() => {
                var selected_quantity = this.state.selected_quantity + 1;
                this.setState({ selected_quantity });
              }}
              name="circle-with-plus"
              size={35}
              color={AppColors.red}
            />
          </View>
        </View>
      </View>
    );
  };
  renderBasket = () => {
    return (
      <TouchableOpacity
        onPress={() => this.updateBasketData()}
        style={{
          height: 40,
          flex: 1,
          marginHorizontal: 10,
          backgroundColor: AppColors.secondary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppText style={[AppFonts.h3_bold]}>ADD TO BASKET</AppText>
      </TouchableOpacity>
    );
  };
  updateBasketData = async () => {
    var selected_quantity = this.state.selected_quantity;
    if (!this.state.selected_color) {
      AppAlert({ message: "select color" });
    } else if (!this.state.selected_size) {
      AppAlert({ message: "select size" });
    } else {
      var data = this.state.preview_data;

      var user_basket =
        this.props.user_basket != undefined || this.props.user_basket != null
          ? this.props.user_basket
          : [];

      if (user_basket.length != 0) {
        var index = user_basket.findIndex((v) => {
          return (
            v._id == data._id && v.color == data.color && v.size == data.size
          );
        });
        console.log(TAG + " update basket async index ", index);
      } else {
        var index = -1;
      }
      if (index == -1) {
        (data.color = this.state.selected_color),
          (data.size = this.state.selected_size),
          (data.qty = this.state.selected_quantity),
          user_basket.push(data);
        await this.props.updateUserBasket(user_basket);
        try {
          await AsyncStorage.setItem(
            "user_basket",
            JSON.stringify(user_basket)
          );
        } catch (error) {
          console.log(TAG + " update basket async ", error);
        }
        AppAlert({ message: "Added successfully" });
        Actions.pop();
      } else {
        AppAlert({ message: "Item already added" });
      }
    }
  };
  render() {
    var width = parseInt(this.state.screenWidth);
    var height = (width * 4) / 3;
    return (
      <View onLayout={this.onLayout} style={styles.container}>
        <Loader visible={this.state.loading}></Loader>
        <ScrollView>
          {this.state.preview_data &&
            this.state.screenWidth &&
            this.renderHeader()}
          {this.state.screenWidth && this.renderProductDetail(height)}
          {this.state.screenWidth && this.renderDescription(width)}
          {this.state.screenWidth && this.renderAdditionalDetails()}
          {this.renderBasket()}
        </ScrollView>
        <View
          style={{
            height: 40,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            position: "absolute",
            top: 0,
            overflow: "visible",
          }}
        >
          <Ionicons
            onPress={() => Actions.pop()}
            name="md-arrow-back"
            size={25}
            style={{ marginHorizontal: 10 }}
          />
          {this.state.active_color && this.state.active_color == true ? (
            <AntDesign
              onPress={() =>
                this.updateUserFavoriteData(this.props.preview_data)
              }
              name="heart"
              size={22}
              color={AppColors.red}
              style={{ marginRight: 10 }}
            />
          ) : (
            <AntDesign
              onPress={() =>
                this.updateUserFavoriteData(this.props.preview_data)
              }
              name="hearto"
              size={22}
              color={AppColors.white}
              style={{ marginRight: 10 }}
            />
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    marginTop: Constants.statusBarHeight,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(PreView);
