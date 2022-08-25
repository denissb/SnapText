// @ts-nocheck
import MlkitOcr from 'react-native-mlkit-ocr';

type Block = {
  lines: {text: string}[];
};

const getTextFromBlock = (block: Block) =>
  block.lines.map(({text}) => text).join('') + '\n\n';

export const recogniseText = async (imageURI: string) => {
  const result: Block[] = await MlkitOcr.detectFromUri(imageURI);
  let resultText = '';
  result.forEach((nextBlock: Block) => {
    resultText += getTextFromBlock(nextBlock);
  });
  return resultText;
};
