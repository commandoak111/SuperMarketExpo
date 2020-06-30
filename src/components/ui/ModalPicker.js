import React, { useState, useEffect } from "react";

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  AsyncStorage,
  FlatList,
  Image,
  Animated,
  Easing,
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

let TAG = "Animation component ";

import { connect } from "react-redux";
import { AppColors, AppFonts, AppAlert } from "../../theme/index";
import { Actions } from "react-native-router-flux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import * as UserActions from "../../redux/user/actions";
import { AppText, Loader } from "./index";
import { ScrollView } from "react-native-gesture-handler";

const ModalPicker = (props) => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  // additional
  const [header_height, setHearder_Height] = useState(100);
  const [image_height, setImage_Height] = useState(100);

  useEffect(() => {
    if (props.visible) {
      setVisible(props.visible);
    }
    if (props.data) {
      setData(props.data);
    }
    return function cleanup() {};
  });
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          height: 40,
          backgroundColor: AppColors.white,
          marginVertical: 10,
        }}
      >
        <AppText style={[AppFonts.h3_bold]}>{item.productname}</AppText>
      </TouchableOpacity>
    );
  };
  keyExtractor = (item, index) => index.toString();
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={() => setVisible(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems:"center",
          marginHorizontal: 15,
        }}
      >
        <FlatList
        contentContainerStyle={{alignSelf:"center"}}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        ></FlatList>
      </View>
    </Modal>
  );
};
export default ModalPicker;
