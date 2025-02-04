import React, {useLayoutEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SystemBars} from 'react-native-edge-to-edge';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';

import {setup as i18nSetup} from './services/i18n';
import Camera from './components/Camera';
import ModalContext from './context/ModalContext';
import {COLORS} from './settings';

i18nSetup();

const SafeAreaApp: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useLayoutEffect(() => {
    BootSplash.hide({fade: true});
  }, []);

  const insets = useSafeAreaInsets();

  const memoStyle = useMemo(
    () => ({
      ...styles.container,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }),
    [insets],
  );

  return (
    <ModalContext.Provider
      value={{open: isModalOpen, setIsModalOpen: setIsModalOpen}}>
      <SafeAreaProvider>
        <SystemBars style="auto" hidden={false} />
        <View style={memoStyle}>
          <Camera />
        </View>
      </SafeAreaProvider>
    </ModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.PRIMARY,
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaApp />
    </SafeAreaProvider>
  );
}
