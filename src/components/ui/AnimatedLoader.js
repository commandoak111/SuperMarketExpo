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

const AnimationComponent = (props) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scrollY] = useState(new Animated.Value(0));
  const [value, setVaue] = useState(0);
  const [visible, setVisible] = useState(false);
  // additional
  const [header_height, setHearder_Height] = useState(100);
  const [image_height, setImage_Height] = useState(100);

  useEffect(() => {
    setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 300,
        // easing:Easing.back(),
        duration: 5000,
      }).start();
    }, 5000);

    if (props.visible) {
      setVisible(props.visible);
    }
    return function cleanup() {};
  });
  return (
    <Modal
      visible={props.visible}
      transparent={false}
      onRequestClose={() => setVisible(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: AppColors.background,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            height: 15,
            width: 300,
            borderRadius: 20,
            // overflow:"hidden",
            marginHorizontal: 20,
            backgroundColor: AppColors.white,
            justifyContent: "flex-start",
          }}
        >
          <Animated.View
            style={{
              height: 15,
              width: fadeAnim,
              borderRadius: 20,
              backgroundColor: AppColors.secondary,
              //   marginHorizontal:20
              // opacity: fadeAnim,
              // marginLeft: fadeAnim,
            }}
          ></Animated.View>
          <Text style={{ textAlign: "center", marginTop: 5 }}>Loading</Text>
        </View>
      </View>
    </Modal>
  );
};
export default AnimationComponent;
