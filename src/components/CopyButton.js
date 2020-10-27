// @flow
import React from 'react';
import {Clipboard, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS} from '../settings';
import {showToast} from '../services/toast';

type Props = {
  content: String,
};

const copyToClipboard = (text, msg) => {
  Clipboard.setString(text);
  if (msg) {
    showToast(msg);
  }
};

export const CopyButton: () => React$Node = ({content}: Props) => {
  const {t} = useTranslation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => copyToClipboard(content, t('text_copied_to_clipboard'))}>
      <Icon name="copy" size={25} color={COLORS.SECONDARY} />
      <Text style={styles.buttonText}>{t('copy')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.SECONDARY,
    fontSize: 16,
    paddingHorizontal: 5,
  },
});

export default CopyButton;
