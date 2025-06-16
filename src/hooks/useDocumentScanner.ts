import {useCallback} from 'react';
import {
  launchDocumentScannerAsync,
  ResultFormatOptions,
  ScannerModeOptions,
} from '@infinitered/react-native-mlkit-document-scanner';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';
import {showToast} from '../services/toast';
import {useTranslation} from 'react-i18next';

import {useModal} from '../context/ModalContext';

const useDocumentScanner = () => {
  const {t} = useTranslation();
  const {setIsModalOpen} = useModal();

  const scanDocument = useCallback(async () => {
    setIsModalOpen(true);

    // result will contain an object with the result information
    const result = await launchDocumentScannerAsync({
      pageLimit: 42, // :|
      galleryImportAllowed: true,
      scannerMode: ScannerModeOptions.FULL,
      resultFormats: ResultFormatOptions.PDF,
    });

    if (result.pdf) {
      try {
        await FileSystem.getContentUriAsync(result.pdf.uri).then(cUri => {
          IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: cUri,
            flags: 1,
            type: 'application/pdf',
          });
        });
      } catch (e) {
        showToast(t('error_scanning_document'));
        console.error(e);
      }
    } else {
      showToast(t('no_document_scanned'));
    }

    setIsModalOpen(false);
  }, []);

  return scanDocument;
};

export default useDocumentScanner;
