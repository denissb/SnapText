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
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.65)',
    width: '100%',
    height: '100%',
  },
});

export default CameraLoader;
