import React from 'react';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from "@react-native-vector-icons/feather/static";
import {COLORS} from '../settings';
import {useModal} from '../context/ModalContext';

type Props = {
  source: {html: string} | {uri: string};
};

const WebViewModal: React.FC<Props> = ({source}: Props) => {
  const {open, setIsModalOpen} = useModal();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={() => setIsModalOpen(false)}>
      <TouchableOpacity
        style={styles.close}
        onPress={() => {
          setIsModalOpen(false);
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
    marginTop: 36,
  },
  close: {
    padding: 8,
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 1,
    backgroundColor: COLORS.TRANSPARENCY,
    borderRadius: 10,
  },
});
export default WebViewModal;
