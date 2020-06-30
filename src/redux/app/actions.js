

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