/**
 * @format
 * @flow strict-local
 */
import RNMlKit from 'react-native-firebase-mlkit';

export const recogniseText = async (imagePath: String) =>
  RNMlKit.deviceTextRecognition(imagePath);
