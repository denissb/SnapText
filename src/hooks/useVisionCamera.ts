import {CameraPermissionStatus} from 'react-native-vision-camera';
import {AppState} from 'react-native';
import {useEffect, useState} from 'react';
import * as Camera from '../services/camera';

const useVisionCamera = () => {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();
  const [errorMsg, setErrorMsg] = useState<string>();

  const getCameraPermissions = async () => {
    try {
      let permission = await Camera.getCameraPermissions();
      if (permission !== 'authorized') {
        permission = await Camera.requestCameraPermissions();
        if (permission !== 'authorized') {
          AppState.addEventListener('change', async () => {
            let grantedPermission = await Camera.getCameraPermissions();
            setCameraPermission(grantedPermission);
          });
        }
      }
      setCameraPermission(permission);
    } catch (error: unknown) {
      setErrorMsg((error as Error).message);
    }
  };

  useEffect(() => {
    if (!cameraPermission) {
      getCameraPermissions();
    }
  }, [cameraPermission]);

  return {cameraPermission, errorMsg};
};

export default useVisionCamera;
