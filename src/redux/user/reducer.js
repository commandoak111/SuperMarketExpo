const initialState = {};
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    // focus action is dispatched when a new screen comes into focus
    case "FONT_LOADED": {
      if (action.data) {
        const input = action.data;
        return { ...state, fontLoaded: action.data };
      }
      return {};
    }
    case "USER_LOCATION_UPDATED": {
      if (action.data) {
        const input = action.data;
        return { ...state, user_location_data: action.data };
      }
      return {};
    }
    case "USER_FAVORITE_UPDATED": {
      if (action.data) {
        const input = action.data;
        return { ...state, user_favorite: action.data };
      }
      return {};
    }
    case "USER_BASKET_UPDATED": {
      if (action.data) {
        const input = action.data;
        return { ...state, user_basket: action.data };
      }
      return {};
    }
    case "USER_MARKET_BASKET_UPDATED": {
      if (action.data) {
        const input = action.data;
        return { ...state, user_market_basket: action.data };
      }
      return {};
    }
    case "USER_ORDERS_UPDATED": {
      if (action.data) {
        const input = action.data;
        return { ...state, user_orders: action.data };
      }
      return {};
    }
    case "USER__MARKET_ORDERS_UPDATED": {
      if (action.data) {
        const input = action.data;
        return { ...state, user_market_orders: action.data };
      }
      return {};
    }
    case "USER__NOTIFICATIONS_UPDATED": {
      if (action.data) {
        const input = action.data;
        return { ...state, user_notifications: action.data };
      }
      return {};
    }
    default:
      return state;
  }
}
