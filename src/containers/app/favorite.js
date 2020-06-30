import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";
import { AppColors, AppFonts } from "../../theme";
import { Loader, AppText } from "../../components/ui";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import * as UserActions from "../../redux/user/actions";
import { connect } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { Actions } from "react-native-router-flux";

TAG = "Favorite";
const mapStateToProps = (state) => ({
  user_favorite: state.user.user_favorite,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  updateUserFavorites: UserActions.updateUserFavorites,
};

class Favorite extends React.Component {
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
    await this.setState({ loading: true });
    var user_favorite =
      this.props.user_favorite != null ? this.props.user_favorite : [1, 2];

    await this.setState({ user_favorite });
    this.setState({ loading: false });
  };
  renderHeader = () => {
    return (
      <View style={styles.render_header}>
        <View
          style={{
            height: 40,
            justifyContent: "center",
            marginLeft: 20,
            flex: 1,
          }}
        >
          <AppText style={[AppFonts.h2_bold]}>Favorites</AppText>
        </View>
      </View>
    );
  };
  renderWishlist = () => {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.user_favorite}
          renderItem={this.wishListView}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  };
  wishListView = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.PreView({
            preview_data: item,
            callBack: async () => {
              await this.getData();
            },
          });
        }}
        style={{
          height: 100,
          flex: 1,
          margin: 10,
          marginHorizontal: 15,
          padding: 10,
          backgroundColor: AppColors.white,
          marginBottom: 5,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 86,
            width: 65,
            backgroundColor: AppColors.white,
            marginRight: 10,
            borderColor: AppColors.background,
            borderWidth: 1,
          }}
        >
          <Image
            style={{ height: 86, width: 63, resizeMode: "contain" }}
            source={{ uri: item.image }}
          ></Image>
        </View>
        <View style={{ height: 100, flex: 1, padding: 5 }}>
          <AppText style={[AppFonts.h2_bold]}>{item.name}</AppText>
          <AppText style={[AppFonts.h4]}>{item.brand}</AppText>
          <AppText style={[AppFonts.h1_bold]}>₹ {item.price}</AppText>

          <AppText
            style={[
              AppFonts.h4,
              {
                color:
                  item.available && item.available < 10
                    ? AppColors.red
                    : AppColors.green,
              },
            ]}
          >
            {item.available && item.available < 10 ? "Only" : null}{" "}
            {item.available} available
          </AppText>
        </View>
        <Entypo
          onPress={() => {
            this.deleteFromFavorite(item);
          }}
          name="circle-with-cross"
          size={25}
          color={AppColors.red}
          style={{ position: "absolute", top: 5, right: 5 }}
        />
      </TouchableOpacity>
    );
  };
  keyExtractor = (item, index) => index.toString();
  deleteFromFavorite = async (item) => {
    var user_favorite = this.state.user_favorite.slice(0);
    var index = user_favorite.findIndex((v) => {
      return v._id == item._id;
    });
    if (index != -1) {
      user_favorite.splice(index, 1);
      this.setState({ user_favorite });
      this.props.updateUserFavorites(user_favorite);
      await AsyncStorage.setItem(
        "user_favorite",
        JSON.stringify(user_favorite)
      );
    }
  };
  emptyListView = () => {
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
          onPress={() => Actions.App()}
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
    if (this.state.user_favorite && this.state.user_favorite.length == 0) {
      return this.emptyListView();
    } else {
      return (
        <View style={styles.container}>
          <Loader visible={this.state.loading}></Loader>
          {this.renderHeader()}
          {this.state.user_favorite && this.renderWishlist()}
        </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(Favorite);
