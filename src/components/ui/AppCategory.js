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
  MaterialIcons,
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
import { AppText, Loader, CollapseView } from "./index";
import { ScrollView } from "react-native-gesture-handler";

const AppCategory = (props) => {
  const [item, setItem] = useState(0);
  const [data, setData] = useState(0);

  useEffect(() => {
    if (props.item) {
      setItem(props.item);
      setData(props.item)
    }
    
    return function cleanup() {};
  });

  keyExtractor = (value, index) => index.toString();
  ResultView = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (props.OnSelectCategory) {
            props.OnSelectCategory(data, item);
          }
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
        {/* <Feather name="check" size={20} style={{ margin: 10 }} /> */}
        <AppText
          style={[AppFonts.h4_bold, { textAlign: "left", marginLeft: 10 }]}
        >
          {item.name}
        </AppText>
      </TouchableOpacity>
    );
  };
  return (
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
              <AntDesign name="downcircleo" size={20} style={{ margin: 10 }} />
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
                renderItem={ResultView}
                keyExtractor={keyExtractor}
              />
            </ScrollView>
          </View>
        );
      }}
    />
  );
};
export default AppCategory;
