import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {Platform, NativeModules} from 'react-native';
import en from '../translations/en';
import de from '../translations/de';
import dk from '../translations/dk';
import fr from '../translations/fr';
import lv from '../translations/lv';
import ru from '../translations/ru';
export const setup = () => {
  const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: (cb: (lang: string) => void) => {
      const language =
        Platform.OS === 'ios'
          ? NativeModules.SettingsManager.settings.AppleLocale
          : NativeModules.I18nManager.localeIdentifier;

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
        de: {
          translation: de,
        },
        dk: {
          translation: dk,
        },
        fr: {
          translation: fr,
        },
        lv: {
          translation: lv,
        },
        ru: {
          translation: ru,
        },
      },
    });
};
