// @flow
import React, {useState, useEffect} from 'react';
import RNMlKit from 'react-native-firebase-mlkit';
import {
  StyleSheet,
  StatusBar,
  View,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';
import {useTranslation} from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';

import {setup} from './services/i18n';
import Controls from './components/Controls';
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
      const cropedImage = await ImagePicker.openCropper({
        path: data.uri,
        freeStyleCropEnabled: true,
        hideBottomControls: true,
        cropperToolbarTitle: t('choose_capture_area'),
        cropperActiveWidgetColor: COLORS.PRIMARY,
        cropperToolbarColor: COLORS.PRIMARY,
      });

      textInImage = await RNMlKit.deviceTextRecognition(cropedImage.path);
    } else {
      textInImage = await RNMlKit.deviceTextRecognition(data.uri);
    }

    if (textInImage) {
      setCapturedText(textInImage[0].resultText);
      setIsModalVisible(true);
    } else {
      Alert.alert(t('error_in_recognition'));
    }
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#3c98f0"
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
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }}>
          {({camera, status}) => {
            if (status !== 'READY') {
              return <PendingView status={status} />;
            }

            return (
              <Controls
                takePicture={() => takePicture(camera, crop)}
                crop={crop}
                setCrop={setCrop}
                setFlash={setFlash}
                flash={flash}
                isReady={isTextRecognised}
              />
            );
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
    justifyContent: 'flex-end',
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
