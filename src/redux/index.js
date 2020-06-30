import { combineReducers } from "redux";
import user from "./user/reducer";
import app from "./app/reducer";

const appReducer = combineReducers({
  user,
  app,
});
const rootReducer = (state, action) => {
  const newState =
    action.type === "LOG_OUT"
      ? {
          app: state.app,
          user: {
            fontLoaded: true,
            user_market_basket: [],
            user_notifications: [],
          },
        }
      : state;
  return appReducer(newState, action);
};

export default rootReducer;
