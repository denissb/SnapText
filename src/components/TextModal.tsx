import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
} from 'react-native';
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
      visible={isVisible}
      onDismiss={() => setIsVisible(false)}
      onRequestClose={() => setIsVisible(false)}
      animationType="fade"
      hardwareAccelerated
      statusBarTranslucent
      navigationBarTranslucent
      transparent>
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
              <ScrollView>
                <TextInput
                  value={content}
                  multiline
                  style={styles.text}
                  showSoftInputOnFocus={false}
                />
              </ScrollView>
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
    backgroundColor: COLORS.TRANSPARENCY,
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: 10,
    maxHeight: '72%',
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
