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
  TextInput,
  FlatList,
  ScrollView,
  RefreshControl
} from "react-native";
import Constants from "expo-constants";
import { AppColors, AppFonts } from "../../theme";
import {
  AppText,
  Loader,
  CollapseView,
  AppCategory,
} from "../../components/ui";
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
// import { FlatList } from "react-native-gesture-handler";
const IMAGE_SOURCE = "http://hd-x.in/file/show/0/";
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
  getCategoryList: UserActions.getCategoryList,
};

const marginAnim = new Animated.Value(100);
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
      search_key: false,
      main_categoriesdata: [],
      main_categoriesdata_demo: [],
      sub_categoriesdata: [],
    };
  }
  componentDidMount = async () => {
    this.getData();
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

    var user_location = this.props.user_location_data;
    var id = user_location.store_data[2].shopid;
    try {
      var resp = await this.props.getCategoryList(id);

      // demo search data
      var search_data = [];
      var cart_data = resp.data;
      await cart_data.forEach((v) => {
        var index = v.subgroups.findIndex((u) => {
          search_data.push(u);
        });
      });
      console.log(TAG + " searchdata  :  ", search_data);

      var user_basket = this.props.user_basket;
      await this.setState({
        main_categoriesdata: resp.data,
        main_categoriesdata_demo: resp.data,
        search_data,
        search_data_demo: search_data,
      });
    } catch (error) {
      console.log(TAG + " getdata  :  ", error);
    }

    this.setState({ loading: false,refresh_data:false });
  };
  keyExtractor = (item, index) => index.toString();

  onLayout = async (e) => {
    this.setState({
      screenWidth: e.nativeEvent.layout.width,
      screenHeight: e.nativeEvent.layout.height,
    });
  };
  textFilter = (letter) => {
    var results = [];
    var myArray = this.state.search_data_demo.slice(0);
    var len = myArray.length;
    for (var i = 0; i < len; i++) {
      if (myArray[i].name.indexOf(letter) == 0) results.push(myArray[i]);
    }
    return results;
  };
  renderHeader = () => {
    return (
      <View style={styles.render_header}>
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
              Shop By Category
            </AppText>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            height: 40,
            alignItems: "center",
            marginHorizontal: 15,
            backgroundColor: AppColors.white,
            borderRadius: 10,
            paddingLeft: 5,
            margin: 10,
          }}
        >
          <EvilIcons name="search" size={25} />
          <TextInput
            value={this.state.category_search_key}
            style={{
              height: 40,
              flex: 1,
              paddingLeft: 5,
            }}
            placeholder="search products here"
            onChangeText={async (text) => {
              this.setState({ category_search_key: text });
              if (text.length != 0) {
                this.setState({ search_key: true });
                var result = await this.textFilter(text);
                this.setState({ search_data: result });
              } else {
                this.setState({ search_key: false });
              }
            }}
          ></TextInput>
        </View>
      </View>
    );
  };
  renderBody = ({ item }) => {
    var data = this.state.main_categoriesdata.slice(0);
    return (
      <Animated.View style={{ margin: 10, marginTop: marginAnim }}>
        <CollapseView
          renderView={(collapse) => {
            return (
              <View
                style={[
                  {
                    height: 40,
                    marginHorizontal: 5,
                    backgroundColor: collapse
                      ? AppColors.secondary
                      : AppColors.background,

                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                    borderColor: AppColors.primary,
                    borderWidth: 0.5,
                    borderRadius: 5,
                    marginBottom: 0,
                  },
                  collapse && {
                    borderBottomStartRadius: 0,
                    borderBottomEndRadius: 0,
                  },
                ]}
              >
                {/* <Image
            style={{
              height: 30,
              width: 30,
              resizeMode: "contain",
              margin: 5,
            }}
            source={ item.image }
          ></Image> */}
                <MaterialIcons
                  name="view-list"
                  size={24}
                  color={collapse ? AppColors.white : AppColors.primary}
                  style={{ marginLeft: 10 }}
                />
                <AppText
                  style={[
                    AppFonts.h4_bold,
                    {
                      marginLeft: 10,
                      color: collapse ? AppColors.white : AppColors.primary,
                      textAlign: "left",
                      flex: 1,
                    },
                  ]}
                >
                  {item.name}
                  {/* hi */}
                </AppText>
                {collapse ? (
                  <AntDesign
                    name="upcircleo"
                    size={20}
                    color={AppColors.white}
                    style={{ margin: 10 }}
                  />
                ) : (
                  <AntDesign
                    name="downcircleo"
                    size={20}
                    style={{ margin: 10 }}
                  />
                )}
              </View>
            );
          }}
          renderCollapseView={(collapse) => {
            return (
              <View style={{ marginHorizontal: 5 }}>
                <ScrollView>
                  <FlatList
                    contentContainerStyle={{ marginVertical: 5 }}
                    data={item.subgroups}
                    renderItem={this.ResultView}
                    keyExtractor={this.keyExtractor}
                  />
                </ScrollView>
              </View>
            );
          }}
        />
      </Animated.View>
    );
  };
  ResultView = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          var data = this.state.main_categoriesdata_demo.slice(0);
          await data.forEach((v) => {
            var index = v.subgroups.findIndex((u) => {
              return u.key == item.key;
            });
            if (index != -1) {
              var data2 = v;
              Actions.S_Subcategories({
                navigateid: 2,
                maincategory: data2,
                subcategory: item,
              });
            }
          });
        }}
        style={{
          height: 40,
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 0.5,
          paddingLeft: 34,
          //   backgroundColor: AppColors.white,
          backgroundColor: "#ffe6f0",
          borderColor: AppColors.primary,
        }}
      >
        {/* <Image
          style={{
            height: 39,
            width: 34,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          source={{ uri: IMAGE_SOURCE + item.icon }}
        ></Image> */}
        {/* <Feather name="check" size={20} style={{ margin: 10 }} /> */}
        <AppText
          style={[AppFonts.h4_bold, { textAlign: "left", marginLeft: 10 }]}
        >
          {item.name}
        </AppText>
      </TouchableOpacity>
    );
  };
  searchView = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          var data = this.state.main_categoriesdata_demo.slice(0);

          await data.forEach((v) => {
            var index = v.subgroups.findIndex((u) => {
              return u.key == item.key;
            });
            if (index != -1) {
              this.setState({ category_search_key: "", search_key: false });
              var data2 = v;
              Actions.S_Subcategories({
                navigateid: 2,
                maincategory: data2,
                subcategory: item,
              });
            }
          });
        }}
        style={{
          height: 35,
          justifyContent: "center",
          backgroundColor: AppColors.background,
          marginHorizontal: 18,
          marginTop: 5,
          borderWidth: 0.4,
        }}
      >
        {/* <Image
          style={{
            height: 34,
            width: 34,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          source={{ uri: IMAGE_SOURCE + item.icon }}
        ></Image> */}
        <AppText style={[AppFonts.h4, { textAlign: "left", marginLeft: 10 }]}>
          {item.name}
        </AppText>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View onLayout={this.onLayout} style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}
        {this.state.search_key == false ? (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refresh_data}
                onRefresh={this.onRefresh}
              ></RefreshControl>
            }
            contentContainerStyle={{ paddingVertical: 10 }}
            keyboardShouldPersistTaps={"always"}
            data={this.state.main_categoriesdata}
            renderItem={this.renderBody}
            keyExtractor={this.keyExtractor}
          ></FlatList>
        ) : (
          <View style={{ flex: 1, paddingTop: 5 }}>
            <FlatList
              data={this.state.search_data}
              renderItem={this.searchView}
              keyExtractor={this.keyExtractor}
            ></FlatList>
          </View>
        )}
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
    height: 80,
    backgroundColor: AppColors.secondary,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    flexDirection: "row",
  },

  render_header: {
    minHeight: Constants.statusBarHeight + 50,
    backgroundColor: AppColors.secondary,
    paddingTop: Constants.statusBarHeight,
    borderWidth: 0.5,
    borderColor: AppColors.grey,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
