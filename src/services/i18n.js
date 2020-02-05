import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {Platform, NativeModules} from 'react-native';

import en from '../translations/en';

export const setup = () => {
  const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: cb => {
      const language = Platform.select({
        ios: () => NativeModules.SettingsManager.settings.AppleLocale,
        android: () => NativeModules.I18nManager.localeIdentifier,
      })();

      cb(language ? language.split('_')[0] : 'en');
    },
    init: () => {},
    cacheUserLanguage: () => {},
  };

  i18next
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      debug: __DEV__,
      resources: {
        en: {
          translation: en,
        },
      },
    });
};
