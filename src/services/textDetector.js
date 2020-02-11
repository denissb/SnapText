// @flow
import RNMlKit from 'react-native-firebase-mlkit';

export const recogniseText = async (imagePath: String) => {
  return RNMlKit.deviceTextRecognition(imagePath);
};
