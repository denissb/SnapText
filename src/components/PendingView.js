import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';
import {COLORS} from '../settings';

type Props = {
  status: String,
};

const PendingView = ({status}: Props) => {
  const {t} = useTranslation();

  let msg;

  if (status === 'NOT_AUTHORIZED') {
    msg = t('camera_not_authorized_text');
  }

  return (
    <View style={styles.loading}>
      {msg && <Text style={styles.resultText}>{msg}</Text>}
      {!msg && <Icon name="loader" size={42} color={COLORS.SECONDARY} />}
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    paddingHorizontal: 25,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.SECONDARY,
  },
});

export default PendingView;
