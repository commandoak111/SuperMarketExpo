import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  AsyncStorage,
  Dimensions,
  Animated,
} from "react-native";
import Constants from "expo-constants";
import { AppColors, AppFonts } from "../../theme";
import { Loader, AppText, AppAlert } from "../../components/ui";
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

TAG = "Basket";
var SCREEN_HEIGHT = Dimensions.get("window").height;
var SCREEN_WIDTH = Dimensions.get("window").width;
const mapStateToProps = (state) => ({
  user_favorite: state.user.user_favorite,
  user_basket: state.user.user_basket,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updateUserFavorites: UserActions.updateUserFavorites,
  updateUserBasket: UserActions.updateUserBasket,
};
const marginAnim = new Animated.Value(100);

class Basket extends React.Component {
  constructor(props) {
    super(props);
    Animated.timing(marginAnim, {
      toValue: 0,
      duration: 600,
    }).start();
    this.state = {
      selected_quantity: 1,
    };
  }
  componentDidMount = async () => {
    this.getData();
  };
  getData = async () => {
    var user_basket = this.props.user_basket && this.props.user_basket;

    this.setState({ user_basket });
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
            marginLeft: 5,
            flex: 1,
          }}
        >
          <AppText style={[AppFonts.h3_bold]}>Basket</AppText>
        </View>
      </View>
    );
  };
  renderBody = () => {
    return (
      <FlatList
        style={{ marginTop: 10, flex: 1 }}
        data={this.state.user_basket}
        renderItem={this.userBasketData}
        keyExtractor={this.keyExtractor}
      />
    );
  };
  userBasketData = ({ item }) => {
    return (
      <Animated.View
        style={{
          height: 120,
          backgroundColor: AppColors.white,
          marginHorizontal: 10,
          marginBottom: 10,
          marginTop: marginAnim,
          flexDirection: "row",
          //   borderWidth:1,
          borderColor: AppColors.grey,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: this.state.selected
              ? AppColors.tertiary
              : AppColors.white,
            padding: 10,
          }}
        >
          <AppText style={AppFonts.h2_bold}>{item.name}</AppText>
          <AppText style={AppFonts.h4}>{item.brand}</AppText>
          <AppText style={[AppFonts.h2_bold, { color: AppColors.green }]}>
            ₹ {item.price}
          </AppText>
          <View style={{ flexDirection: "row", marginVertical: 10 }}>
            <View
              style={{
                height: 22,
                width: 22,
                borderRadius: 11,
                backgroundColor: item.color,
                marginRight: 10,
              }}
            ></View>
            <View
              style={{
                height: 22,
                width: 22,
                borderRadius: 11,
                backgroundColor: AppColors.background,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText style={[AppFonts.h5_bold]}>{item.size}</AppText>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              bottom: 10,
              right: 5,
            }}
          >
            <Entypo
              onPress={() => {
                this.changeItemQty(item, "minus");
              }}
              name="circle-with-minus"
              size={25}
              color={AppColors.secondary}
              style={{ marginHorizontal: 10 }}
            />
            <AppText style={[AppFonts.h3_bold]}>{item.qty}</AppText>
            <Entypo
              onPress={() => {
                this.changeItemQty(item, "add");
              }}
              name="circle-with-plus"
              size={25}
              color={AppColors.secondary}
              style={{ marginHorizontal: 10 }}
            />
          </View>
          <MaterialIcons
            onPress={() => {
              this.deleteBasketData(item);
            }}
            name="delete"
            size={25}
            color={AppColors.red}
            style={{ position: "absolute", top: 10, right: 10 }}
          />
        </View>
        <View
          style={{
            height: 120,
            width: 90,
            borderLeftWidth: 3,
            borderColor: AppColors.background,
          }}
        >
          <Image
            style={{ height: 120, width: 90, resizeMode: "contain" }}
            source={{
              uri: item.image,
            }}
          ></Image>
        </View>
      </Animated.View>
    );
  };

  changeItemQty = (item, flag) => {
    var user_basket = this.state.user_basket.slice(0);
    switch (flag) {
      case "add":
        var qty = item.qty + 1;
        var index = user_basket.findIndex((v) => {
          return v._id == item._id;
        });
        if (index != -1) {
          user_basket[index].qty = qty;

          this.setState({ user_basket });
          this.props.updateUserBasket(user_basket);
          AsyncStorage.setItem("user_basket", JSON.stringify(user_basket));
        }
        break;
      case "minus":
        var qty = item.qty - 1;
        if (qty > 0) {
          var index = user_basket.findIndex((v) => {
            return v._id == item._id;
          });
          if (index != -1) {
            user_basket[index].qty = qty;

            this.setState({ user_basket });
            this.props.updateUserBasket(user_basket);
            AsyncStorage.setItem("user_basket", JSON.stringify(user_basket));
          }
        }
        break;
      default:
        break;
    }
  };
  deleteBasketData = async (item) => {
    var user_basket = this.state.user_basket.slice(0);
    var index = user_basket.findIndex((v) => {
      return v._id == item._id;
    });
    if (index != -1) {
      user_basket.splice(index, 1);
      this.setState({ user_basket });
      this.props.updateUserBasket(user_basket);
      await AsyncStorage.setItem("user_basket", JSON.stringify(user_basket));
    }
  };
  keyExtractor = (item, index) => index.toString();
  checkOut = () => {
    return (
      <View style={{ justifyContent: "flex-end" }}>
        <TouchableOpacity
          onPress={() => {
            Actions.Checkout({
              callBack: () => {
                this.getData();
              },
            });
          }}
          style={{
            height: 40,
            backgroundColor: AppColors.green,
            marginHorizontal: 15,
            borderRadius: 20,
            marginBottom: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AppText style={[AppFonts.h3_bold, { color: AppColors.white }]}>
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
          { justifyContent: "center", backgroundColor: AppColors.white },
        ]}
      >
        <Image
          style={{
            height: 300,
            marginVertical: 20,
            resizeMode: "contain",
            alignSelf: "center",
          }}
          source={require("../../../assets/emptycart.png")}
        ></Image>

        <TouchableOpacity
          onPress={() => Actions.Home()}
          style={{
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 25,
            borderRadius: 20,
            backgroundColor: AppColors.secondary,
          }}
        >
          <AppText style={[AppFonts.h3_bold]}>START SHOPPING</AppText>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    if (this.state.user_basket && this.state.user_basket.length == 0) {
      return this.emptyBasketView();
    } else {
      return (
        <Animated.View style={styles.container}>
          {this.renderHeader()}
          {this.state.user_basket && this.renderBody()}
          {this.checkOut()}
        </Animated.View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    marginTop: Constants.statusBarHeight,
  },
  render_header: {
    height: 50,
    backgroundColor: AppColors.white,
    borderTopWidth: 0,
    borderWidth: 0.5,
    borderColor: AppColors.grey,
    flexDirection: "row",
    alignItems: "center",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Basket);
