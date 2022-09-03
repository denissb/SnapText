import React, {useState, useCallback, useEffect} from 'react';
import {runOnJS} from 'react-native-reanimated';
import {StyleSheet, View} from 'react-native';
import {
  Camera as RNVCamera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {scanBarcodes, scanOCR, BarcodeFormat} from 'vision-camera-ocr-scanner';
import PendingView from './PendingView';
import BottomControls, {TopControls} from './Controls';
import {recogniseText} from '../services/textDetector';
import {openCropper, openImage} from '../services/images';
import {useTranslation} from 'react-i18next';
import useVisionCamera from '../hooks/useVisionCamera';

const Camera = () => {
  const [crop, setCrop] = useState(true);
  const [flash, setFlash] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState<string>();
  const [capturedText, setCapturedText] = useState<string>();
  const [barCodeLink, setBarCodeLink] = useState<string | undefined>(undefined);
  const [isTextRecognised, setIsTextRecognised] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {cameraPermission, errorMsg} = useVisionCamera();
  const {t} = useTranslation();
  const devices = useCameraDevices();
  const device = devices.back;

  const onImage = useCallback((textInImage: string) => {
    if (textInImage) {
      setCapturedText(textInImage);
    } else {
      setCapturedText(undefined);
    }

    setIsModalVisible(true);
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    const data = scanOCR(frame);
    if (data.result) {
      runOnJS(setIsTextRecognised)(data.result.blocks.length > 0);
    }

    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS]);
    if (!detectedBarcodes || detectedBarcodes.length === 0) {
      return;
    }
    const detectedBarcodeValue = detectedBarcodes[0]?.displayValue;
    if (!barcodeValue) {
      return;
    }

    runOnJS(setBarcodeValue)(detectedBarcodeValue);
  }, []);

  useEffect(() => {
    if (!barcodeValue) {
      return;
    }

    try {
      const url = new URL(barcodeValue);
      setBarCodeLink(url.href);
    } catch (e) {
      setCapturedText(barcodeValue);
      setIsModalVisible(true);
    }
  }, [barcodeValue]);

  const openImagePicker = useCallback(async () => {
    try {
      const image = await openImage(t);
      const textInImage = await recogniseText(image.path);
      // onImage(textInImage);
    } catch (e) {}
  }, [onImage, t]);

  if (cameraPermission !== 'authorized' || !device) {
    return <PendingView status={cameraPermission} />;
  }

  return (
    <>
      <RNVCamera
        device={device}
        isActive={true}
        style={styles.main}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
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
