import {PhotoRecognizer} from 'react-native-vision-camera-text-recognition';

export const recogniseText = async (imagePath: string) => {
  const result = await PhotoRecognizer({
    uri: imagePath,
    orientation: 'portrait',
  });

  return result.resultText;
};
