import React, {useState, useCallback, useEffect, useRef} from 'react';
import {unlink} from 'react-native-fs';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import { scheduleOnRN } from 'react-native-worklets';
import { useTextRecognition, type Text } from 'react-native-vision-camera-ocr-plus'

import {
  Camera as RNVCamera,
  useCameraDevices,
  useFrameOutput,
  usePhotoOutput,
} from 'react-native-vision-camera';
import {useBarcodeScanner, } from 'react-native-vision-camera-barcode-scanner';
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
  const [coverMode, setCoverMode] = useState<'cover' | 'contain'>(
    'cover' as const,
  );
    const { scanText } = useTextRecognition({ language: 'latin', frameSkipThreshold: 5 })

  const [barcodeValue, setBarcodeValue] = useState<string>();
  const [capturedText, setCapturedText] = useState<string>();
  const [barCodeLink, setBarCodeLink] = useState<string | undefined>(undefined);
  const isTextRecognised = useRef(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {cameraPermission} = useVisionCamera();
  const {t} = useTranslation();
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back') || devices[0];
  const {open: isModalOpen} = useModal();

  const photoOutput = usePhotoOutput()


  const setTextRecognised = React.useCallback(
    (text?: string) => {
      if (text) {
          isTextRecognised.current = true;
      } else {
         isTextRecognised.current = false;
      }
    },
    []
  );

  const setBarcodeRecognised = React.useCallback(
    (barcode?: string) => {
      if (barcode) {
        setBarcodeValue(barcode);
      }
    },
    []
  );

  const barcodeScanner = useBarcodeScanner({ barcodeFormats: ['all-formats'] })
  const frameOutput = useFrameOutput({
    pixelFormat: 'rgb',
    onFrame(frame) {
      'worklet';
      const barcodes = barcodeScanner.scanCodes(frame)

    
      if (barcodes.length > 0) {
        scheduleOnRN(setTextRecognised, barcodes[0].displayValue);
        scheduleOnRN(setBarcodeRecognised, barcodes[0].displayValue);
      }

      const scannedText = scanText(frame);

      if (scannedText?.resultText) {
        scheduleOnRN(setTextRecognised, scannedText.resultText);
      } else {
        scheduleOnRN(setTextRecognised, undefined);
      }

      frame.dispose()
    }
  });

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
      const photo = await photoOutput.capturePhoto({
        flashMode: flash ? 'on' : 'off',
      }, {});

      const photoFilePath = await photo.saveToTemporaryFileAsync();

      let textInImage: string;

      if (crop) {
        const croppedImage = await openCropper(`file://${photoFilePath}`, t);
        textInImage = (await recogniseText(croppedImage.path)).resultText;
      } else {
        textInImage = (await recogniseText(photoFilePath)).resultText;
      }

      onImage(textInImage);
      await unlink(photoFilePath);
    } catch (err) {
      if (err instanceof Error) {
        showToast(err.message);
      }
    }

    setIsLoading(false);
  }, [onImage, flash, crop, t]);

  const openImagePicker = useCallback(async () => {
    try {
      const image = await openImage(t);
      const textInImage = await recogniseText(image.path);
      onImage(textInImage.resultText);
    } catch (e) {}
  }, [onImage, t]);

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
    return <PendingView status={cameraPermission} />;
  }

  return (
    <>
      {!isModalOpen && (
        <TouchableWithoutFeedback
          onLongPress={() =>
            setCoverMode(coverMode === 'contain' ? 'cover' : 'contain')
          }>
          <RNVCamera
            outputs={[photoOutput, frameOutput]}
            device={device}
            isActive={true}
            style={StyleSheet.absoluteFill}
            resizeMode={coverMode}
          />
        </TouchableWithoutFeedback>
      )}
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
