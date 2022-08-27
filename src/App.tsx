import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {CameraPermissionStatus} from 'react-native-vision-camera';

import {useTranslation} from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';
import {setup as i18nSetup} from './services/i18n';
import {openCropper, openImage} from './services/images';
import {recogniseText} from './services/textDetector';
import {TopControls} from './components/Controls';
import TextModal from './components/TextModal';
import Camera from './components/Camera';
import PendingView from './components/PendingView';
import {COLORS} from './settings';

const Wrapper = Platform.OS === 'ios' ? SafeAreaView : View;

i18nSetup();

const App: React.FC = () => {
  const {t} = useTranslation();
  const [isTextRecognised, setIsTextRecognised] = useState(false);
  const [barCodeLink, setBarCodeLink] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedText, setCapturedText] = useState<string>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // const cameraRef = useRef<RNCamera>(null);
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // const onTextRecognized = useCallback(
  //   ({textBlocks}: {textBlocks: TrackedTextFeature[]}) => {
  //     setIsTextRecognised(textBlocks.length > 0);
  //   },
  //   [],
  // );

  // const takePicture = useCallback(
  //   async (camera: RNCamera | null, cropImage = false) => {
  //     if (!camera) {
  //       return;
  //     }

  //     const options = {
  //       quality: 0.6,
  //       base64: true,
  //     };
  //     setIsLoading(true);

  //     try {
  //       const data = await camera.takePictureAsync(options);
  //       let textInImage;

  //       if (cropImage) {
  //         const croppedImage = await openCropper(data.uri, t);
  //         textInImage = await recogniseText(croppedImage.path);
  //       } else {
  //         textInImage = await recogniseText(data.uri);
  //       }

  //       onImage(textInImage);
  //       setIsLoading(false);
  //     } catch (error) {
  //       // TODO: log error somewhere...
  //       setIsLoading(false);
  //     }
  //   },
  //   [onImage, t],
  // );

  // const onBarCodeRead = useCallback(({data}: BarCodeReadEvent) => {
  //   if (!data) {
  //     return;
  //   }

  //   try {
  //     const url = new URL(data);
  //     setBarCodeLink(url.href);
  //   } catch (e) {
  //     setCapturedText(data);
  //     setIsModalVisible(true);
  //   }
  // }, []);

  // const renderContents = (
  //   cameraStatus: string,
  //   isLoadingCamera: boolean,
  //   camera: RNCamera | null,
  // ) => {
  //   if (cameraStatus !== 'READY') {
  //     return <PendingView status={status} />;
  //   }

  //   if (isLoadingCamera) {
  //     return (
  //       <View style={styles.loadingOverlay}>
  //         <ActivityIndicator size="large" color={COLORS.SECONDARY} />
  //       </View>
  //     );
  //   }

  //   return [
  //     <TopControls openImagePicker={openImagePicker} key="topControls" />,
  //     <BottomControls
  //       key="bottomControls"
  //       takePicture={() => takePicture(camera, crop)}
  //       crop={crop}
  //       barCodeLink={barCodeLink}
  //       onBarCodeLinkClose={() => setBarCodeLink(undefined)}
  //       setCrop={setCrop}
  //       setFlash={setFlash}
  //       flash={flash}
  //       isReady={isTextRecognised}
  //     />,
  //   ];
  // };

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
        <Camera />
        {/* <RNCamera
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
          }}
          onBarCodeRead={onBarCodeRead}
          ref={cameraRef}
          onStatusChange={currentStatus =>
            setStatus(currentStatus.cameraStatus)
          }>
          {renderContents(status, isLoading, cameraRef.current)}
        </RNCamera> */}
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
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.65)',
    width: '100%',
  },
  result: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 5,
    padding: 15,
    margin: 10,
  },
});

export default App;
