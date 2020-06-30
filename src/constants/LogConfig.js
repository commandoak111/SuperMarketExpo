// import Reactotron, { trackGlobalErrors } from "reactotron-react-native";
// import apisaucePlugin from "reactotron-apisauce"; // <--- import
// import { reactotronRedux } from "reactotron-redux";
// import sagaPlugin from "reactotron-redux-saga";

// console.tron = Reactotron;

// Reactotron.configure() // we can use plugins here -- more on this later
//   .use(trackGlobalErrors()) // <--- here we go!
//   .use(apisaucePlugin())
//   .use(reactotronRedux())
//   .use(sagaPlugin())
//   .connect(); // let's connect!

// export default Reactotron;
/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, July 2018
 */
/**
 * Log helper using Reactotron https://github.com/infinitered/reactotron
 * - log faster than console because no need to turn-on remote debug
 * - able to customize the message
 */
// import DeviceInfo from "react-native-device-info";
// import Reactotron from "reactotron-react-native";
import Reactotron, { trackGlobalErrors } from "reactotron-react-native";
// import { reactotronRedux } from "reactotron-redux";
// import { reactotronRedux as reduxPlugin } from "reactotron-redux";
// import sagaPlugin from "reactotron-redux-saga";
import { reactotronRedux } from "reactotron-redux";
// import apisaucePlugin from "reactotron-apisauce"; // <--- import
let isLogEnable = false;
/**
 * Configure Reactotron and redirect console.log to Reactotron.log
 */
const configure = (options = {}) => {
  isLogEnable = options.enableLog ? options.enableLog : false;
  configureReactotron();
  connectConsoleToReactotron(); 
};

const configureReactotron = () => {
  Reactotron.configure({
    name: "App",
    // host: "192.168.42.223",
    host: "192.168.43.84",
    // host:"192.168.100.108"
  })

    .useReactNative()
    .use(trackGlobalErrors()) // <--- here we go!

    .use(reactotronRedux())

    .connect();

  // clear log on start
  Reactotron.clear();
};

const connectConsoleToReactotron = () => {
  console.info = info;
  console.log = log;
  console.warn = warn;
  console.error = error;
};

const log = (...args) => {
  if (!isLogEnable) return;
  // const yeOldeConsoleLog = console.error;
  // yeOldeConsoleLog(...args);
  Reactotron.display({
    name: "LOG",
    value: args,
    preview: args.length > 0 && typeof args[0] === "string" ? args[0] : null
  });
};

const info = (...args) => {
  if (!isLogEnable) return;
  // const yeOldeConsoleLog = console.error;
  // yeOldeConsoleLog(...args);
  Reactotron.display({
    name: "INFO",
    value: args,
    preview: args.length > 0 && typeof args[0] === "string" ? args[0] : null
  });
};
const warn = (...args) => {
  if (!isLogEnable) return;
  // const yeOldeConsoleLog = console.error;
  // yeOldeConsoleLog(...args);
  Reactotron.display({
    name: "WARN",
    value: args,
    preview: args.length > 0 && typeof args[0] === "string" ? args[0] : null,
    important: true
  });
};
const error = (...args) => {
  if (!isLogEnable) return;
  // const yeOldeConsoleLog = console.error;
  // yeOldeConsoleLog(...args);
  Reactotron.display({
    name: "ERROR",
    value: args,
    preview: args.length > 0 && typeof args[0] === "string" ? args[0] : null,
    important: true
  });
};

export default { configure };
