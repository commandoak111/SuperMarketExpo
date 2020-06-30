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

let TAG = "SubCategories ";

import { connect } from "react-redux";
import { AppColors, AppFonts, AppAlert } from "../../../theme/index";
import { Actions } from "react-native-router-flux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import * as UserActions from "../../../redux/user/actions";
import { AppText, Loader } from "../../../components/ui/index";
import { TextInput } from "react-native-gesture-handler";
const mapStateToProps = (state) => ({
  user_favorite: state.user.user_favorite,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updateUserFavorites: UserActions.updateUserFavorites,
  getProducts: UserActions.getProducts,
};

class SubCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modal_visible: false,
      active_color: false,
      selected_category: {
        name: "Casual shirts",
      },
      initial_categorydata: [
        { name: "Casual shirts" },
        { name: "Formal shirts" },
        { name: "Jackets" },
        { name: "Polos" },
        { name: "T-Shirts" },
      ],
      main_categoriesdata: [
        {
          color: ["blue", "red", "green", "yellow"],
          size: ["XS", "S", "M", "L", "XL", "XXL"],
          _id: "5e91d151e056e1468044b1b6",
          name: "T-Shirt",
          category_id: 101,
          subcategoryid: 202,
          price: 120,
          description: "nightwear and good product in cotton",
          brand: "polo",
          available: 6,
          image:
            "data:image/jpeg;base64,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",
        },
        {
          color: ["red", "white", "black", "blue"],
          size: ["XS", "S", "M", "L", "XL", "XXL"],
          _id: "5e91d88ce056e1468044b1b7",
          category_id: 101,
          subcategoryid: 202,
          name: "casual pants",
          price: 240,
          description: "nightwear and good product in cotton",
          brand: "otto",
          available: 4,
          image:
            "https://5.imimg.com/data5/RA/TF/MY-45478365/selection_225-500x500.png",
        },
        {
          color: ["red", "white", "black", "blue"],
          size: ["XS", "S", "M", "L", "XL", "XXL"],
          _id: "5e91d92de056e1468044b1b8",
          subcategoryid: 202,
          category_id: 101,
          name: "Shirt",
          price: 220,
          description: "nightwear and good product in cotton",
          brand: "Tommy",
          available: 50,
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ3bE-YqZTGWEf6nAp8FBcfvIwc6_FuwxJcmgs5A5Jci_WD93TM&usqp=CAU",
        },
        {
          color: ["red", "white", "black", "blue"],
          size: ["XS", "S", "M", "L", "XL", "XXL"],
          _id: "5e91d9fce056e1468044b1b9",
          subcategoryid: 202,
          category_id: 101,
          name: "cotton shirt",
          price: 150,
          description: "nightwear and good product in cotton",
          brand: "Basics",
          available: 13,
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQekcW4dM1FEbpPIbTq9ERWGk_x0xpmOoxyF2GyVHaggVlOxvf8&usqp=CAU",
        },
        {
          color: ["red", "white", "black", "blue"],
          size: ["XS", "S", "M", "L", "XL", "XXL"],
          _id: "5e91da68e056e1468044b1ba",
          subcategoryid: 202,
          category_id: 101,
          name: "poomex inner Wear",
          price: 320,
          description: "nightwear and good product in cotton",
          brand: "Solly",
          available: 9,
          image:
            "data:image/jpeg;base64,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",
        },
        {
          color: ["red", "white", "black", "blue"],
          size: ["XS", "S", "M", "L", "XL", "XXL"],
          _id: "5e91dae0e056e1468044b1bb",
          subcategoryid: 202,
          category_id: 101,
          name: "Work Wear",
          price: 570,
          description: "nightwear and good product in cotton",
          brand: "Crocodile",
          available: 7,
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTbIadrRnejBEcaz8tyOWaMdR-dE3DILCEMF9qXZoQTkGo_tUxK&usqp=CAU",
        },
        {
          color: ["red", "white", "black", "blue"],
          size: ["XS", "S", "M", "L", "XL", "XXL"],
          _id: "5e91db53e056e1468044b1bc",
          subcategoryid: 202,
          category_id: 101,
          name: "Night wear",
          price: 550,
          description: "nightwear and good product in cotton",
          brand: "pommies",
          available: 2,
          image:
            "https://i.pinimg.com/236x/63/90/8d/63908d609da71d33a5eabb0dc274cc59--picasso-paintings-art-paintings.jpg",
        },
        {
          color: ["red", "white"],
          size: ["XS", "S", "L", "M"],
          _id: "5e9333662993795af4af3c0a",
          name: "rocodile T-Shirt",
          category_id: 101,
          subcategoryid: 202,
          price: 499,
          description: "very good product",
          available: 4,
          brand: "Crocodile",
          image:
            "data:image/jpeg;base64,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",
          __v: 0,
        },
      ],
    };
  }
  componentDidMount = async () => {
    this.getData();
  };
  componentWillUnmount = async () => {
    if (this.props.callBack) {
      this.props.callBack();
    }
  };
  getData = async () => {
    this.setState({ loading: true });
    var navigate_id = this.props.navigate_id;
    var category_name = this.props.category_name;
    // try {
    //   var resp = await this.props.getProducts();
    //   this.setState({ main_categoriesdata: resp.data });
    // } catch (error) {}
    await this.updateFavoriteState();
    this.setState({ navigate_id, category_name });
    console.log(
      TAG + "didmount  :  navigate _id ",
      navigate_id,
      category_name,
      // resp.data,
      this.state.main_categoriesdata,
      this.props.user_favorite
    );

    this.setState({ loading: false });
  };
  updateFavoriteState = async () => {
    var user_favorite =
      this.props.user_favorite != null ? this.props.user_favorite.slice(0) : [];
    var main_categoriesdata = this.state.main_categoriesdata.slice(0);
    if (user_favorite.length != 0) {
      user_favorite.forEach((v) => {
        main_categoriesdata.forEach((u, k) => {
          if (v._id == u._id) {
            main_categoriesdata[k] = v;
          }
        });
      });
      await this.setState({ main_categoriesdata });
    }
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
          <AppText style={[AppFonts.h3_bold]}>
            {this.state.category_name && this.state.category_name}
          </AppText>
        </View>
      </View>
    );
  };
  renderSubHeader = () => {
    return (
      <View style={{ height: 50, backgroundColor: AppColors.white }}>
        <FlatList
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
        onPress={() => this.setState({ selected_category: item })}
        style={{
          height: 30,
          minWidth: 80,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 0.5,
          marginHorizontal: 10,
          paddingHorizontal: 10,
          borderColor: AppColors.grey,
          backgroundColor:
            this.state.selected_category &&
            this.state.selected_category.name == item.name
              ? "orange"
              : null,
        }}
      >
        <AppText style={AppFonts.h3_bold}>{item.name}</AppText>
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
          backgroundColor: AppColors.background,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 40,
            width: "90%",
            alignItems: "flex-start",
            justifyContent: "center",
            marginLeft: 10,
          }}
        >
          <AppText style={[AppFonts.h4_bold, { textAlign: "left" }]}>
            {qty} products
          </AppText>
        </View>
        <FlatList
          contentContainerStyle={{ marginTop: 0 }}
          numColumns={2}
          data={this.state.main_categoriesdata}
          renderItem={this.mainCategoryList}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  mainCategoryList = ({ item, index }) => {
    var current_width = this.state.screenWidth;

    return (
      <View
        style={{
          borderWidth: 5,
          borderColor: AppColors.white,
          margin: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            Actions.PreView({
              preview_data: item,
              callBack: async () => {
                var main_categoriesdata = [
                  {
                    color: ["blue", "red", "green", "yellow"],
                    size: ["XS", "S", "M", "L", "XL", "XXL"],
                    _id: "5e91d151e056e1468044b1b6",
                    name: "T-Shirt",
                    category_id: 101,
                    subcategoryid: 202,
                    price: 120,
                    description: "nightwear and good product in cotton",
                    brand: "polo",
                    available: 6,
                    image:
                      "data:image/jpeg;base64,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",
                  },
                  {
                    color: ["red", "white", "black", "blue"],
                    size: ["XS", "S", "M", "L", "XL", "XXL"],
                    _id: "5e91d88ce056e1468044b1b7",
                    category_id: 101,
                    subcategoryid: 202,
                    name: "casual pants",
                    price: 240,
                    description: "nightwear and good product in cotton",
                    brand: "otto",
                    available: 4,
                    image:
                      "https://5.imimg.com/data5/RA/TF/MY-45478365/selection_225-500x500.png",
                  },
                  {
                    color: ["red", "white", "black", "blue"],
                    size: ["XS", "S", "M", "L", "XL", "XXL"],
                    _id: "5e91d92de056e1468044b1b8",
                    subcategoryid: 202,
                    category_id: 101,
                    name: "Shirt",
                    price: 220,
                    description: "nightwear and good product in cotton",
                    brand: "Tommy",
                    available: 50,
                    image:
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ3bE-YqZTGWEf6nAp8FBcfvIwc6_FuwxJcmgs5A5Jci_WD93TM&usqp=CAU",
                  },
                  {
                    color: ["red", "white", "black", "blue"],
                    size: ["XS", "S", "M", "L", "XL", "XXL"],
                    _id: "5e91d9fce056e1468044b1b9",
                    subcategoryid: 202,
                    category_id: 101,
                    name: "cotton shirt",
                    price: 150,
                    description: "nightwear and good product in cotton",
                    brand: "Basics",
                    available: 13,
                    image:
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQekcW4dM1FEbpPIbTq9ERWGk_x0xpmOoxyF2GyVHaggVlOxvf8&usqp=CAU",
                  },
                  {
                    color: ["red", "white", "black", "blue"],
                    size: ["XS", "S", "M", "L", "XL", "XXL"],
                    _id: "5e91da68e056e1468044b1ba",
                    subcategoryid: 202,
                    category_id: 101,
                    name: "poomex inner Wear",
                    price: 320,
                    description: "nightwear and good product in cotton",
                    brand: "Solly",
                    available: 9,
                    image:
                      "data:image/jpeg;base64,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",
                  },
                  {
                    color: ["red", "white", "black", "blue"],
                    size: ["XS", "S", "M", "L", "XL", "XXL"],
                    _id: "5e91dae0e056e1468044b1bb",
                    subcategoryid: 202,
                    category_id: 101,
                    name: "Work Wear",
                    price: 570,
                    description: "nightwear and good product in cotton",
                    brand: "Crocodile",
                    available: 7,
                    image:
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTbIadrRnejBEcaz8tyOWaMdR-dE3DILCEMF9qXZoQTkGo_tUxK&usqp=CAU",
                  },
                  {
                    color: ["red", "white", "black", "blue"],
                    size: ["XS", "S", "M", "L", "XL", "XXL"],
                    _id: "5e91db53e056e1468044b1bc",
                    subcategoryid: 202,
                    category_id: 101,
                    name: "Night wear",
                    price: 550,
                    description: "nightwear and good product in cotton",
                    brand: "pommies",
                    available: 2,
                    image:
                      "https://i.pinimg.com/236x/63/90/8d/63908d609da71d33a5eabb0dc274cc59--picasso-paintings-art-paintings.jpg",
                  },
                  {
                    color: ["red", "white"],
                    size: ["XS", "S", "L", "M"],
                    _id: "5e9333662993795af4af3c0a",
                    name: "rocodile T-Shirt",
                    category_id: 101,
                    subcategoryid: 202,
                    price: 499,
                    description: "very good product",
                    available: 4,
                    brand: "Crocodile",
                    image:
                      "data:image/jpeg;base64,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",
                    __v: 0,
                  },
                ];
                await this.setState({ main_categoriesdata });
                this.getData();
              },
            });
          }}
          style={{
            backgroundColor: AppColors.white,
          }}
        >
          <Image
            style={{ height: 200, width: 150, resizeMode: "contain" }}
            source={{ uri: item.image }}
          ></Image>
          <TouchableOpacity
            onPress={async () => {
              this.updateUserFavoriteData(item);
            }}
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 5,
              right: 5,
            }}
          >
            {item.active_color == true ? (
              <AntDesign name="heart" size={22} color={AppColors.red} />
            ) : (
              <AntDesign name="hearto" size={22} color={AppColors.grey} />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
        <AppText style={[AppFonts.h2_bold, { marginLeft: 5 }]}>
          ₹ {item.price}
        </AppText>
        <AppText
          style={[
            AppFonts.h3_bold,
            {
              numberOfLines: 2,
              marginLeft: 5,
              color: AppColors.grey,
              width: 150,
            },
          ]}
        >
          {item.name}
        </AppText>
      </View>
    );
  };
  updateUserFavoriteData = async (item) => {
    var SUBTAG = "updateUserFavoriteData";
    var active_color = !this.state.active_color;
    var user_favorite =
      this.props.user_favorite != undefined ? this.props.user_favorite : [];
    console.log(TAG + SUBTAG + "userfavorite  :  ", user_favorite);

    if (user_favorite.length != 0) {
      var index = user_favorite.findIndex((v) => {
        return v._id == item._id;
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
  render() {
    return (
      <View style={styles.container}>
        <Loader visible={this.state.loading}></Loader>
        {this.renderHeader()}
        {this.renderSubHeader()}
        {this.renderFilterBar()}
        {this.state.main_categoriesdata && this.renderMainCategories()}
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
    backgroundColor: AppColors.white,
    borderWidth: 0.5,
    borderColor: AppColors.grey,
    flexDirection: "row",
    alignItems: "center",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(SubCategories);
