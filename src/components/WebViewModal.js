/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import type {Node} from 'react';
import {Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS} from '../settings';

type Props = {
  source: Object,
  setIsVisible: Function,
  visible: Boolean,
};

const WebViewModal: () => Node = ({source, visible, setIsVisible}: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={() => setIsVisible(false)}>
      <TouchableOpacity
        style={styles.close}
        onPress={() => {
          setIsVisible(false);
        }}>
        <Icon name="x" size={30} color={COLORS.SECONDARY} />
      </TouchableOpacity>
      <WebView source={source} style={styles.view} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.SECONDARY,
  },
  view: {
    flex: 1,
  },
  close: {
    padding: 8,
    position: 'absolute',
    top: 15,
    right: 20,
    zIndex: 1,
    backgroundColor: COLORS.TRANSPARENCY,
    borderRadius: 10,
  },
});

export default WebViewModal;
