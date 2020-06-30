import React from "react";
import { applyMiddleware, compose, createStore } from "redux";
import { connect, Provider } from "react-redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { Router } from "react-native-router-flux";

import AppRoutes from "./src/navigation/index";
// All redux reducers (rolled into one mega-reducer)
import rootReducer from "./src/redux/index";

import LogConfig  from "./src/constants/LogConfig";

// Connect RNRF with Redux
const RouterWithRedux = connect()(Router);

// Load middleware
let middleware = [
  thunk // Allows action creators to return functions (not just plain objects)
];
let store;
if (__DEV__) {
  middleware = [
    ...middleware,
    createLogger() // Logs state changes to the dev console
  ];
  LogConfig.configure({ enableLog: true });
}

store = compose(applyMiddleware(...middleware))(createStore)(rootReducer);

/* Component ==================================================================== */
// Wrap App in Redux provider (makes Redux available to all sub-components)

export default function AppContainer() {
  return (
    <Provider store={store}>
      <RouterWithRedux backAndroidHandler={() => false} scenes={AppRoutes} />
    </Provider>
  );
}
