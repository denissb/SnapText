/** @type {import('react-native-worklets/plugin').PluginOptions} */
const workletsPluginOptions = {
  bundleMode: true,
  strictGlobal: true, // optional, but recommended
};

module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [['react-native-worklets/plugin', workletsPluginOptions]],
};
