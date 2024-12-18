import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SystemBars} from 'react-native-edge-to-edge';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

import {setup as i18nSetup} from './services/i18n';
import Camera from './components/Camera';
import {COLORS} from './settings';

i18nSetup();

const SafeAreaApp: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide();
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
    <SafeAreaProvider>
      <SystemBars style="auto" hidden={false} />
      <View style={memoStyle}>
        <Camera />
      </View>
    </SafeAreaProvider>
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
