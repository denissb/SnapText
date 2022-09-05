import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS, LINKS} from '../settings';
import {useTranslation} from 'react-i18next';
import WebViewModal from './WebViewModal';
import policyContent from '../assets/html/policy';

const openLink = async (link: string) => {
  try {
    await Linking.openURL(link);
  } catch (err) {
    console.error('An error occurred', err);
  }
};

const Menu: React.FC = () => {
  const {t} = useTranslation();
  const [opened, setIsOpened] = useState(false);
  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  const hamburgerSyles = opened
    ? [styles.hamburger, styles.hamburgerOpened]
    : styles.hamburger;
  return (
    <>
      <TouchableOpacity
        style={hamburgerSyles}
        onPress={() => setIsOpened(!opened)}>
        <Icon
          name="menu"
          size={30}
          color={opened ? COLORS.TRINARY : COLORS.SECONDARY}
        />
      </TouchableOpacity>
      {opened && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setPolicyModalVisible(true)}>
            <Text style={styles.text}>{t('privacy_policy_label')}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink(LINKS.SOURCE_CODE)}>
            <Text style={styles.text}>{t('source_code_label')}</Text>
          </TouchableOpacity>
          <WebViewModal
            visible={policyModalVisible}
            setIsVisible={setPolicyModalVisible}
            source={{
              html: policyContent,
            }}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  hamburger: {
    backgroundColor: COLORS.TRANSPARENCY,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerOpened: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: COLORS.SECONDARY,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.TRINARY,
  },
  menu: {
    position: 'absolute',
    top: 50,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: COLORS.SECONDARY,
    minWidth: 190,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.TRINARY,
  },
  menuItem: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  text: {
    color: COLORS.TRINARY,
    fontSize: 16,
  },
  line: {
    borderBottomColor: COLORS.TRINARY,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    width: '100%',
  },
});
export default Menu;
