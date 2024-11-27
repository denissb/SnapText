import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
import {AppState, NativeEventSubscription} from 'react-native';
import {useEffect, useState} from 'react';

const useVisionCamera = () => {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();
  const [errorMsg, setErrorMsg] = useState<string>();

  const getCameraPermissions = async () => {
    try {
      let permission = await Camera.getCameraPermissionStatus();
      if (permission !== 'granted') {
        permission = await Camera.requestCameraPermission();
      }
      setCameraPermission(permission);
    } catch (error: unknown) {
      setErrorMsg((error as Error).message);
    }
  };

  useEffect(() => {
    let listener: NativeEventSubscription | undefined;
    if (!cameraPermission) {
      getCameraPermissions();
    } else if (cameraPermission === 'denied') {
      listener = AppState.addEventListener('change', async () => {
        let grantedPermission = await Camera.getCameraPermissionStatus();
        setCameraPermission(grantedPermission);
      });
    }
    return () => {
      listener?.remove();
    };
  }, [cameraPermission]);

  return {cameraPermission, errorMsg};
};

export default useVisionCamera;
