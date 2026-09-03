import { useCameraPermission } from 'react-native-vision-camera';
import { useEffect } from 'react';

const useVisionCamera = () => {
  const {
    status: cameraPermission,
    hasPermission,
    requestPermission,
  } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  return { cameraPermission };
};

export default useVisionCamera;
