/**
 * @format
 * @flow strict-local
 */
import MlkitOcr from 'react-native-mlkit-ocr';

export const recogniseText = async (imagePath: String) =>
  MlkitOcr.detectFromFile(imagePath);
