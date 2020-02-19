// @flow
import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS, LINKS} from '../settings';
import {useTranslation} from 'react-i18next';

type Props = {};

const openLink = async link => {
  try {
    await Linking.openURL(link);
  } catch (err) {
    console.error('An error occurred', err);
  }
};

const Menu: () => React$Node = ({}: Props) => {
  const {t} = useTranslation();

  const [opened, setIsOpened] = useState(false);

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
          size={32}
          color={opened ? COLORS.TRINARY : COLORS.SECONDARY}
        />
      </TouchableOpacity>
      {opened && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink(LINKS.POLICY)}>
            <Text style={styles.text}>{t('privacy_policy_label')}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => openLink(LINKS.SOURCE_CODE)}>
            <Text style={styles.text}>{t('source_code_label')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  hamburger: {
    borderColor: 'rgba(50, 50, 50, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  hamburgerOpened: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: COLORS.SECONDARY,
  },
  menu: {
    position: 'absolute',
    top: 50,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: COLORS.SECONDARY,
    minWidth: 190,
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
