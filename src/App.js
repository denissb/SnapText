// @flow
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useTranslation} from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';

import {setup} from './services/i18n';
import {openCropper, openImage} from './services/images';
import {recogniseText} from './services/textDetector';

import BottomControls, {TopControls} from './components/Controls';
import TextModal from './components/TextModal';
import PendingView from './components/PendingView';
import {COLORS} from './settings';

setup();

const Wrapper = Platform.select({
  ios: SafeAreaView,
  android: View,
});

const App: () => React$Node = () => {
  const {t} = useTranslation();

  const [isTextRecognised, setIsTextRecognised] = useState(false);
  const [capturedText, setCapturedText] = useState();
  const [flash, setFlash] = useState(false);
  const [crop, setCrop] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
  });

  const onTextRecognized = ({textBlocks}) => {
    setIsTextRecognised(textBlocks.length > 0);
  };

  const onImage = textInImage => {
    if (textInImage) {
      setCapturedText(textInImage[0].resultText);
      setIsModalVisible(true);
    } else {
      Alert.alert(t('error_in_recognition'));
    }
  };

  const openImagePicker = async () => {
    const image = await openImage(t);
    const textInImage = await recogniseText(image.path);
    onImage(textInImage);
  };

  const takePicture = async (camera, cropImage = false) => {
    const options = {
      quality: 0.6,
      base64: true,
      skipProcessing: true,
      forceUpOrientation: true,
    };

    const data = await camera.takePictureAsync(options);

    let textInImage;

    if (cropImage) {
      const cropedImage = await openCropper(data.uri, t);

      textInImage = await recogniseText(cropedImage.path);
    } else {
      textInImage = await recogniseText(data.uri);
    }

    onImage(textInImage);
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.PRIMARY}
        translucent
      />
      <TextModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        content={capturedText}
      />
      <Wrapper style={styles.container}>
        <RNCamera
          style={styles.preview}
          captureAudio={false}
          type={RNCamera.Constants.Type.back}
          flashMode={
            flash
              ? RNCamera.Constants.FlashMode.on
              : RNCamera.Constants.FlashMode.off
          }
          onTextRecognized={onTextRecognized}
          androidCameraPermissionOptions={{
            title: t('camera_permission'),
            message: t('camera_permission_description'),
            buttonPositive: t('ok'),
            buttonNegative: t('cancel'),
          }}>
          {({camera, status}) => {
            if (status !== 'READY') {
              return <PendingView status={status} />;
            }

            return [
              <TopControls openImagePicker={openImagePicker} />,
              <BottomControls
                takePicture={() => takePicture(camera, crop)}
                crop={crop}
                setCrop={setCrop}
                setFlash={setFlash}
                flash={flash}
                isReady={isTextRecognised}
              />,
            ];
          }}
        </RNCamera>
      </Wrapper>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 14,
  },
  result: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 5,
    padding: 15,
    margin: 10,
  },
});

export default App;
