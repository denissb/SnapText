import React, {useState, useCallback, useEffect, useRef} from 'react';
import {unlink} from 'react-native-fs';
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
import TextModal from './TextModal';
import CameraLoader from './CameraLoader';
import {recogniseText} from '../services/textDetector';
import {openCropper, openImage} from '../services/images';
import {useTranslation} from 'react-i18next';
import useVisionCamera from '../hooks/useVisionCamera';
import {showToast} from '../services/toast';

const Camera = () => {
  const [crop, setCrop] = useState(true);
  const [flash, setFlash] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState<string>();
  const [capturedText, setCapturedText] = useState<string>();
  const [barCodeLink, setBarCodeLink] = useState<string | undefined>(undefined);
  const [isTextRecognised, setIsTextRecognised] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {cameraPermission, errorMsg} = useVisionCamera();
  const cameraRef = useRef<RNVCamera>(null);
  const {t} = useTranslation();
  const devices = useCameraDevices();
  const device = devices.back;

  const onImage = useCallback((textInImage: string) => {
    setCapturedText(textInImage || undefined);
    setIsModalVisible(true);
  }, []);

  const snapText = useCallback(async () => {
    setIsLoading(true);

    try {
      const photo = await cameraRef.current?.takePhoto({
        flash: flash ? 'on' : 'off',
        enableAutoStabilization: true,
        qualityPrioritization: 'balanced',
        skipMetadata: true,
      });

      if (!photo?.path) {
        throw Error('no image path found');
      }

      const photoFilePath = `file://${photo?.path}`;
      let textInImage: string;

      if (crop) {
        const croppedImage = await openCropper(photoFilePath, t);
        textInImage = await recogniseText(croppedImage.path);
      } else {
        textInImage = await recogniseText(photoFilePath);
      }
      onImage(textInImage);
      await unlink(photo?.path);
    } catch (err) {
      if (err instanceof Error) {
        showToast(err.message);
      }
    }

    setIsLoading(false);
  }, [cameraRef, onImage, flash, crop, t]);

  const openImagePicker = useCallback(async () => {
    try {
      const image = await openImage(t);
      const textInImage = await recogniseText(image.path);
      onImage(textInImage);
    } catch (e) {}
  }, [onImage, t]);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    const data = scanOCR(frame);
    if (data.result) {
      runOnJS(setIsTextRecognised)(data.result?.blocks.length > 0);
    }

    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS], {
      checkInverted: true,
    });

    if (!detectedBarcodes || detectedBarcodes.length === 0) {
      return;
    }
    const detectedBarcodeValue = detectedBarcodes[0]?.displayValue;
    if (!detectedBarcodeValue) {
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

  if (cameraPermission !== 'authorized' || !device) {
    return <PendingView status={cameraPermission} errorMsg={errorMsg} />;
  }

  return (
    <>
      <RNVCamera
        ref={cameraRef}
        device={device}
        isActive={true}
        style={StyleSheet.absoluteFill}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        photo={true}
      />
      {isLoading && <CameraLoader />}
      <TextModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        content={capturedText}
      />
      <View style={styles.controlsWrapper}>
        <TopControls openImagePicker={openImagePicker} key="topControls" />
        <BottomControls
          snapText={snapText}
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
  controlsWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
});

export default Camera;
