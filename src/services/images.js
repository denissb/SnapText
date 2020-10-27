// @flow
import ImagePicker from 'react-native-image-crop-picker';
import {COLORS} from '../settings';

const CROPPER_SETTINGS = {
  freeStyleCropEnabled: true,
  hideBottomControls: true,

  cropperActiveWidgetColor: COLORS.PRIMARY,
  cropperToolbarColor: COLORS.PRIMARY,
};

export const openCropper = async (uri, t) =>
  ImagePicker.openCropper({
    path: uri,
    cropperToolbarTitle: t('choose_capture_area'),
    ...CROPPER_SETTINGS,
  });

export const openImage = async (t) =>
  ImagePicker.openPicker({
    cropping: true,
    cropperToolbarTitle: t('choose_capture_area'),
    ...CROPPER_SETTINGS,
  });
