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
  ScrollView,
  RefreshControl,
} from "react-native";
import Constants from "expo-constants";
import { AppColors, AppFonts } from "../../theme";
import * as _ from "lodash";
import { AppText, Loader, ModalPicker } from "../../components/ui";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";

import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import * as UserActions from "../../redux/user/actions";
import { Actions } from "react-native-router-flux";
import { set, log } from "react-native-reanimated";
import Modal from "react-native-modal";
import { config } from "../../constants";

const TAG = "Supermarket Categories ";
const mapStateToProps = (state) => ({
  user_location_data: state.user.user_location_data,
  user_favorite: state.user.user_favorite,
  user_market_basket: state.user.user_market_basket,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updateUserFavorites: UserActions.updateUserFavorites,
  getProducts: UserActions.getProducts,
  updateUserMarketBasket: UserActions.updateUserMarketBasket,
  getProducts: UserActions.getProducts,
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const marginAnim = new Animated.Value(SCREEN_WIDTH);
class S_Subcategories extends React.Component {
  constructor(props) {
    super(props);
    Animated.timing(marginAnim, {
      toValue: 0,
      duration: 1200,
    }).start();
    this.state = {
      loading: false,
      modal_visible: false,
      active_color: false,
      localqty: 1,
      pickervisible: false,
      picker_data: [],
      selected_category: {
        name: "Dates",
      },
      initial_categorydata: [],
      main_categoriesdata: [],
    };
  }
  componentDidMount = async () => {
    this.getData();
  };
  onRefresh = () => {
    this.setState({ refresh_data: true }, async function () {
      var selected_category = this.state.selected_category;
      var id =
        this.state.storeid +
        "/" +
        this.state.homecategoryid +
        "/" +
        selected_category.key;
      try {
        var resp = await this.props.getProducts(id);
        this.setState({
          main_categoriesdata: resp.data,
        });
      } catch (e) {
        console.log(TAG + " initiatl category  :  select category  :  ", e);
      }
      this.setState({ refresh_data: false });
    });
  };
  componentWillUnmount = async () => {
    if (this.props.callBack) {
      this.props.callBack();
    }
  };
  compareWithBasket = async () => {
    var main_categoriesdata = this.state.main_categoriesdata.slice(0);
    var user_market_basket =
      this.props.user_market_basket != null
        ? this.props.user_market_basket
        : [];
    for (let index = 0; index < main_categoriesdata.length; index++) {
      var item_index = main_categoriesdata.findIndex((v) => {
        return v.id == user_market_basket[i].id;
      });
      if (item_index != -1) {
        main_categoriesdata[index] = user_market_basket[index];
      }
    }
    this.setState({ main_categoriesdata });
  };
  getData = async () => {
    this.setState({ loading: true });
    var passingdata =
      this.props.passingdata != null
        ? this.props.passingdata
        : this.state.selected_category;
    this.setState({ selected_category: passingdata });

    var storeid = _.get(
      this.props.user_location_data.store_data[2],
      "shopid",
      null
    );
    if (this.props.navigateid && this.props.navigateid == 2) {
      console.log(
        TAG + " category data  :  ",
        this.props.maincategory,
        this.props.subcategory
      );

      var initial_categorydata = this.props.maincategory.subgroups;
      var selected_category = this.props.subcategory;
      var homecategoryid = this.props.maincategory.key;
      var subcategoryid = this.props.subcategory.key;
    } else {
      var category_home = this.props.passingdata_home;
      var initial_categorydata = category_home.subgroups;
      var selected_category = initial_categorydata[0];
      var homecategoryid = category_home.key;
      var subcategoryid = selected_category.key;
    }

    var id = storeid + "/" + homecategoryid + "/" + subcategoryid;
    var resp = await this.props.getProducts(id);
    this.setState({
      initial_categorydata,
      selected_category,
      storeid,
      homecategoryid,
      main_categoriesdata: resp.data,
    });
    await this.updateFavoriteState();
    console.log(
      TAG + "  :  navigate id in getdata ",
      this.props.passingdata_home,
      storeid,
      homecategoryid,
      subcategoryid,
      resp.data
    );

    this.setState({ loading: false });
  };
  updateFavoriteState = async () => {
    var user_market_basket =
      this.props.user_market_basket != null
        ? this.props.user_market_basket.slice(0)
        : [];
    var main_categoriesdata = this.state.main_categoriesdata.slice(0);
    if (user_market_basket.length != 0) {
      user_market_basket.forEach((v) => {
        main_categoriesdata.forEach((u, k) => {
          if (v.productid == u.productid) {
            main_categoriesdata[k] = v;
          }
        });
      });
      await this.setState({ main_categoriesdata });
    }
  };
  renderHeader = () => {
    var header_name = _.get(this.props.maincategory, "name", null);
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
          <AppText style={[AppFonts.h2bold, { color: AppColors.white }]}>
            {/* {this.state.category_name && this.state.category_name} */}
            {_.get(this.props.passingdata_home, "name", header_name)}
          </AppText>
        </View>
      </View>
    );
  };
  renderSubHeader = () => {
    return (
      <View style={{ height: 60, backgroundColor: AppColors.white }}>
        <FlatList
          // showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
          horizontal={true}
          data={this.state.initial_categorydata}
          renderItem={this.initialCategory}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  initialCategory = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          this.setState({ loading: true, selected_category: item });
          var id =
            this.state.storeid +
            "/" +
            this.state.homecategoryid +
            "/" +
            item.key;
          try {
            var resp = await this.props.getProducts(id);
            this.setState({
              main_categoriesdata: resp.data,
            });
            await this.updateFavoriteState();
          } catch (e) {
            console.log(TAG + " initiatl category  :  select category  :  ", e);
          }
          this.setState({ loading: false });
        }}
        style={{
          height: 40,
          width: 100,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 0.5,
          marginHorizontal: 10,
          paddingHorizontal: 5,
          borderColor: AppColors.grey,
          backgroundColor:
            this.state.selected_category &&
            this.state.selected_category.name == item.name
              ? AppColors.s_secondary
              : null,
        }}
      >
        <AppText
          numberOfLines={2}
          style={[
            AppFonts.h5_bold,
            {
              textAlign: "center",
              color:
                this.state.selected_category &&
                this.state.selected_category.name == item.name
                  ? AppColors.white
                  : AppColors.primary,
            },
          ]}
        >
          {item.name}
        </AppText>
      </TouchableOpacity>
    );
  };
  keyExtractor = (item, index) => index.toString();
  renderFilterBar = () => {
    return (
      <View
        style={{
          height: 50,
          flexDirection: "row",
          backgroundColor: AppColors.white,
          justifyContent: "space-between",
          borderWidth: 0.5,
          borderColor: AppColors.grey,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <AppText style={AppFonts.h3_bold}>Relevence</AppText>
          <Entypo name="chevron-down" size={25} style={{ marginLeft: 5 }} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <FontAwesome name="filter" size={20} style={{ marginRight: 5 }} />
          <AppText style={AppFonts.h3_bold}>Filter</AppText>
        </View>
      </View>
    );
  };
  renderMainCategories = () => {
    var qty = this.state.main_categoriesdata.length;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: AppColors.white,
        }}
      >
        <View
          style={{
            height: 40,
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundColor: AppColors.background,
            paddingLeft: 10,
          }}
        >
          <AppText style={[AppFonts.h4_bold, { textAlign: "left" }]}>
            {qty} products
          </AppText>
        </View>
        <FlatList
          contentContainerStyle={{ marginTop: 0 }}
          // numColumns={2}
          data={this.state.main_categoriesdata}
          renderItem={this.mainCategoryList}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  mainCategoryList = ({ item, index }) => {
    var current_width = this.state.screenWidth;
    var odd = index % 2 != 0;
    var visible = false;
    var units = item.selected_weight
      ? item.selected_weight.unitname
      : item.Units[0].unitname;
    var discount = 1;
    var stockenable = true;
    // var stockenable = item.stockenable;
    return (
      <Animated.View
        style={{
          marginRight: odd ? 0 : marginAnim,
          marginLeft: odd ? marginAnim : 0,
          paddingBottom: 0.2,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            height: 142,
            flex: 1,
            opacity: stockenable ? 1 : 0.2,
            borderBottomWidth: 0.2,

            backgroundColor: AppColors.white,
            padding: 5,
            paddingLeft: 10,
            flexDirection: "row",
            // alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Image
            style={{
              height: 120,
              width: 120,
              resizeMode: "contain",
              alignSelf: "center",
            }}
            source={{ uri: config.host_name + "file/show/0/" + item.icon }}
          ></Image>
          <View
            style={{
              flex: 1,
              backgroundColor: AppColors.white,
              justifyContent: "space-evenly",
              padding: 5,
              paddingLeft: 10,
            }}
          >
            <AppText style={[AppFonts.h5_bold, { color: AppColors.grey99 }]}>
              {item.brandname != null
                ? item.brandname
                : this.state.selected_category.name}
            </AppText>
            <AppText style={[AppFonts.h3, {}]}>{item.productname}</AppText>
            <TouchableOpacity
              // onPress={async () => {
              //   this.setState({
              //     picker_data: item,
              //     pickervisible: true,
              //   });
              // }}
              style={{
                height: 25,
                width: 110,
                justifyContent: "center",
                paddingLeft: 0,
                borderWidth: 0.5,
                borderColor: AppColors.primary,
                // marginVertical: discount != 0 ? 5 : 8,
              }}
            >
              <Picker
                selectedValue={item.selected_weight}
                mode="dropdown"
                style={{
                  height: 25,
                  width: 110,
                  borderWidth: 2,
                  borderColor: AppColors.primary,
                }}
                onValueChange={(itemValue, itemIndex) => {
                  var category = this.state.main_categoriesdata.slice(0);
                  category[index].selected_weight = itemValue;
                  this.setState({ main_categoriesdata: category });
                }}
              >
                {item.Units.map((v) => {
                  return <Picker.Item label={v.unitname} value={v} />;
                })}
              </Picker>

              {/* <AppText style={[AppFonts.h4_bold]}>{units}</AppText> */}
            </TouchableOpacity>
            {discount != 0 && (
              <AppText style={[AppFonts.h4_bold, { color: AppColors.grey99 }]}>
                MRP:{"  "}
                <AppText style={{ textDecorationLine: "line-through" }}>
                  ₹
                  {item.selected_weight
                    ? item.selected_weight.unitmrp
                    : item.Units[0].unitmrp}
                </AppText>
              </AppText>
            )}
            <AppText style={[AppFonts.h4_bold, {}]}>
              <AppText
                style={[
                  discount != 0 ? AppFonts.h3bold : AppFonts.h2bold,
                  { color: AppColors.green },
                ]}
              >
                ₹
                {item.selected_weight
                  ? item.selected_weight.unitprice
                  : item.Units[0].unitprice}
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
                stockenable ? this.addQuantity(item, index) : null;
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
                ₹ {discount}
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
        </TouchableOpacity>
      </Animated.View>
    );
  };
  addQuantity = async (item, index) => {
    // this.setState({ loading: true });
    var main_categoriesdata = this.state.main_categoriesdata.slice(0);
    var localqty = this.state.localqty;
    var user_market_basket =
      this.props.user_market_basket != null
        ? this.props.user_market_basket
        : [];
    var qty = item.qty ? item.qty + 1 : 1;
    var weight = item.selected_weight || item.Units[0];
    main_categoriesdata[index].selected_weight = weight;
    main_categoriesdata[index].categoryname = this.state.selected_category.name;
    main_categoriesdata[index].qty = qty;
    this.setState({ main_categoriesdata });

    var index = await user_market_basket.findIndex((v) => {
      return v.productid == item.productid;
    });
    if (index == -1) {
      localqty += 1;
      user_market_basket.push(item);
      await this.props.updateUserMarketBasket(user_market_basket);
      await AsyncStorage.setItem(
        "user_market_basket",
        JSON.stringify(user_market_basket)
      );
    } else {
      user_market_basket[index].qty = qty;
      await this.props.updateUserMarketBasket(user_market_basket);
      await AsyncStorage.setItem(
        "user_market_basket",
        JSON.stringify(user_market_basket)
      );
    }
    this.setState({ loading: false, localqty });
  };
  removeQuantity = async (item, index) => {
    // this.setState({ loading: true });
    var localqty = this.state.localqty;
    var main_categoriesdata = this.state.main_categoriesdata.slice(0);
    var user_market_basket =
      this.props.user_market_basket != null
        ? this.props.user_market_basket
        : [];
    var qty = item.qty ? item.qty - 1 : 0;
    var weight = item.selected_weight || item.Units[0];
    main_categoriesdata[index].selected_weight = weight;
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
      localqty -= 1;

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
    this.setState({ loading: false, localqty });
  };
  updateUserFavoriteData = async (item) => {
    var SUBTAG = "updateUserFavoriteData";
    var active_color = !this.state.active_color;
    var user_favorite =
      this.props.user_favorite != undefined ? this.props.user_favorite : [];
    console.log(TAG + SUBTAG + "userfavorite  :  ", user_favorite);

    if (user_favorite.length != 0) {
      var index = user_favorite.findIndex((v) => {
        return v.id == item.id;
      });
    } else {
      var index = -1;
    }

    if (index == -1) {
      item.active_color = true;
      user_favorite.push(item);
    } else {
      item.active_color = false;
      user_favorite.splice(index, 1);
    }
    await this.setState({ active_color });
    try {
      console.log(
        TAG + SUBTAG + "userfavorite update in async   :  ",
        user_favorite
      );

      await AsyncStorage.setItem(
        "user_favorite",
        JSON.stringify(user_favorite)
      );
    } catch (error) {}
    await this.props.updateUserFavorites(user_favorite);
  };
  renderFooter = () => {
    return (
      <TouchableOpacity
        style={{
          height: 60,
          paddingLeft: 10,
          width: SCREEN_WIDTH,
          backfaceVisibility: AppColors.secondary,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <FontAwesome name="shopping-basket" size={30} color={AppColors.white} />
        <View
          style={{
            flex: 1,
            borderLeftWidth: 1,
            borderColor: AppColors.white,
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          {/* <View>
          <AppText style={[AppFonts.h3_bold]}>{this.state.localqty} items</AppText>
          <AppText style={[AppFonts.h3_bold]}>{this.state.localqty} items</AppText>
        </View> */}
          <AppText style={[AppFonts.h2]}>Proceed to cart</AppText>
          <Entypo name="chevron-right" size={25} color={AppColors.white} />
        </View>
      </TouchableOpacity>
    );
  };
  pickerView = ({ item }) => {
    console.log(TAG + " picker view  : ", item);

    return (
      <TouchableOpacity
        onPress={async () => {
          this.setState({ loading: true });
          var data = this.state.picker_data;
          var main_data = this.state.main_categoriesdata.slice(0);
          var index = main_data.findIndex((v) => {
            return v.productid == data.productid;
          });
          if (index != -1) {
            main_data[index].selected_weight = item;
            this.setState({
              main_categoriesdata: main_data,
              pickervisible: false,
              loading: false,
            });
          }
        }}
        style={{
          height: 30,
          borderBottomWidth: 0.2,
          marginBottom: 0.2,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: AppColors.white,
          paddingHorizontal: 20,
        }}
      >
        <AppText style={[AppFonts.h4_bold]}>{item.unitname}</AppText>
        <AppText
          style={[
            AppFonts.h4bold,
            { textAlign: "right", color: AppColors.green },
          ]}
        >
          ₹{item.unitprice}
        </AppText>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading}></Loader>
        <View style={{ flex: 1, backgroundColor: AppColors.white }}>
          <ScrollView stickyHeaderIndices={[1]}>
            {this.renderHeader()}
            {this.renderSubHeader()}
            {/* {this.renderFilterBar()} */}
            {this.state.main_categoriesdata.length > 0 &&
              this.renderMainCategories()}
          </ScrollView>
        </View>
        {/* {this.state.localqty != 0 && this.renderFooter()} */}
        <Modal
          transparent={true}
          animationIn={"fadeIn"}
          animationOut={"fadeOut"}
          isVisible={this.state.pickervisible}
          onBackButtonPress={() => {
            this.setState({ pickervisible: false });
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.setState({ pickervisible: false });
            }}
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              shadowColor: AppColors.primary,
              shadowOpacity: 1,
            }}
          >
            <FlatList
              data={this.state.picker_data.Units}
              contentContainerStyle={{
                borderWidth: 0.2,
                backgroundColor: AppColors.grey99,
                marginHorizontal: 80,
              }}
              // data={[1, 2, 3]}
              renderItem={this.pickerView}
              keyExtractor={this.keyExtractor}
            ></FlatList>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.secondary,
    paddingTop: Constants.statusBarHeight,
  },
  location_box: {
    height: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 40,
    marginBottom: 10,
  },
  render_header: {
    height: 50,
    backgroundColor: AppColors.secondary,
    borderBottomWidth: 0.5,
    borderColor: AppColors.grey,
    flexDirection: "row",
    alignItems: "center",
    // paddingTop: Constants.statusBarHeight,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(S_Subcategories);
