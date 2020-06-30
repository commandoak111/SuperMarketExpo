import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  AsyncStorage,
  Animated,
} from "react-native";
import Constants from "expo-constants";
import { AppColors, AppFonts } from "../../theme";
import { AppText, Loader } from "../../components/ui";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome,
} from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import * as UserActions from "../../redux/user/actions";
import { Actions } from "react-native-router-flux";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const TAG = "Home ";

const mapStateToProps = (state) => ({
  user_location_data: state.user.user_location_data,
  user_basket: state.user.user_basket,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  fontLoader: UserActions.fontLoader,
  getProducts: UserActions.getProducts,
  updateUserLocation: UserActions.updateUserLocation,
};

const marginAnim = new Animated.Value(100);
class Home extends React.Component {
  constructor(props) {
    super(props);
    Animated.timing(marginAnim, {
      toValue: 0,
      duration: 800,
    }).start();
    this.state = {
      loading: false,
      selected_category: {
        name: "Men",
      },
      initial_categorydata: [
        { name: "Men" },
        { name: "Women" },
        { name: "Boy" },
        { name: "Girl" },
        { name: "child" },
      ],
      main_categoriesdata: [
        {
          name: "Top Wear",
          image:
            "https://reddapparel.in/wp-content/uploads/2018/11/5G5A9549-copy-1.png",
        },
        {
          name: "Bottom Wear",
          image:
            "https://5.imimg.com/data5/RA/TF/MY-45478365/selection_225-500x500.png",
        },
        {
          name: "Footwear",
          image:
            "data:image/jpeg;base64,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",
        },
        {
          name: "Active Wear",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQekcW4dM1FEbpPIbTq9ERWGk_x0xpmOoxyF2GyVHaggVlOxvf8&usqp=CAU",
        },
        {
          name: "Inner Wear",
          image:
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExIWFhUWGRsYGBgYGBYaGBgdHhcbHhoXGBUaHSggGBolHxYfITEhJSkrLi4uGyMzODMtNygtLisBCgoKDQ0ODg8NDy0ZFRkrKystNy0rKy0tKystKy0tLTc3LSsrNys3LSstKzcrLSsrKystKysrKysrKysrKysrK//AABEIAM4A9QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAwQFBgcCAQj/xABVEAACAAQCBAgJCAYGBwkBAAABAgADBBESITFBgZEFEyJRYXGhsQYHFDJSgpKisiNCYnKzwcLDg5OjtNHSM1NUc6TTFWNkhJTE8BckNENE1OHk8Qj/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/ANpggggCCCCAIIIIAggggCCPbQhPq5aefMRfrMo7zALQRCVPhhwfLNnrqYHm46WTuBvETV+NHgmXprVP1Emv2qhEBcYIz2d45eCl0TJrdUpvxWhjN8efBw0SqpupJY75kBqEEZSfHvQ/2ap3Sv548/7d6L+zVP7L+eA1eCMqHj2of7NVbpX+ZC0vx5cHnTJqh1pL+6ZAafBGcy/HTwWdJnr1yv4MYdS/G/wQdNSw65M77lMBfIIq9H4xOC5vm18kfXJl/aARPUfCMmaLyp0uYPoOrdxgHUEFoIAggggCCCCAIIIIAggggCCCCAIIIIAggjifOVFZ3IVVBZidAAFyTsEBlvjr8O51FxNPSTeLnN8pMYBSQmYVbMCOUbm+nkjnjHqvxgcKTPOr6gfVcp8Fo78K6mdwjWzqlUJ4xjgXWEWyotjoOG2Ws3iAn8HzU86U46cJscyLg6CMjmIBxU8OVMz+kqZz/WmzG7zDAxzHt4AAj3D0jfAGj3HAeiUx0CFpfB81sxLY9QMNmMAMA5/0fN0cU+v5p1Gx1c4gFFNsG4p7ab4TbXrt0HdHMurmDRMcdTEQqvCU4DDx0y3NiNteq/Sd5grteC598PETL82Br6baCOc2jmbRzV0ynHWrd9oX/wBOVJOLyibe974jz37xePf9OVVreUTLfWPR/AboBi0htatuMc8QeY7oczeFp50zph9Y81u7KGrVLnSxO0wQcQeaOcJHQY5vBATFF4TVsq3F1s9LalnTAPZvYxYqLxp8Ky//AFmMDU8uW19uG/bFGEdqt4K33xX+MqpraryapEohkYqyKVbEudjyiCLX1DRGsx8teLCp4rhKkPPNVfbun4o+pYFEEEEEEEEEAQQQQBBBBAEEEEARmXjz8ITJpko0JxVJPGEaRLUi49ZiB1Bo02PnHxv8JcdwrNTSJISUObJQze853RKsIeD1PmQCA1lRTawBw8qab8wJt9HFrESrKGnYV5FxhTnQGXYHPWsoFj9KWeeIvwWOJ3+dZbWPziW831iQn1WY6ol+C1DTGnsbrYqD6SEsZj9bJLmN0caOeCkq/g+QZlmkKQFSUAQCRykUBfpKJkwdcsGIup8FKfiy5Q3sZhKMRYEO+EKb5BOKHXN6okqhi1TxbZE2F/pMzBm2TJrnZE1OONbgZnEQDl5yo0teizTadf0cEZvUeDMtVBacwPFJMIwg5smIoMxqsB1iE5vgZOANnlkghSOVfEVvhGWfmsOtOkRPeFAwnEgyF7HoQME2YEQ+tE5InXSU2Zv8pnpJtyNp4rP+/wCmKYz6o8EapASUUhSRk66tNs9EN28G6sf+Q+wAnLTkOo7o0qrpxjlg4ipJXJSbgNLlYjbUVls3TcwrU1S4DMJs2FiLi1maW7n3qtR6sDGStQTQLmU4AsScLWAIBBJtlk6n1hzx1/o2fe3Ezb82Br6AdFuYg7RGmVVfJvMQuhuXBW40JiA92lQbViXIHGS3xjkmxNxzlCf2SwGNpRzToluepW5r83NnHRoZ1wOJmcq1hgbO5sLZZ5m0a7waTxgzvdJGeolnkL3XEKLMPFS21rLQ9REuTM3greAyEcEzyL8RNIsDfA1rG1je3SN8Oh4MVX9nYZ4Tewsb2INzlnzxqVTKZJc0G9w0wDq4+ThHUFmCHDyw5PosXv04mnyz9pLO6AzOR4D1bEXRFuwXlOMicNgbX1uo6zaHlJ4BO9/lkuFVsIDEnEoZQCbZnHLHW9tUXahn2epBPmT3YDSbFZVQuz5BhD55JD2UAFfkwejFNlqL82KXIbdEFLTwCkALefMdmJsAAuIWU3U2NyQwIB0l0XXeJFPBGmlsuKXjRlVi5Z+QWbkHI2MtrYSbXzJyAiwsyki2SKQeay5a+iVUIw6ZHRCySiwOIA4k4uYo2owA6xNUcwsdUFMV4Ap1MuZIky0a1wSoyYC6H6JxLiB1WIOkCNi4MrROlJNGh1BtrB1gjUQcoy3g0EDA2ZWxB6G5Vx+kWYfUWL54Gz7ymTLktcW0Wbm2gwSrBBBBFQQQQQBBBBAEEEEAQQQQBePknhesM2qmz9PGTXces5IHbaPqXwkq+KpKib6EmY25CRHylTrYjosd1oixJcEVJlzLjzT53VY3G4ldpi5cDTxgva9hmBrC2LC3SsiWv6XpikS1t2j2liX4E4TMpsxfWL84UMB1YpaX6oCVrJR8pVb5kFMXOxxIW/W4jFgEwkYlscXKXrJmNLGw8RES7A5rmUxFefkg4fsUPXNMSkogXC6VxBfVBVf3O+2CoDh6mTiCoOp8J6LS0TesxDDTwUrCyqlxiBAXryC++knYDE1wtJAVltYLew6FmzCo9mkEUzwem8VNz+bjG3izb3lgi91IvnLvZZQCDm+QITbepW/THVRylmZeb+Key/DJSHNOiiaw9FlGxZ0te6lhl5qMDpwITs8lv2zXiqQE7jJYJAuyX9qSP/cNEhMdeMNwDyydA/rKxvyxEbSS7Kg6FGzi6IfihaoU6QMyG+zrTeIOZE4CpVBl8lJ6rpUSr2EPnl2lkD0CP8PNA3YAIhaoMKmUw5nX3g/5XbFjK3PRe3vT1PfAdV64yxOsm/NYTaf8KXiP4OnYFBb5l7+oKdzvMp+2HtVNAQ85Vjt4lj3yDuhKbKBZ1OhnYe3MqJX50vsgGdV8k5mDO3Fh+kymeWPaEl165ohWRNsQl7EYUDacwypjO6mmb+eE6ityxkZEB7bJU+29Zo3x4lKT8mMv/Lvr0vT3P7E7BASCIpGd8JFiD81bYSPVl1DD/d+iFZTHSxsdLW1XA4y3U0mo3wjKmAgFsgxBN9Qfii3ZWTd8IVHCKqpxEYiDfrKOD77Pf60BIldF8jbD0ZYGI6gSUHWxizeBlT8s6X85LjYR/NFRo+FZM0kFrHE2Ry85iQfft/0Is3gvT4apSDkVbaLX09cBeoIIIrIggggCCCCAIIIIAggggKn41Kri+Cqo+kqy/bdV7mj53pBnfmz/AI9kbf49arDwcif1k9B7Ks/eojFeD1ByPRuOR74iw+ky1JUHKxGf1Wtnsa+yPPImsOe34XXvS0dSxqOvI7QUPaBD1JhAxjR53Yr96v2wBwVVFX5WgG+55JPYvbFn4HOIKNN8N/2Us9s6cYrDAMCotexXcJi96JExwZPIUsumxI6wJrge1Ol9kA8r5eNLH54G9klL/wA20Z9WrhnFtTEkbWLdzCNMqSFvzKSR1S2nEdlKkUXwposDC2gcnqwCWh7ZbQFppKy+N+lidi1czvIh3w2wEuaRqVh7Mx8t1ON0QHAk66MPSDD2kZfxmJvhgFpM8A5lZxG3y4g9kB0gAZesDtoVIhGqtxeIf1bH9hVH8UMeFOGlksMsT3BKDV/4aYDo0HARCvB9as2QzD5qMp6xSkH4zBStQlqjCf8AWW61SoB7ok66YQHtp+U0c/8A3oi22XDfhFeWzDVxo3+XX7o6qJy8YQPTG41J/DVwHc2YMdjre2zyh1+CsEMHmNhxHzsJIHTxEuZ8dK0eopMvEfOwX2+TI/xUh2w/SQBMzzGO2zyll+CrEAnLolL4ToLYQOjjnl/BVLBKnZK2k2U9Zw0cwjejGO5bkKrawqttEqmfvkmFpUlUIuclYX6keZf3JTezAMDJZgbtkBvtKuNhVALdEO0opSNmt8LG5OeSvNN+u0gjpxCFPMyPzbXGvkBcQ2+TT12jnhWUcJzztp6cIGLYfJ22TxAIDg2WcIKLcYQch80HHn6wX/8AItHgMlpmEkmyggnpUgjaADECBh5JztgU9Nhcna1zE14MVAWePpEg77DsgL9BBBFZEEEEAQQQQBBBBAEEEEBkX/8AQFVyaSVzmY52BFHxmMro1z6NG+L74+p962RL9CRi9uY/+XFDpB/D7x3RFS6Asv0rE9Rtf4pR9qHNIvnSzrJA2sVHZUXhGkOd+blbsMw9geF0XDbnAvtQf/XvAcTpR88HSwPtMjfmiOuAqwDBiOgqT1ASWPZKhcixAOgEdjJ/kRDVi4QLeiR+yt90BfJIJVUbMkKhPOSJCEn1qiZ2xAeEtLjQuNYL7WEyYf3hId8HcJE3J0gsx61aomd6S90SM6mBstsgyqeoTJMs9lK8FUfgCowsAfSXtdfuBi1tPxU7EHlcWeq5kOfiqoqdZQMjYlGpG6iVS3bN7Ik+A6zEjIdFgNhmUydywQrwtwAJ2Gaj4XZUGYuptKpQLjURxpz6ofS6fiZBUWvxbXPO3ETbnfJMOJZ5AbVxat0/+Hpz+XCjpmw6WX36xPxiKFbjHY6DMI31DjuqBvhslhKDazLxX6fJpT7eVTkx0kwE4tWTdlG9++OylwE6Cu4Vkv7gIiniqOMsfSwj/iKiX8M4COKKbfC7aLK9/wBHSzDf9UYRLkuCPSxftqR/xmGk02l4foFf8NPXR+jEBNqoUANawAVugBUR/dlz/ZhMuda3I85QNLAsWXa6VKfpF54R8ru/KHnTDfqaoAPZUsNsJya7khycwFfaJdNMNx9aW3tGAdlSLm+Irc39IqMWLa0uU/6dueFElgNg1A4B1YhL+GmO+EUnBeTbIZW5womi23yNB1EwrOl5MVNyL7ThmgEdbTSeoQDjFc3Og3beeR2C8LU91fENN13gw2JF7fSbcpwg+7DugUvMRc8yB1A6Np09UBphgggisiCCCAIIIIAggggCCCCA+e/HVNxcKMPQlSl7C344q1G+jbvGYiY8Zs7FwtVHmdV9mUg7wYhaDJgPpL2mxiNJymKlraLnDo1FindP7IfvKEwFhpZTvaWzd9WBDCgANmOVrN9k5+zaJKTKKlRzFBualU/ZmATrkILMPpn96YdgERXCUrzhzYx9sPwROSjjUIdagX+tLkr31BhvwjSBwzDQQ7b1qn/Gu+Ah6eeZcw8xJB2zHB7AYtNFV8ZLLKeVYn1jLnN8dUN0VvhOjKlj0v2NU/ephPg+rMqZfUGAI6ONW/ZIgLLVkY5htyQzbk49u6nSKzWSfJpjjVhsPVIJ96XExIqw6sCc2vfraSFPvTmhn4XycUuY453OwmpbuAgicmebgFv6PD/h6hfyhuhec3L63J31Mo907thvIa7A85Ub3qR+ZHHG3GI+jf8AZ0j/AIYKUcYZJ/uv+VN/sYeYDj5vlG/epv8APCQGIYLX5OH3axP4Q5D3e9vnhjtm0r900wDClBKgn0Qcv7qjb7oJ0oksObEOrKtH3QuyYZQA04CN1NMHfTdkO+LAmHpmdhqXXuqhAM1lcsW9MH9vTX+IQklNaSc8+L7qYn8o7ocpNsmM6eLxDr8nlP8AFStC9uVY6C+DZx86V8NQIDlKIGZa+liN8+eo7Zyb45pmcFbEkEp7xoweyYd5jynnWAmNpwh9olU80+9IbthwxwYgB5mIDrlmbbtpZcAtTzMSqTpKqfclt8U3IRM8C2WYCefLfmeuIcWDYRoBAHUrzV+GQm6JSWljl1jdlAaNBCVJNxIrc4B/jCsVkQQQQBBBBAEEEEAQQQCA+WPC6ox8IVT6jUTRsExh90JScrEas/ZzENaibxk2Y/puzX+sxP3w/okBto1DfdPvESNJWWhIYDmYD2Z40bViRmzc2PMXbc1U/dLWGlAQ2E+kVvn6Rp/8xodS1DJ0lbb5Gn/EQCqNZ9FrMBump91PHNK2SKTpwLvFMnc7RzPHKY9LHtq2/DCYkkEAamW2ybLH4IBefK41CRpZSdrS5jW31QiO4Q4MuXIyzbdept7ssnbBR1JUyx/d/wDKfdDlK4OljpKW6rybd85oCCnY5Za40Ft4xnvCjZCk2rLIynNbMNmGcPu7YnqhUbExsRd2/en/AALDCs4KKMcIuCbEa/PwZbS0EdUdTMxgFlwhltZbHKbJOkmxNphOiFJnmYAWJ4q2m1iJE1b3AGuRDGQ3I5OZK4teuS2ejTeQMok5SAE5nN7aP9oZb7qjtgp/RzhLZVuSAy2JNzbygZnnyqI6lT/kvpcX2il7OVSiIdnsgfO+C+3iJb/FTmFsRD2+lh2cdMT4agQFjxKHtpBmW2eUsvw1cN8dkxHNsGLb5Oj/AB0hiCl1z4S50lL7eJlv8VMYepUnGL+kBs4+Ynw1IgJggcZY6MRT1ePdMvUqxCSTDhxtmcIa30uLlzCPbpJm+IvypsGP52DFo1+To3x0xh/LnWmZ63ts8pcD3KqAXeQMQQ6L4B1Yp0m+6olwpIfEbnINY9WPiHO7HN7YYyKnkBj5+ENtEhH+KjMPJsoi4W2h1XZ5Qq/FK3iAWBuAddrnr4pmPvT+yH9HWWsp5rjo1GG1gWJw6yRzG5Kpb1UBjqWgy120aM+c9V4DRPB+aDJABvYkff8AfElFd8D35LDqP3RYosZoggggCCCCAIIIIAhtwnOwSZr+jLdtyk/dDmIPw5n4ODqxuaRM7UI++A+XqZch0ARNUiZDfudG7iYiqZc/+v8ArXE1Ikm2HXYjbhdO/DEjVSFCoUqMssPu4f8AIh9SJYgfVX90T7jDHASrEXuQxG1ZxH2yxJS5nKJ0WYtsE6a3dTiASZiZZb6F99POP5vbDpXvMa+pyd06efy4a065BD0Jr5qWX3lo9c3DONas2+VPf89YDmTTDEg+qNzUajuMNp9FeXiGRw3/AGDN/LEoLY7+i/dP/hT9kNpAODARnhA/Y0yd82AjptA92CnSXFutqlIcyqtwwxekDvnI35whw80i7c+I/vj/AHiFWHLA+mB+2plP2ZghnRgHATblrJXR9VDr/wBojryQ8WHL3ODFbp4hJvxU5huJ4CrbzlSW29Fmqd8jtiVSxIBNxiCjqMybLvb6lSkFCcGjGATcY8Ozj5kv4Z4jhZACcYdOAsP+HlTPikMYWM04eMPo47dPFyZ3xSHhw0rlYToxYAOjjZ0k+7PSA5ShUPYjLHhA6PKJ0v4ahYbiXyMZ9DEBrvxEqb8UhoU444cZ04cYHTxUmdvxUzwt86x0YsGXNxs2Vf2KpID1aYY7HRjw7PKJsv4ahYQB5OO3KwYh1mnlvb26Vo6SccOI+cVxAczGSj/aUjQ4xKGFzlj90T/8qs3CA9EtQ9jbz8I6vKHT4KsR1IfCquxzAViOkS5Tke1SPCEtThA+cVt1MZLJ9rRrvh5Lwljlkze60wH7OubYIBWXkMI0ryRz3FpK/ZuYWQ6+cZdCg2G/TDaSSQDoZgPaZUHx1Ew+rDhbHMaDY7NCDcL7YC4+Bx876o7/AP5izRVPAx+U4+j94i1wiUQQQRUEEEEAQQQQBFT8as3DwVVdKqvtTFH3xbIo/jme3BcwelMlD9oG/DCrGB0S557eq9vviepWsATqzPWOURvpzviFopfbYbDl3xP0Yva4yNr9RaXfseZEU5pZeEgXyUgHqVkBO6kbfDhQSoUjMqF2mXLQ+9UtCEtSy2tmygbWVR8VW26HL1BtjAvpcftZg75PZAdCac3Ayzf7acPyhuhSRKAbDqBCnqDy5d/ZppkeJLsQNABtsDqvwUbb454slbHzytr/AEjLVfjrDugOWGJcsnK6NGZlE29usG6Fsa4idQYnZxrP8FIu+PSwxYtQJYHoxzJvwU0veI8l0tvkzY5cWd0qT3tNOwwCAkXAlm1yAhPWkqUduKc+6O3YefpH9IN86d3cXvhbjTYuuel7a9EydvvMlCBZQBC/NDBT9UOkvdgpn3wDCspll3tbzQtv7qyy79BeU6fpISlUxZQZT5HJecctEBz5g0hvUMc8PTbKl9LKwbpvm6nnXExNssyDqiN4Mq2S4DXxAjqLC1/aVT6kBKisdbF1sNJB1D5QsNiTJy/oxC6cIm2Yu9iOYYsK/m0oP6QQ9kVaTOUACC2IjLQZysR7FW42QhMoQFyzcKPaEom/6yk94wC8msQsDpGIdWHjSfsqz3Y6W5W2l8NvWMkrf9bRjaYZvweL4bnDcrbmXEE+zqk9gRzLLjlHzrY7D0gONt7ciaPWMBKB1DFhmoYtf6ImpNy6OLqnGyExTcni+f5MnpKTKc+/JlndDYSs+L+aTgy9G7Sb+xOlHZCjT2wl9di4X6WBJ1v1lPMG2AdLPy4waM5g6f6KpA7ZohdJR8wZZGWNgmyR3STCCYcYU6MWG3MonNL+yrF3QrKmEKGObgB7dIlq5H6yibfAOOMuSVPnXK+tjZe2ql+yIWUjVovlvKJ7qX2whkhyGUs5dSF7dlHL3wqq4cvRv7oWWO0MYC1eBzfKkasJ7xFwileCjWnDpuOzp6ousIlEEEEVBBBBAEEEEARnnjym24PQelPQbkmH7o0OMw8fcwClplOueTulN/NCrGQUQ168+64+GJ+lJsVv51wNuNV7ahTuiG4LOYPSDuIB7GMTFM2EXOoA+yFJ/dzEVI4jYuurE42CY698ncIUwAMOZWtsWYqn3aM74ToALhToBVT1BpSnsp3gAxKBrZQD1siA+9VtugFhLJlhDe5AS/SZcuX8VU+6FHnWvMGYuZm4zZoy6lkjdHjTrXcDLN/t5o/KG6OhJAIXUGCnqDypZ92meA9WRayXuLiWeoNKknskzTtMJNMJUsCQxXF63Fu+/HVpuj3St9DYdH0jJZvjrBC8wLi9fsE8kZ/Uo4DhQuLmAb3eOGX6uj7Y4RCVAYZ2UHaihu2pmH1THktCVEsjMqF2mUks+9VtEtwLS8fUImkO2I/VLOx92cnswFyofAalmyE8plY5jrdjidcJZRiC4SLaIxfh7gzyaqnSNUtytza+G64WPq3aPpeMS8bFEF4QLWynS0J67NL7rmFSKhT1JF7G17g9FwbnZiJ9URO0HCoLAkW5QJ0ZfLK5GwT5g9UxBGRfNdedj0m/fNXdHEnMXvkRp15g57jMbdBVpVrJhHnYLX6fJmX4qQQ7awcWF7zL7PKVPw1RivUtaQbkWzBOejlYmG6ZOHqw6lV1lN83CkbRLX8dH2wDyZLtLy87Br5/Jz+OkEOFAEy1si/Z5R/JWRyJ4xnPLGBsM+avw1IjhZwwFzp4vFt8mkP8UgwHCMQl/nmX2+S3y9ekiVwjjCNILncaj+WshrLlATPXw7PKZ0vunCPaVzgD2+YG/Y0z98owDinYsFv84Jf1lp73/WTIWkvezHK+EnarzT2uIbtNClhcci/ueUDR+gWF8YFwL5Yh5p1CXLA0c6tugLB4PPZ0J9Idv35xfYzrgmZylGE5Ho1bY0RTcA88IlewQQRUEEEEAQQQQBGd+OfgSfUU8lpEszBKZmdVF2sVABC6WGR0Z5xokEB8sUUkAEWscwRmCLq4sR1qIlpUpWA5R5RtqOTZc3NUx9BcI8C08/8AppEtzzsoxbG0jfEBUeLqiNsCvLtowuSBbDbJ7+gu6IusmkhiCQwuQTozuyuRoPPVDVzQ8M4rd8IIuX5LagZrjIjmkyxpi8TvFkBnKqNBBAdOZpZtdTzSVGiImZ4A1iAKAkxbBThbO2GShNmtqExtvTAQCDCQtmsCEOVxYNKlHQT82nmb458oDKSMnK6DkcRlubZ/TrBuh/WcEVMsFmkTFOEsRhOnBPewIy8+eo2GERL5YGYs+g8wqJY1/RpSYK9E0F72soe/RhE5mv1YKMQlYleLOnDhv9Likl78dU24w1lgGWchfiuYXBNN/GcsOjYMxz89j5zf1883080rsEAsJpLYhzllPW0x07RJ3xZvFxTXqGYG6y0IG0hV90W2RUKSlNwoxE5KFBOm0sWA65JGyNW8C+ATSyji897Ej0baATrOecEqxRmPjrpBhp5xNs3lk9YDdwaNOit+MHgRquieXLF5ikOgyzIyIudZViItRg6VABuCMrMM/qvbeEXZHjBAcgcOSnScuWl8voId8WOT4B8IG3/dmFjreWMsSH0voQ7keLrhBkwtJVbhb3mJqw30E87RFViUc+UNdmyPPy9P153ZDmmVgwy1gm9vSl4htJm+0Ysw8WdewzMhSQb3mNpPHcyH+tG6JWT4s6nO8+SAb6MbfOmH0R6Y3GApSyii3JFwmm+sICDkOemB2w5FMxJXELXKCwOjFUyrZnmKxez4tCbg1IAIYZSybXE4ZEt/r/d6cpCR4vJIN2nTG5WLLCo/pA/MdYgaz2UxJxkmw+UysNHk07UBztrhxLkKSUtlnLz/AN4knT1IdkaXR+BNHLULxbMAMPLdjcYFTMAgeaoiWkcEyEzWTLBve+Bb3xFr3tzsT1kwNZZTgzCCqEhiL4QTYO0ljo1Wqpmy8SNHwLUsARIfUxuMNzhZ7cq3z5p3Rpqi2Qyj2GGqfwR4Nzlw4sK2te5BPPq/jFvVbADmyj2CKgggggCCCCAIIIIAggggCCCCAIIIIAjxlB0i/XHsEA1mcHSW86TLPWinm6PojcIbTfB6kbTTSs8vMA9Lm+u3tHniTggGVHwVIlEtLlIrHWBnmSdPWx3w9gggCCCCAIIIIAggggCCCCAIIIIAggggCCCCAIIIIAggggP/2Q==",
        },
        {
          name: "Work Wear",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTbIadrRnejBEcaz8tyOWaMdR-dE3DILCEMF9qXZoQTkGo_tUxK&usqp=CAU",
        },
      ],
    };
  }
  componentDidMount = async () => {
    this.getData();
  };
  getData = async () => {
    // await this.setState({ loading: true });
    // var resp = await this.props.getProducts();
    var user_location = this.props.user_location_data;
    var user_basket = this.props.user_basket;

    await this.setState({
      user_location,
      user_basket,
      store_data: user_location.store_data,
    });
    this.setState({ loading: false });
  };
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={{ justifyContent: "center" }}>
          <AppText style={[AppFonts.h1_bold, { color: AppColors.white }]}>
            {this.state.store_data &&
              this.state.store_data[2].organizationname}
          </AppText>
          <AppText style={[AppFonts.h4_bold, { color: AppColors.white }]}>
          {this.state.store_data &&
              this.state.store_data[2].locationname}
          </AppText>
        </View>
        <View style={{ marginHorizontal: 10, justifyContent: "center" }}>
          <View>
            <FontAwesome
              onPress={() => Actions.Basket()}
              name="bell"
              size={25}
              color={AppColors.white}
            />
            {this.state.user_basket != null &&
              this.state.user_basket.length != 0 && (
                <View
                  style={{
                    height: 18,
                    width: 18,
                    borderRadius: 9,
                    backgroundColor: AppColors.red,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: -5,
                    right: -8,
                  }}
                >
                  <AppText
                    style={[
                      AppFonts.h3_bold,
                      { color: AppColors.white, marginBottom: 2 },
                    ]}
                  >
                    {this.state.user_basket.length}
                  </AppText>
                </View>
              )}
          </View>
        </View>
      </View>
    );
  };
  renderSubHeader = () => {
    return (
      <View style={{ height: 50 }}>
        <FlatList
          contentContainerStyle={{ alignItems: "center" }}
          horizontal={true}
          data={this.state.initial_categorydata}
          renderItem={this.initialCategory}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  initialCategory = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.setState({ selected_category: item })}
        style={{
          height: 30,
          width: 80,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 0.5,
          marginHorizontal: 10,
          borderColor: AppColors.grey,
          backgroundColor:
            this.state.selected_category &&
            this.state.selected_category.name == item.name
              ? "orange"
              : null,
        }}
      >
        <AppText style={AppFonts.h3_bold}>{item.name}</AppText>
      </TouchableOpacity>
    );
  };
  keyExtractor = (item, index) => index.toString();
  renderMainCategories = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: AppColors.background,
          alignItems: "center",
        }}
      >
        <View style={{ height: 40, justifyContent: "center" }}>
          <AppText style={[AppFonts.h2_bold, { textAlign: "left" }]}>
            Shop by Top Categories
          </AppText>
        </View>
        <FlatList
          style={{ marginTop: 0 }}
          numColumns={2}
          data={this.state.main_categoriesdata}
          renderItem={this.mainCategoryList}
          keyExtractor={this.keyExtractor}
        ></FlatList>
      </View>
    );
  };
  mainCategoryList = ({ item, index }) => {
    var current_width = this.state.screenWidth;
    return (
      <Animated.View style={{ marginTop: marginAnim }}>
        <LinearGradient
          colors={[AppColors.secondary, AppColors.tertiary]}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{
            alignItems: "center",
            padding: 5,
            margin: 10,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              Actions.SubCategories({
                navigate_id: index + 1,
                category_name: item.name,
                callBack: () => this.getData(),
              })
            }
            style={{
              height: 150,
              width: 150,
              backgroundColor: AppColors.white,
              // margin: 20
            }}
          >
            <Image
              style={{ flex: 1, resizeMode: "contain" }}
              source={{ uri: item.image }}
            ></Image>
          </TouchableOpacity>
          <AppText
            style={[
              AppFonts.h3_bold,
              // { numberOfLines: 2 }
            ]}
          >
            {item.name}
          </AppText>
        </LinearGradient>
      </Animated.View>
    );
  };
  onLayout = async (e) => {
    this.setState({
      screenWidth: e.nativeEvent.layout.width,
      screenHeight: e.nativeEvent.layout.height,
    });
  };
  render() {
    return (
      <View onLayout={this.onLayout} style={styles.container}>
        <Loader visible={this.state.loading} />
        {this.renderHeader()}
        {this.renderSubHeader()}
        {this.renderMainCategories()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    marginTop: Constants.statusBarHeight,
  },
  header: {
    height: 80,
    backgroundColor: AppColors.secondary,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    flexDirection: "row",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
