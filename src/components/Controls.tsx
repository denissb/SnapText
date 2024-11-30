import React, { MutableRefObject, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Switch,
  Platform,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';
import Menu from './Menu';
import CopyButton from './CopyButton';
import {showToast} from '../services/toast';
import {COLORS} from '../settings';

type Props = {
  flash: boolean;
  setFlash: (value: boolean) => void;
  crop: boolean;
  snapText: (...args: Array<any>) => any;
  setCrop: (...args: Array<any>) => any;
  isReady: MutableRefObject<boolean>;
  barCodeLink?: string;
  onBarCodeLinkClose: (...args: Array<any>) => any;
};
const isAndroid = Platform.OS === 'android';
const hitSlop = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20,
};

const openLink = (link: string) => Linking.openURL(link);

const BottomControls: React.FC<Props> = ({
  flash,
  setFlash,
  crop,
  setCrop,
  snapText,
  barCodeLink,
  onBarCodeLinkClose,
  isReady,
}: Props) => {
  const {t} = useTranslation();
  const [isCaptureReady, setIsCaptureReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsCaptureReady(isReady.current);
    }, 12);

    return () => interval && clearInterval(interval);
  }, [isReady]);

  return (
    <View style={styles.container}>
      {barCodeLink && (
        <View style={styles.linkContainer}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => onBarCodeLinkClose()}
            hitSlop={hitSlop}>
            <Icon name="x" size={30} color={COLORS.TRINARY} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkBody}
            onPress={() => openLink(barCodeLink)}>
            <Text style={styles.linkLabel}>{t('open_link')}</Text>
            <Text numberOfLines={1} selectable style={styles.linkText}>
              {barCodeLink}
            </Text>
            <CopyButton content={barCodeLink} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.controls}>
        <View style={styles.controlsContainer}>
          <View style={styles.switchContainer}>
            <Icon name="zap" size={25} color={COLORS.SECONDARY} />
            <Switch
              value={flash}
              onValueChange={setFlash}
              thumbColor={
                isAndroid
                  ? flash
                    ? COLORS.PRIMARY
                    : COLORS.SECONDARY
                  : undefined
              }
              style={styles.switch}
            />
          </View>
        </View>
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={() =>
              isCaptureReady || flash ? snapText() : showToast(t('no_capture_text'))
            }
            style={
              isCaptureReady ? [styles.capture, styles.readyCapture] : styles.capture
            }>
            <Icon name="camera" size={32} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>
        <View style={styles.controlsContainer}>
          <View style={styles.switchContainer}>
            <Icon name="crop" size={25} color={COLORS.SECONDARY} />
            <Switch
              value={crop}
              onValueChange={setCrop}
              thumbColor={
                isAndroid
                  ? crop
                    ? COLORS.PRIMARY
                    : COLORS.SECONDARY
                  : undefined
              }
              style={styles.switch}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

type TopControlProps = {
  openImagePicker: (...args: Array<any>) => any;
};

const TopControls: React.FC<TopControlProps> = ({openImagePicker}) => (
  <View style={styles.topControls}>
    <Menu />
    <TouchableOpacity
      style={styles.topContainer}
      onPress={() => {
        openImagePicker();
      }}>
      <Icon name="file-text" size={25} color={COLORS.SECONDARY} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  controls: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingBottom: 10,
  },
  close: {
    alignSelf: 'flex-end',
  },
  linkContainer: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 10,
    padding: 12,
    margin: 12,
    alignSelf: 'center',
    maxWidth: 550,
  },
  linkBody: {
    alignItems: 'center',
  },
  linkText: {
    marginTop: 8,
    marginBottom: 12,
    color: COLORS.PRIMARY,
    fontSize: 16,
  },
  linkLabel: {
    color: COLORS.TRINARY,
    fontSize: 16,
  },
  capture: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 68,
    width: 68,
    height: 68,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 5,
    borderColor: COLORS.TRANSPARENCY,
  },
  readyCapture: {
    borderWidth: 5,
    borderColor: COLORS.PRIMARY,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.TRANSPARENCY,
    padding: 8,
    borderRadius: 10,
  },
  switch: {
    marginLeft: Platform.OS === 'ios' ? 5 : 0,
  },
  topContainer: {
    backgroundColor: COLORS.TRANSPARENCY,
    padding: 12,
    borderRadius: 10,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginTop: 24,
    marginHorizontal: 22,
  },
});
export default BottomControls;
export {TopControls};
