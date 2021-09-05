/**
 * @format
 * @flow strict-local
 */
import MlkitOcr from 'react-native-mlkit-ocr';

export const recogniseText = async imageURI => {
  const result = await MlkitOcr.detectFromUri(imageURI);

  return result.reduce((text = '', current) => {
    return text + current.text;
  });
};
