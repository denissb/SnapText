// @flow
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';

import {showToast} from '../services/toast';
import {COLORS} from '../settings';

type Props = {
  flash: boolean,
  setFlash: Boolean,
  crop: Boolean,
  takePicture: Function,
  setCrop: Function,
  isReady: Boolean,
};

const isAndroid = Platform.OS === 'android';

const BottomControls: () => React$Node = ({
  flash,
  setFlash,
  crop,
  setCrop,
  takePicture,
  isReady,
}: Props) => {
  const {t} = useTranslation();

  return (
    <View style={styles.controls}>
      <View style={styles.controlsContainer}>
        <View style={styles.switchContainer}>
          <Icon name="zap" size={25} color={COLORS.SECONDARY} />
          <Switch
            value={flash}
            onValueChange={setFlash}
            thumbColor={
              isAndroid && (flash ? COLORS.PRIMARY : COLORS.SECONDARY)
            }
            style={styles.switch}
          />
        </View>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={() =>
            isReady || flash ? takePicture() : showToast(t('no_capture_text'))
          }
          style={
            isReady ? [styles.capture, styles.readyCapture] : styles.capture
          }>
          <Icon name="camera" size={32} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>
      <View style={styles.controlsContainer}>
        <View style={styles.switchContainer}>
          <Icon name="crop" size={25} color={COLORS.SECONDARY} />
          <Switch
            value={crop}
            onValueChange={setCrop}
            thumbColor={isAndroid && (crop ? COLORS.PRIMARY : COLORS.SECONDARY)}
            style={styles.switch}
          />
        </View>
      </View>
    </View>
  );
};

type TopControlProps = {
  openImagePicker: Function,
};

const TopControls: () => React$Node = ({openImagePicker}: TopControlProps) => (
  <View style={styles.topControls}>
    <TouchableOpacity
      style={styles.topContainer}
      onPress={() => {
        openImagePicker();
      }}>
      <Icon name="file-text" size={25} color={COLORS.SECONDARY} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingBottom: 10,
  },
  capture: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 68,
    width: 68,
    height: 68,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 5,
    borderColor: 'rgba(50, 50, 50, 0.65)',
  },
  readyCapture: {
    borderWidth: 5,
    borderColor: COLORS.PRIMARY,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.65)',
    padding: 8,
    borderRadius: 10,
  },
  switch: {
    marginLeft: Platform.OS === 'ios' ? 5 : 0,
  },
  topContainer: {
    backgroundColor: 'rgba(50, 50, 50, 0.65)',
    padding: 12,
    borderRadius: 10,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    marginTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 20,
    marginRight: 22,
  },
});

export default BottomControls;

export {TopControls};
