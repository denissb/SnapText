// @flow
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Clipboard,
} from 'react-native';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';

import {showToast} from '../services/toast';
import {COLORS} from '../settings';

type Props = {
  content: String,
  isVisible: Boolean,
  setIsVisible: Function,
};

const hitSlop = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20,
};

const copyToClipboard = (text, msg) => {
  Clipboard.setString(text);
  if (msg) {
    showToast(msg);
  }
};

const TextModal: () => React$Node = ({
  content,
  isVisible,
  setIsVisible,
}: Props) => {
  const {t} = useTranslation();

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => setIsVisible(false)}
      onBackdropPress={() => setIsVisible(false)}>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => setIsVisible(false)}
            hitSlop={hitSlop}>
            <Icon name="x" size={30} color={COLORS.TRINARY} />
          </TouchableOpacity>
          <TextInput
            value={content}
            multiline
            style={styles.text}
            showSoftInputOnFocus={false}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              copyToClipboard(content, t('text_copied_to_clipboard'))
            }>
            <Icon name="copy" size={25} color={COLORS.SECONDARY} />
            <Text style={styles.buttonText}>{t('copy')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: 10,
  },
  contentWrapper: {
    maxHeight: '85%',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: COLORS.TRINARY,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    alignSelf: 'flex-end',
    marginRight: -8,
  },
  buttonText: {
    color: COLORS.SECONDARY,
    fontSize: 16,
    paddingHorizontal: 5,
  },
});

export default TextModal;
