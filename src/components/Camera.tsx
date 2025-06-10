import React, {useState, useCallback, useEffect, useRef} from 'react';
import {unlink} from 'react-native-fs';
import {StyleSheet, View} from 'react-native';
import {
  Camera as RNVCamera,
  useCameraDevices,
  useFrameProcessor,
  runAsync,
  runAtTargetFps,
} from 'react-native-vision-camera';
import {Barcode, scanCodes} from '@mgcrea/vision-camera-barcode-scanner';
import {useTextRecognition} from 'react-native-vision-camera-text-recognition';
import type {Text} from 'react-native-vision-camera-text-recognition/src/types';
import {Worklets} from 'react-native-worklets-core';

import PendingView from './PendingView';
import BottomControls, {TopControls} from './Controls';
import TextModal from './TextModal';
import CameraLoader from './CameraLoader';
import {recogniseText} from '../services/textDetector';
import {openCropper, openImage} from '../services/images';
import {useTranslation} from 'react-i18next';
import useVisionCamera from '../hooks/useVisionCamera';
import {showToast} from '../services/toast';
import {useModal} from '../context/ModalContext';

const Camera = () => {
  const [crop, setCrop] = useState(true);
  const [flash, setFlash] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState<string>();
  const [capturedText, setCapturedText] = useState<string>();
  const [barCodeLink, setBarCodeLink] = useState<string | undefined>(undefined);
  const isTextRecognised = useRef(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {cameraPermission, errorMsg} = useVisionCamera();
  const cameraRef = useRef<RNVCamera>(null);
  const {t} = useTranslation();
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back') || devices[0];
  const {open: isModalOpen} = useModal();

  const onImage = useCallback((textInImage: string) => {
    setCapturedText(textInImage || undefined);
    setIsModalVisible(true);
  }, []);

  const onLinkClose = useCallback(() => {
    setBarCodeLink(undefined);
    setTimeout(() => setBarcodeValue(undefined), 2000);
  }, []);

  const snapText = useCallback(async () => {
    setIsLoading(true);

    try {
      const photo = await cameraRef.current?.takePhoto({
        flash: flash ? 'on' : 'off',
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

  const processCodes = Worklets.createRunOnJS((code: Barcode) => {
    if (code?.value) {
      isTextRecognised.current = true;
      setBarcodeValue(code.value);
    }
  });

  const processText = Worklets.createRunOnJS((hasText: boolean) => {
    isTextRecognised.current = hasText;
  });

  const options = {language: 'latin' as const};
  const {scanText} = useTextRecognition(options);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    //runAsync(frame, () => {
    runAtTargetFps(2, () => {
      'worklet';
      const data = scanText(frame);
      processText(!!(data as unknown as Text)?.blocks);
    });

    runAtTargetFps(1, () => {
      'worklet';

      const detectedBarcodes = scanCodes(frame, {
        barcodeTypes: [
          'code-128',
          'code-39',
          'code-93',
          'codabar',
          'ean-13',
          'ean-8',
          'itf',
          'upc-e',
          'upc-a',
          'qr',
          'pdf-417',
          'aztec',
          'data-matrix',
        ],
      });

      if (detectedBarcodes && detectedBarcodes.length > 0) {
        processCodes(detectedBarcodes[0]);
      }
    });
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

  if (cameraPermission !== 'granted' || !device) {
    return <PendingView status={cameraPermission} errorMsg={errorMsg} />;
  }

  return (
    <>
      {!isModalOpen && <RNVCamera
        ref={cameraRef}
        device={device}
        isActive={!isModalOpen}
        style={isModalOpen ? null : StyleSheet.absoluteFill}
        frameProcessor={frameProcessor}
        photo={true}
        lowLightBoost={true}
        enableFpsGraph={__DEV__}
      />}
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
          onBarCodeLinkClose={onLinkClose}
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
