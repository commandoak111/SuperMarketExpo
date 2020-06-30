import React from "react";
import { Actions, Scene, ActionConst, Tabs } from "react-native-router-flux";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { AppColors } from "../theme/index";
// Verification
import MobileVerification from "../containers/verification/mobileverification";
import OtpVerification from "../containers/verification/otpverification";
import UserRegistration from "../containers/verification/userregistration";
import Notification from "../containers/app2/notification";
import Launch from "../splash/Launch";
import NetworkError from "../splash/Networkerror";
import Home from "../containers/app/home";
import Basket from "../containers/app/basket";
import Favorite from "../containers/app/favorite";
import Account from "../containers/app/account";
import Location from "../containers/app/location/location";
// SubCategories 
import SubCategories from "../containers/app/subCategories/subCategories";
import PreView from "../containers/app/subCategories/preview";
// Orders
import Orders from "../containers/app/orders/orders";
import Checkout from "../containers/app/orders/checkout";
import OrdersView from "../containers/app/orders/ordersview";
// Animation
import Animation from "../containers/app/Animation/animation";

// SuperMarket Aplication
import S_Home from "../containers/app2/home";
import S_Basket from "../containers/app2/basket";
import S_Categories from "../containers/app2/categories";
import S_Subcategories from "../containers/app2/subcategories";
import S_Account from "../containers/app2/account";
// Orders
import S_Orders from "../containers/app2/orders/orders";
import S_OrdersView from "../containers/app2/orders/ordersview";
import S_Checkout from "../containers/app2/orders/checkout";
import S_DeliveryAddress from "../containers/app2/orders/deliveryAddress";
import NewAddress from "../containers/app2/orders/newaddress";

const TabIcon = ({ title, focused }) => {
  //console.log(focused + " " + title);
  var icon = (
    <Ionicons
      name={"md-home"}
      size={25}
      color={focused ? AppColors.secondary : AppColors.white}
    />
  );
  if (title == "Home") {
    icon = (
      <Ionicons
        name={"md-home"}
        size={25}
        color={focused ? AppColors.secondary : AppColors.white}
      />
    );
  } else if (title == "Basket") {
    icon = (
      <FontAwesome
        name={"shopping-basket"}
        size={23}
        color={focused ? AppColors.secondary : AppColors.white}
      />
    );
  } else if (title == "Account") {
    icon = (
      <Ionicons
        name={"md-person"}
        size={25}
        color={focused ? AppColors.secondary : AppColors.white}
      />
    );
  } else if (title == "Favorite") {
    icon = (
      <MaterialIcons
        name={"favorite"}
        size={25}
        color={focused ? AppColors.secondary : AppColors.white}
      />
    );
  } else if (title == "Categories") {
    icon = (
      <Octicons
        name={"tasklist"}
        size={25}
        color={focused ? AppColors.secondary : AppColors.white}
      />
    );
  }
  return icon;
  // return <Text style={{ color: focused ? AppColors.app_color.primary : "black" }}>{title}</Text>;
};
const STabIcon = ({ title, focused }) => {
  //console.log(focused + " " + title);
  var icon = (
    <Ionicons
      name={"md-home"}
      size={25}
      color={focused ? AppColors.secondary : AppColors.white}
    />
  );
  if (title == "Home") {
    icon = (
      <Ionicons
        name={"md-home"}
        size={25}
        color={focused ? AppColors.secondary : AppColors.white}
      />
    );
  } else if (title == "Basket") {
    icon = (
      <FontAwesome
        name={"shopping-basket"}
        size={23}
        color={focused ? AppColors.secondary : AppColors.white}
      />
    );
  } else if (title == "Account") {
    icon = (
      <Ionicons
        name={"md-person"}
        size={25}
        color={focused ? AppColors.secondary : AppColors.white}
      />
    );
  } else if (title == "Favorite") {
    icon = (
      <FontAwesome
        name={"th-list"}
        size={25}
        color={focused ? AppColors.secondary : AppColors.white}
      />
    );
  } else if (title == "Categories") {
    icon = (
      <Octicons
        name={"tasklist"}
        size={25}
        color={focused ? AppColors.secondary : AppColors.white}
      />
    );
  }
  return icon;
  // return <Text style={{ color: focused ? AppColors.app_color.primary : "black" }}>{title}</Text>;
};


