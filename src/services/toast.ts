import {Platform, ToastAndroid, Alert} from 'react-native';

export const showToast = (text: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.CENTER);
  } else {
    Alert.alert(text);
  }
};
