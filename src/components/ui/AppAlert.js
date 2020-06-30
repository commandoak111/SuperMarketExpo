import { Alert } from "react-native";
import {config} from "../../constants/index";

const AppAlert = (
  { message, options, cancelable } = {
    message: "",
    options: [{ text: "ok", onPress: () => {} }],
    cancelable: false
  }
) => {
    
  Alert.alert(config.app_name, message, options, { cancelable: cancelable });
};
export default AppAlert;
