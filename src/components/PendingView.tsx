import React, {useCallback} from 'react';
import {Linking, TouchableOpacity} from 'react-native';
import {CameraPermissionStatus} from 'react-native-vision-camera';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';
import {COLORS} from '../settings';

type Props = {
  status?: CameraPermissionStatus;
};

const OpenSettingsButton = ({title}: {title: string}) => {
  const handlePress = useCallback(async () => {
    // Open the custom settings if the app has one
    await Linking.openSettings();
  }, []);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.settignsButton}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const PendingView: React.FC<Props> = ({status}: Props) => {
  const {t} = useTranslation();
  let msg;

  if (status === 'denied') {
    msg = t('camera_not_authorized_text');
  }

  return (
    <View style={styles.loading}>
      {msg && <Text style={styles.resultText}>{msg}</Text>}
      {msg && <OpenSettingsButton title={t('open_settings')} />}
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
  settignsButton: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 10,
    padding: 10,
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    paddingHorizontal: 5,
  },
});
export default PendingView;
