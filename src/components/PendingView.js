import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
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
      {!msg && <ActivityIndicator size="large" color={COLORS.SECONDARY} />}
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
    textAlign: 'center',
    color: COLORS.SECONDARY,
  },
});

export default PendingView;
