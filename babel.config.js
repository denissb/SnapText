module.exports = {
  presets: [
    [
      '@rnx-kit/babel-preset-metro-react-native',
      {disableImportExportTransform: true},
    ],
  ],
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes', '__scanOCR'],
      },
    ],
  ],
};
