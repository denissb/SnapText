import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Camera as RNVCamera,
  useCameraDevices,
} from 'react-native-vision-camera';
import PendingView from './PendingView';

const Camera = () => {
  const devices = useCameraDevices();
  const device = devices.front;

  if (!device) {
    return <PendingView />;
  }

  return <RNVCamera device={device} isActive={true} style={styles.main} />;
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Camera;
