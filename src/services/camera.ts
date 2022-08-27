import {Camera} from 'react-native-vision-camera';

export const getCameraPermissions = async () =>
  Camera.getCameraPermissionStatus();

export const requestCameraPermissions = async () =>
  Camera.requestCameraPermission();
