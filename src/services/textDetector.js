/**
 * @format
 * @flow strict-local
 */

import MlkitOcr from 'react-native-mlkit-ocr';

const getTextFromBlock = block =>
  block.lines.map(({text}) => text).join('') + '\n\n';

export const recogniseText = async imageURI => {
  const result = await MlkitOcr.detectFromUri(imageURI);

  const resultText = result.reduce((blockResult, nextBlock) => {
    if (typeof blockResult === 'object') {
      return getTextFromBlock(blockResult) + getTextFromBlock(nextBlock);
    } else {
      return blockResult + getTextFromBlock(nextBlock);
    }
  });

  return resultText;
};
