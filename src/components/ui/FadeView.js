
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    Easing
} from "react-native";
import { AppColors, AppSizes, AppFonts } from "../../theme/index";
import { AppText } from "./index";

export default class FadeView extends React.Component {
    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
    }
    componentDidMount = () => {
       this.animate()
    };
    componentWillReceiveProps = nextProps => {

    };
    animate =()=>{
         this.animatedValue.setValue(0);
         Animated.timing(this.animatedValue, {
           toValue: 3,
           duration: 500,
           easing: Easing.ease
         }).start();
    }
    render = () => {
        if(this.props.animate && this.props.animate == true){
            this.animate()
        }
        const opacity = this.animatedValue.interpolate({
            inputRange: [0, 1, 2, 3],
            outputRange: [0, 0.4, 0.7, 1]
        });
        return <Animated.View onLayout={this.props.onLayout ? this.props.onLayout : () => { }} style={[this.props.style, { opacity: opacity }]}>
            {this.props.children}
        </Animated.View>;
    };
}

