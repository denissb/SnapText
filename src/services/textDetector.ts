import {
  PhotoRecognizer,
  type Text,
} from 'react-native-vision-camera-ocr-plus';

export const recogniseText = async (imagePath: string) => {
  return await PhotoRecognizer({
    uri: imagePath,
    orientation: 'portrait',
  });
};
