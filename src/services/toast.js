import {Platform, ToastAndroid, Alert} from 'react-native';

export const showToast = (text) => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.CENTER);
  } else {
    Alert.show(text);
  }
};
