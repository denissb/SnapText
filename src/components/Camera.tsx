import React, {useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Camera as RNVCamera,
  useCameraDevices,
} from 'react-native-vision-camera';
import PendingView from './PendingView';
import BottomControls, {TopControls} from './Controls';
import {recogniseText} from '../services/textDetector';
import {openCropper, openImage} from '../services/images';
import {useTranslation} from 'react-i18next';
import useVisionCamera from '../hooks/useVisionCamera';

const Camera = () => {
  const [crop, setCrop] = useState(true);
  const [flash, setFlash] = useState(false);
  const [capturedText, setCapturedText] = useState<string>();
  const [barCodeLink, setBarCodeLink] = useState<string | undefined>(undefined);
  const [isTextRecognised, setIsTextRecognised] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {cameraPermission, errorMsg} = useVisionCamera();
  const {t} = useTranslation();
  const devices = useCameraDevices();
  const device = devices.front;

  const onImage = useCallback((textInImage: string) => {
    if (textInImage) {
      setCapturedText(textInImage);
    } else {
      setCapturedText(undefined);
    }

    setIsModalVisible(true);
  }, []);

  const openImagePicker = useCallback(async () => {
    try {
      const image = await openImage(t);
      const textInImage = await recogniseText(image.path);
      onImage(textInImage);
    } catch (e) {}
  }, [onImage, t]);

  if (cameraPermission !== 'authorized' || !device) {
    return <PendingView status={cameraPermission} />;
  }

  return (
    <>
      <RNVCamera device={device} isActive={true} style={styles.main} />
      <View style={styles.controlsWrapper}>
        <TopControls openImagePicker={openImagePicker} key="topControls" />
        <BottomControls
          takePicture={() => {}}
          crop={crop}
          barCodeLink={barCodeLink}
          onBarCodeLinkClose={() => setBarCodeLink(undefined)}
          setCrop={setCrop}
          setFlash={setFlash}
          flash={flash}
          isReady={isTextRecognised}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
    top: 0,
    position: 'absolute',
  },
  controlsWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
});

export default Camera;