export default Actions.create(
  <Scene key={"root"} swipeEnabled={true}>
    {/* <Scene hideNavBar key={"Animation"} component={Animation} initial={true} /> */}
    <Scene hideNavBar key={"Launch"} component={Launch} initial={true} />
    <Scene hideNavBar key={"NetworkError"} component={NetworkError} />
    <Scene hideNavBar key={"MobileVerification"} component={MobileVerification} />
    <Scene hideNavBar key={"OtpVerification"} component={OtpVerification} />
    <Scene hideNavBar key={"UserRegistration"} component={UserRegistration} />
    <Scene hideNavBar key={"Notification"} component={Notification} />
    <Scene hideNavBar key={"Home"} component={Home} />
    <Scene hideNavBar key={"Location"} component={Location} />
    <Scene hideNavBar key={"Orders"} component={Orders} />
    <Scene hideNavBar key={"Checkout"} component={Checkout} />
    <Scene hideNavBar key={"OrdersView"} component={OrdersView} />
    <Scene hideNavBar key={"SubCategories"} component={SubCategories} />
    <Scene hideNavBar key={"PreView"} component={PreView} />
    
    <Tabs
      key="App"
      hideNavBar={true}
      // tabs={true}
      showLabel={false}
      tabBarStyle={{
        backgroundColor: AppColors.primary,
        elevation: 5,
        height: 50,
      }}
      legacy={true}
      swipeEnabled={true}
      hideTabBar={false}
      // tabBarComponent={()=>null}
      // tabBarPosition="bottom"
      // lazy
    >
      <Scene
        key="Home"
        title="Home"
        hideNavBar
        showLabel={false}
        icon={TabIcon}
        direction="vertical"
        component={Home}
        onEnter={() => Actions.refresh({})}
      />
      {/* <Scene
        key="SubCategories"
        title="Categories"
        hideNavBar
        showLabel={false}
        icon={TabIcon}
        direction="vertical"
        component={SubCategories}
      /> */}
      <Scene
        key="Favorite"
        title="Favorite"
        hideNavBar
        showLabel={false}
        icon={TabIcon}
        direction="vertical"
        component={Favorite}
        onEnter={() => Actions.refresh({})}
      />
      <Scene
        key="Account"
        title="Account"
        hideNavBar
        showLabel={false}
        icon={TabIcon}
        direction="vertical"
        component={Account}
      />
      <Scene
        key="Basket"
        title="Basket"
        hideNavBar
        showLabel={false}
        icon={TabIcon}
        direction="vertical"
        component={Basket}
        onEnter={() => Actions.refresh({})}
      />
    </Tabs>

    {/* Super market app  */}
    <Scene hideNavBar key={"S_Checkout"} component={S_Checkout} />
    <Scene hideNavBar key={"S_DeliveryAddress"} component={S_DeliveryAddress} />
    <Scene hideNavBar key={"NewAddress"} component={NewAddress} />
    <Scene hideNavBar key={"S_Subcategories"} component={S_Subcategories} />
    <Scene hideNavBar key={"S_Categories"} component={S_Categories} />
    <Scene hideNavBar key={"S_Orders"} component={S_Orders} />
    <Scene hideNavBar key={"S_OrdersView"} component={S_OrdersView} />
    
    <Tabs
      key="S_App"
      hideNavBar={true}
      // tabs={true}
      // tabBarOnPress={async (scene) => {
      //   console.log("index  :  scene ", scene.navigation.state.key);
      //   var routename = scene.navigation.state.key;
      //   // await Actions.refresh({ text: "color" });
      //   Actions.jump(routename, Actions.refresh({}));
      // }}
      showLabel={false}
      tabBarStyle={{
        backgroundColor: AppColors.primary,
        elevation: 5,
        height: 50,
      }}
      legacy={true}
      swipeEnabled={true}
      hideTabBar={false}
      // tabBarComponent={()=>null}
      // tabBarPosition="bottom"
      // lazy
    >
      <Scene
        key="S_Home"
        title="Home"
        hideNavBar
        showLabel={false}
        icon={STabIcon}
        direction="vertical"
        component={S_Home}
        onEnter={() => Actions.refresh({})}
      />
      <Scene
        key="S_Categories"
        title="Favorite"
        hideNavBar
        showLabel={false}
        icon={STabIcon}
        direction="vertical"
        component={S_Categories}
        onEnter={() => console.log("entered in actions categories")}
      />
      <Scene
        key="S_Account"
        title="Account"
        hideNavBar
        showLabel={false}
        icon={STabIcon}
        direction="vertical"
        component={S_Account}
        onEnter={() => Actions.refresh({})}
      />
      <Scene
        onEnter={() => Actions.refresh({})}
        key="S_Basket"
        title="Basket"
        hideNavBar
        showLabel={false}
        icon={STabIcon}
        direction="vertical"
        component={S_Basket}
        // onEnter={(scene) => {
        // console.log("index  :  scene in home", scene.navigation.state.key);

        //   Actions.jump("S_Basket", Actions.refresh({}));
        // }}
      />
    </Tabs>
  </Scene>
);
