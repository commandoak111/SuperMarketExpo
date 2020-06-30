import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  AsyncStorage,
  Animated,
  Picker,
  Dimensions,
  RefreshControl,
} from "react-native";
import Constants from "expo-constants";
import { AppColors, AppFonts } from "../../theme";
import { AppText, Loader } from "../../components/ui";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
} from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import * as UserActions from "../../redux/user/actions";
import { Actions } from "react-native-router-flux";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const TAG = "Supermarket BAsket ";

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
  updateUserMarketBasket: UserActions.updateUserMarketBasket,
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const IMAGE_SOURCE = "http://hd-x.in/file/show/0/";
const marginAnim = new Animated.Value(100);
const marginLeftAnim = new Animated.Value(SCREEN_WIDTH);
class Home extends React.Component {
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
    };
  }
  componentDidMount = async () => {
    this.getData();
  };
  componentWillMount = () => {
    this.getData();
  };
  onRefresh = () => {
    this.setState({ refresh_data: true }, async function () {
      this.getData();
    });
  };
  componentWillReceiveProps = () => {
    this.getData();
  };
  getData = async () => {
    var refresh_data = this.state.refresh_data;
    refresh_data == false
      ? this.setState({ loading: true })
      : this.setState({ loading: false });

    var main_categoriesdata =
      this.props.user_market_basket != null &&
      this.props.user_market_basket != undefined
        ? this.props.user_market_basket.slice(0)
        : [];
    var user_location = this.props.user_location_data;
    var user_basket = this.props.user_basket;
    console.log(
      TAG + " getdata  :  user basket  :",
      user_location,
      user_basket,
      this.props.user_market_basket
    );

    await this.setState({ user_location, user_basket, main_categoriesdata });
    this.setState({ loading: false, refresh_data: false });
  };
  keyExtractor = (item, index) => index.toString();
  renderMainCategories = () => {
    var qty = this.state.main_categoriesdata.length;
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            height: 30,
            alignItems: "flex-start",
            justifyContent: "center",
            paddingLeft: 15,
            backgroundColor: AppColors.background,
          }}
        >
          {this.state.main_categoriesdata.length != 0 && (
            <AppText style={[AppFonts.h4_bold, { textAlign: "left" }]}>
              {qty} product{this.state.main_categoriesdata.length > 1 && "s"}
            </AppText>
          )}
        </View>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh_data}
              onRefresh={this.onRefresh}
            ></RefreshControl>
          }
          contentContainerStyle={{ marginTop: 0, marginHorizontal: 0 }}
          // numColumns={2}
          data={this.state.main_categoriesdata}
          renderItem={this.mainCategoryList}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  mainCategoryList = ({ item, index }) => {
    // var discount =
    //   item.selected_weight.unitmrp - item.selected_weight.unitprice;
    var discount = 1;
    var current_width = this.state.screenWidth;
    var odd = index % 2 != 0;

    console.log(TAG + " maincategory  :  item ", item);

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          height: 142,
          flex: 1,
          backgroundColor: AppColors.white,
          borderBottomWidth: 0.5,
          padding: 5,
          paddingLeft: 10,
          flexDirection: "row",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Image
          style={{ height: 120, width: 120, resizeMode: "contain" }}
          source={{ uri: IMAGE_SOURCE + item.icon }}
        ></Image>
        <View
          style={{
            flex: 1,
            backgroundColor: AppColors.white,
            padding: 10,
            justifyContent: "space-between",
          }}
        >
          <AppText style={[AppFonts.h5_bold, { color: AppColors.grey99 }]}>
            {item.categoryname}
          </AppText>
          <AppText style={[AppFonts.h3, { marginTop: 5 }]}>
            {item.productname}
          </AppText>
          <TouchableOpacity
            style={{
              height: 25,
              width: 100,
              justifyContent: "center",
              // borderWidth: 0.5,
              borderColor: AppColors.primary,
              // marginVertical: 5,
            }}
          >
            <AppText style={[AppFonts.h4, { color: AppColors.grey }]}>
              {item.selected_weight.unitname}
            </AppText>
            {/* <Picker
              selectedValue={item.selected_weight}
              mode="dropdown"
              style={{
                height: 25,
                width: 100,
                borderWidth: 2,
                borderColor: AppColors.primary,
              }}
              onValueChange={(itemValue, itemIndex) => {
                var category = this.state.main_categoriesdata.slice(0);
                category[index].selected_weight = itemValue;
                this.setState({ main_categoriesdata: category });
              }}
            >
              {item.color.map((v) => {
                return <Picker.Item label={v} value={v} />;
              })}
            </Picker> */}
          </TouchableOpacity>
          {discount != 0 && (
            <AppText
              style={[
                AppFonts.h4_bold,
                { marginTop: 0, color: AppColors.grey99 },
              ]}
            >
              MRP:{"  "}
              <AppText style={{ textDecorationLine: "line-through" }}>
                ₹{item.selected_weight.unitmrp}
              </AppText>
            </AppText>
          )}
          <AppText style={[AppFonts.h4_bold, { marginTop: 3 }]}>
            <AppText
              style={[
                discount != 0 ? AppFonts.h3bold : AppFonts.h2bold,
                { color: AppColors.green },
              ]}
            >
              ₹{item.selected_weight.unitprice}
            </AppText>
          </AppText>
        </View>
        {item.qty > 0 ? (
          <View
            style={{
              position: "absolute",
              bottom: 10,
              right: 15,
              backgroundColor: AppColors.white,
              height: 25,
              minWidth: 80,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Entypo
              onPress={() => this.removeQuantity(item, index)}
              name="squared-minus"
              size={30}
              color={AppColors.s_secondary}
            />
            <AppText style={[AppFonts.h3_bold, { marginHorizontal: 5 }]}>
              {item.qty}
            </AppText>
            <Entypo
              onPress={() => this.addQuantity(item, index)}
              name="squared-plus"
              size={30}
              color={AppColors.s_secondary}
            />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              this.addQuantity(item, index);
            }}
            style={{
              position: "absolute",
              bottom: 10,
              right: 15,
              backgroundColor: AppColors.s_secondary,
              height: 30,
              width: 60,
              borderRadius: 3,
              justifyContent: "center",
            }}
          >
            <AppText
              style={[
                AppFonts.h4bold,
                { color: AppColors.white, textAlign: "center" },
              ]}
            >
              ADD
            </AppText>
          </TouchableOpacity>
        )}
        {discount != 0 && (
          <View
            style={{
              height: 46,
              width: 46,
              borderRadius: 23,
              backgroundColor: AppColors.s_secondary,
              position: "absolute",
              top: 5,
              left: 5,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <AppText
              style={[
                AppFonts.h6,
                {
                  color: AppColors.white,
                  textAlign: "center",
                  marginTop: 10,
                  marginBottom: 2,
                },
              ]}
            >
              ₹ {item.selected_weight.unitmrp - item.selected_weight.unitprice}
            </AppText>
            <AppText
              style={[
                AppFonts.h6,
                { color: AppColors.white, textAlign: "center" },
              ]}
            >
              SAVED
            </AppText>
          </View>
        )}
        <MaterialCommunityIcons
          onPress={() => {
            this.onDeleteBasketData(item);
          }}
          name="delete"
          size={25}
          color={AppColors.grey99}
          style={{ position: "absolute", top: 8, right: 10 }}
        />
      </TouchableOpacity>
    );
  };
  onDeleteBasketData = async (item) => {
    this.setState({ loading: true });
    var main_categoriesdata = this.state.main_categoriesdata.slice(0);

    var index = main_categoriesdata.findIndex((v) => {
      return v.productid == item.productid;
    });
    if (index != -1) {
      main_categoriesdata.splice(index, 1);
      await this.props.updateUserMarketBasket(main_categoriesdata);
      await AsyncStorage.setItem(
        "user_market_basket",
        JSON.stringify(main_categoriesdata)
      );
      await this.setState({ main_categoriesdata });
    }
    this.setState({ loading: false });
  };
  addQuantity = async (item, index) => {
    var main_categoriesdata = this.state.main_categoriesdata.slice(0);
    var user_market_basket =
      this.props.user_market_basket != null
        ? this.props.user_market_basket
        : [];
    var qty = item.qty ? item.qty + 1 : 1;
    main_categoriesdata[index].qty = qty;
    this.setState({ main_categoriesdata });

    var index = await user_market_basket.findIndex((v) => {
      return v.productid == item.productid;
    });
    if (index == -1) {
      user_market_basket.push(item);
      this.props.updateUserMarketBasket(user_market_basket);
      await AsyncStorage.setItem(
        "user_market_basket",
        JSON.stringify(user_market_basket)
      );
    } else {
      user_market_basket[index].qty = qty;
      this.props.updateUserMarketBasket(user_market_basket);
      await AsyncStorage.setItem(
        "user_market_basket",
        JSON.stringify(user_market_basket)
      );
    }
  };
  removeQuantity = async (item, index) => {
    var main_categoriesdata = this.state.main_categoriesdata.slice(0);
    var user_market_basket =
      this.props.user_market_basket != null
        ? this.props.user_market_basket
        : [];
    var qty = item.qty ? item.qty - 1 : 0;
    main_categoriesdata[index].qty = qty;
    this.setState({ main_categoriesdata });
    var index = await user_market_basket.findIndex((v) => {
      return v.productid == item.productid;
    });
    if (index == -1) {
      user_market_basket.push(item);
      this.props.updateUserMarketBasket(user_market_basket);
      await AsyncStorage.setItem(
        "user_market_basket",
        JSON.stringify(user_market_basket)
      );
    } else if (qty == 0) {
      user_market_basket.splice(index, 1);
      this.props.updateUserMarketBasket(user_market_basket);
      await AsyncStorage.setItem(
        "user_market_basket",
        JSON.stringify(user_market_basket)
      );
    } else {
      user_market_basket[index].qty = qty;
      this.props.updateUserMarketBasket(user_market_basket);
      await AsyncStorage.setItem(
        "user_market_basket",
        JSON.stringify(user_market_basket)
      );
    }
    this.setState({ main_categoriesdata: user_market_basket });
  };
  onLayout = async (e) => {
    this.setState({
      screenWidth: e.nativeEvent.layout.width,
      screenHeight: e.nativeEvent.layout.height,
    });
  };
  renderHeader = () => {
    return (
      <View style={styles.render_header}>
        <Ionicons
          onPress={() => Actions.pop()}
          name="md-arrow-back"
          size={25}
          color={AppColors.white}
          style={{
            position: "absolute",
            left: 10,
            top: 12,
            marginTop: Constants.statusBarHeight,
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
              { color: AppColors.white, textAlign: "center" },
            ]}
          >
            BASKET
          </AppText>
        </View>
      </View>
    );
  };
  renderFooter = () => {
    var data = this.state.main_categoriesdata.slice(0);
    var totalamount = 0;
    var totalsaved = 0;
    data.forEach((v) => {
      totalamount = totalamount + v.qty * v.selected_weight.unitprice;
      totalsaved +=
        v.qty * (v.selected_weight.unitmrp - v.selected_weight.unitprice);
    });
    console.log(TAG + " footer  :  unitprice ,", totalamount);
    return (
      <View
        style={{
          height: 55,
          padding: 10,
          backgroundColor: AppColors.secondary,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <View>
          <AppText style={[AppFonts.h3bold, { color: AppColors.white }]}>
            Total : ₹ {totalamount}
          </AppText>
          <AppText style={[AppFonts.h5bold, { color: AppColors.primary }]}>
            SAVED : ₹ {totalsaved.toFixed(2)}
          </AppText>
        </View>

        <TouchableOpacity
          onPress={() => {
            Actions.S_DeliveryAddress({
              callBack: () => this.getData(),
            });
          }}
          style={{
            height: 35,
            width: 120,
            borderRadius: 3,
            justifyContent: "center",
            backgroundColor: AppColors.white,
          }}
        >
          <AppText
            style={[
              AppFonts.h3bold,
              { textAlign: "center", color: AppColors.primary },
            ]}
          >
            CHECKOUT
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };
  emptyBasketView = () => {
    return (
      <View
        style={[
          styles.container,
          {
            // justifyContent: "center",
            backgroundColor: AppColors.white,
          },
        ]}
      >
        {this.renderHeader()}
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Animated.View style={{ marginLeft: marginLeftAnim }}>
            <Image
              style={{
                height: 300,
                marginVertical: 20,
                marginLeft: 40,
                resizeMode: "contain",
                alignSelf: "center",
              }}
              // source={require("../../../assets/emptycart.png")}
              source={require("../../../assets/trolly-png.png")}
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
    if (
      this.props.user_market_basket &&
      this.props.user_market_basket.length <= 0
    ) {
      return this.emptyBasketView();
    } else {
      return (
        <View onLayout={this.onLayout} style={styles.container}>
          <Loader visible={this.state.loading} />
          {this.renderHeader()}
          {/* {this.renderHeader()} */}
          {/* {this.renderSubHeader()} */}
          {this.state.main_categoriesdata && this.renderMainCategories()}
          {this.state.main_categoriesdata && this.renderFooter()}
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    // marginTop: Constants.statusBarHeight,
    justifyContent: "space-between",
  },
  header: {
    height: 80,
    backgroundColor: AppColors.secondary,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    flexDirection: "row",
  },

  render_header: {
    height: Constants.statusBarHeight + 50,
    backgroundColor: AppColors.secondary,
    borderWidth: 0.5,
    borderColor: AppColors.grey,
    paddingTop: Constants.statusBarHeight,
    flexDirection: "row",
    alignItems: "center",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
