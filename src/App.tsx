import React, {useEffect} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import {setup as i18nSetup} from './services/i18n';
import Camera from './components/Camera';
import {COLORS} from './settings';

const Wrapper = Platform.OS === 'ios' ? SafeAreaView : View;

i18nSetup();

const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.PRIMARY}
        translucent
      />
      <Wrapper style={styles.container}>
        <Camera />
      </Wrapper>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
});

export default App;
