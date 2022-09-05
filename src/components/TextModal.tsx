import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS} from '../settings';
import CopyButton from './CopyButton';

type Props = {
  content?: string;
  isVisible: boolean;
  setIsVisible: (...args: Array<any>) => any;
};
const hitSlop = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20,
};

const TextModal: React.FC<Props> = ({content, isVisible, setIsVisible}) => {
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
          {content ? (
            <>
              <TextInput
                value={content}
                multiline
                style={styles.text}
                showSoftInputOnFocus={false}
              />
              <CopyButton content={content} />
            </>
          ) : (
            <Text style={styles.text}>{t('error_in_recognition')}</Text>
          )}
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
  close: {
    alignSelf: 'flex-end',
    marginRight: -8,
  },
});
export default TextModal;
