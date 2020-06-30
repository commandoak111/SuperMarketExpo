// import { axios } from "@constant";
// import { axios as axios_raw } from "axios";
import axios from "axios";

import { AsyncStorage, Alert } from "react-native";
import AppConfig from "./config";
import { Actions } from "react-native-router-flux";
import { AppAlert } from "../components/ui/index";
import qs from "qs";
import * as UserActions from "../redux/user/actions";

let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

timeout = (ms, promise) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
};

const createNewAxiosInstance = (server) => {
  var axios_instance = axios.create({
    baseURL: server,
    // timeout: 4000
    // headers: { 'X-Custom-Header': 'foobar' }
  });
  // axios_instance.defaults.timeout = 1000;
  axios_instance.interceptors.request.use(
    function (config) {
      // Do something before request is sent

      console.log(
        "REQUEST INTERCEPTOR : " +
          config.baseURL +
          "/" +
          config.url +
          ": METHOD [" +
          config.method +
          "] =>",
        config
      );
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  axios_instance.interceptors.response.use(
    (response) => {
      console.log(
        "RESPONSE INTERCEPTOR : " +
          response.request._url +
          " : METHOD [" +
          response.request._method +
          "] =>",
        response
      );
      return response;
    },
    function (error) {
      const originalRequest = error.config;

      // Do something with response error
      if (
        error &&
        error.response &&
        error.response.status &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.url = originalRequest.url.replace(
                originalRequest.baseURL + "/",
                ""
              );

              originalRequest.headers["Authorization"] = "Bearer " + token;
              return axios_instance(originalRequest);
            })
            .catch((err) => {
              Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            var { data } = await UserActions.onRefreshToken();
            console.log("ApiUtils : onrefreshtokenpass ", data);

            await AsyncStorage.setItem("auth_token", data.access_token);
            originalRequest.url = originalRequest.url.replace(
              originalRequest.baseURL + "/",
              ""
            );

            originalRequest.headers["Authorization"] =
              "Bearer " + data.access_token;
            processQueue(null, data.access_token);
            isRefreshing = false;
            resolve(axios_instance(originalRequest));
          } catch (err) {
            console.log("ApiUtils : onrefreshtokenfail ", err);
            Actions.UserRegistration({ type: "reset", navigateid: 2 });
            processQueue(err, null);
            reject(err);
          }
        });
      } else if (error && error.response) {
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
  return axios_instance;
};

const get = ({ p_endpoint, p_config, logger_tag, p_host_name }) => {
  return new Promise(async (resolve, reject) => {
    try {
      var config = p_config ? p_config : {};
      var endpoint = p_endpoint ? p_endpoint : "";
      var resp;
      var axios_instance = createNewAxiosInstance(p_host_name);
      resp = await timeout(60000, axios_instance.get(endpoint, config));
      resolve(resp);
    } catch (error) {
      console.log(logger_tag + " : ERROR : ", error);

      if (error.response) {
        reject(error.response);
      } else {
        reject({
          message: "couldn't reach server",
        });
      }
      reject(error);
    }
  });
};

const post = ({
  p_endpoint,
  p_config,
  p_post_data,
  logger_tag,
  p_host_name,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      var config = p_config ? p_config : {};
      var endpoint = p_endpoint ? p_endpoint : "";
      var postdata = p_post_data;
      var resp;
      var axios_instance = createNewAxiosInstance(p_host_name);
      resp = await timeout(
        60000,
        axios_instance.post(endpoint, postdata, config)
      );

      resolve(resp);
    } catch (error) {
      console.log(logger_tag + " : ERROR : ", error);
      if (error.response) {
        reject(error.response);
      } else if (!error.status) {
        // AppAlert({
        //   message: "Couldn't reach server",
        //   cancelable: false
        // });

        reject({
          message: "couldn't reach server",
        });
      }
      reject(error);
    }
  });
};
export default {
  get,
  post,
};
