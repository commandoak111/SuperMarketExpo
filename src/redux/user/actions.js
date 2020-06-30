import { axios, config, ApiUtils } from "../../constants/index";
import qs from "qs";
import { AsyncStorage } from "react-native";

// DefaultAjaxSettings

const getAuthToken = async () => {
  return new Promise(async (resolve, reject) => {
    var auth_token = await AsyncStorage.getItem("auth_token");
    resolve(auth_token);
  });
};
const getHostName = async () => {
  return config.host_name;
};
const getDefaultAjaxSettings = () => {
  return new Promise(async (resolve, reject) => {
    var stored_data = await Promise.all([getAuthToken(), getHostName()]);
    var auth_token = stored_data[0];
    var host_name = stored_data[1];
    var default_config = {
      headers: {
        Authorization: "Bearer " + auth_token,
      },
    };
    resolve({
      default_config,
      host_name,
    });
  });
};

// Local redux Storage

export const fontLoader = (payload) => {
  return async (dispatch) => {
    try {
      return dispatch({
        type: "FONT_LOADED",
        data: true,
      });
    } catch (error) {
      console.log("useractions : fontLoader : error => " + error);
    }
  };
};
export const onLogout = (payload) => {
  return async (dispatch) => {
    try {
      return dispatch({
        type: "LOG_OUT",
        data: true,
      });
    } catch (error) {
      console.log("useractions : onLogOut : error => " + error);
    }
  };
};
export const updateUserLocation = (data) => {
  return async (dispatch) => {
    try {
      return dispatch({
        type: "USER_LOCATION_UPDATED",
        data: data,
      });
    } catch (error) {
      console.log("useractions : updateUserLocation : error => " + error);
    }
  };
};

export const updateUserFavorites = (data) => {
  return async (dispatch) => {
    try {
      return dispatch({
        type: "USER_FAVORITE_UPDATED",
        data: data,
      });
    } catch (error) {
      console.log("useractions : updateUserFavorites : error => " + error);
    }
  };
};

export const updateUserBasket = (data) => {
  return async (dispatch) => {
    try {
      return dispatch({
        type: "USER_BASKET_UPDATED",
        data: data,
      });
    } catch (error) {
      console.log("useractions : updateUserBasket : error => " + error);
    }
  };
};
export const updateUserMarketBasket = (data) => {
  return async (dispatch) => {
    try {
      return dispatch({
        type: "USER_MARKET_BASKET_UPDATED",
        data: data,
      });
    } catch (error) {
      console.log("useractions : updateUserMarketBasket : error => " + error);
    }
  };
};

export const updateUserOrders = (data) => {
  return async (dispatch) => {
    try {
      return dispatch({
        type: "USER_ORDERS_UPDATED",
        data: data,
      });
    } catch (error) {
      console.log("useractions : updateUserOrders : error => " + error);
    }
  };
};
export const updateUserMarketOrders = (data) => {
  return async (dispatch) => {
    try {
      return dispatch({
        type: "USER__MARKET_ORDERS_UPDATED",
        data: data,
      });
    } catch (error) {
      console.log("useractions : updateUserMarketOrders : error => " + error);
    }
  };
};

export const updateUserNotifications = (data) => {
  return async (dispatch) => {
    try {
      return dispatch({
        type: "USER__NOTIFICATIONS_UPDATED",
        data: data,
      });
    } catch (error) {
      console.log("useractions : updateUserMarketOrders : error => " + error);
    }
  };
};

// Get Values from api

export const getOtp = (postdata) => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    default_config.headers["Content-Type"] = "application/json";

    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "MobileService/GetOtp",
      p_post_data: JSON.stringify(postdata),
      logger_tag: "getOtp",
    };
    return ApiUtils.post(api_config);
  };
};

export const verifyOtp = (postdata) => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    default_config.headers["Content-Type"] = "application/json";
    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "MobileService/Verifyotp",
      p_post_data: JSON.stringify(postdata),
      logger_tag: "verifyOtp",
    };
    return ApiUtils.post(api_config);
  };
};
export const createAccount = (postdata) => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    default_config.headers["Content-Type"] = "application/json";

    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "MobileService/Register",
      p_post_data: JSON.stringify(postdata),
      logger_tag: "createAccount",
    };
    return ApiUtils.post(api_config);
  };
};

export const userLogin = (postdata) => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    default_config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "token",
      p_post_data: qs.stringify(postdata),
      logger_tag: "userLogin",
    };
    return ApiUtils.post(api_config);
  };
};

export const getCityList = () => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "MobileService/CITYLIST",
      logger_tag: "getCityList",
    };
    return ApiUtils.get(api_config);
  };
};

export const getShopList = (id) => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "MobileService/SHOPLIST/" + id,
      logger_tag: "getShopList",
    };
    return ApiUtils.get(api_config);
  };
};

export const getCategoryList = (id) => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "MobileService/CATEGORYLIST/" + id,
      logger_tag: "getCategoryList",
    };
    return ApiUtils.get(api_config);
  };
};

export const getProducts = (id) => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "MobileService/PRODUCTLIST/" + id,
      logger_tag: "getProducts",
    };
    return ApiUtils.get(api_config);
  };
};

export const getUserAddress = () => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "ProfileService/GetAddress",
      logger_tag: "getUserAddress",
    };
    return ApiUtils.get(api_config);
  };
};
export const addUserAddress = (postdata) => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    default_config.headers["Content-Type"] = "application/json";

    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "ProfileService/AddAddress",
      p_post_data: JSON.stringify(postdata),
      logger_tag: "addUserAddress",
    };
    return ApiUtils.post(api_config);
  };
};

export const placeOrder = (postdata) => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    default_config.headers["Content-Type"] = "application/json";

    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "ProfileService/PlaceOrder",
      p_post_data: JSON.stringify(postdata),
      logger_tag: "placeOrder",
    };
    return ApiUtils.post(api_config);
  };
};
export const getActiveOrder = () => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "ProfileService/ActiveOrder",
      logger_tag: "getActiveOrder",
    };
    return ApiUtils.get(api_config);
  };
};
export const getCompletedOrder = () => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "ProfileService/CompletedOrder",
      logger_tag: "getCompletedOrder",
    };
    return ApiUtils.get(api_config);
  };
};
export const getCancelledOrder = () => {
  return async (dispatch) => {
    var { default_config, host_name } = await getDefaultAjaxSettings();
    var api_config = {
      p_config: default_config,
      p_host_name: host_name,
      p_endpoint: "OrderService/CanceledOrder",
      logger_tag: "getCancelledOrder",
    };
    return ApiUtils.get(api_config);
  };
};
