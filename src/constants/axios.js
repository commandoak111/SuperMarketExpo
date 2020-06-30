import axios from "axios";
import config from "./config";
import { Actions } from "react-native-router-flux";
import { AppAlert } from "../components/ui";

const axios_instance = axios.create({
  baseURL: config.host_name,

  // timeout: 4000
  // headers: { 'X-Custom-Header': 'foobar' }
});

axios_instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    console.log("request interceptor =>" + JSON.stringify(config));

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios_instance.interceptors.response.use(
  (response) => {
    // alert(JSON.stringify(response));

    return response;
  },
  function (error) {
    // alert(JSON.stringify(error))
    // Do something with response error
    if (
      error &&
      error.response &&
      error.response.status &&
      error.response.status === 401
    ) {
      console.log("unauthorized, logging out ...");
      Actions.MobileVerification({ type: "reset" });
      alert("Session expired ...");
      return Promise.reject(error);
    } else if (error && error.response) {
      if (error.response.status === 504) {
        AppAlert({ message: "Could not reach server" });
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axios_instance;
