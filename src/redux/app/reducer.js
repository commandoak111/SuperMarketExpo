const initialState = {};
export default function appReducer(state = initialState, action) {
  switch (action.type) {
    // focus action is dispatched when a new screen comes into focus
    case "FONT_LOADED": {
      if (action.data) {
        const input = action.data;
        return { ...state, fontLoaded: action.data };
      }
      return {};
    }
    default:
      return state;
  }
}
