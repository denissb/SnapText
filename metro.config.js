// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig, mergeConfig } = require('expo/metro-config');
const {
  getBundleModeMetroConfig,
} = require('react-native-worklets/bundleMode');

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname);

// Your modifications to the config

config = getBundleModeMetroConfig(config);

module.exports = config;
