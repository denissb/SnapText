import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {COLORS} from '../settings';

const CameraLoader = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color={COLORS.SECONDARY} />
  </View>
);

const styles = StyleSheet.create({
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    backgroundColor: 'rgba(50, 50, 50, 0.65)',
    ...StyleSheet.absoluteFillObject,
  },
});

export default CameraLoader;
