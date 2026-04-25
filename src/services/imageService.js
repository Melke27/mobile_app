import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const baseOptions = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1280,
  maxHeight: 1280,
};

const buildOptions = (includeBase64 = false) => ({
  ...baseOptions,
  quality: includeBase64 ? 0.55 : baseOptions.quality,
  maxWidth: includeBase64 ? 640 : baseOptions.maxWidth,
  maxHeight: includeBase64 ? 640 : baseOptions.maxHeight,
  includeBase64,
});

const resolveAsset = (response) => {
  if (response.didCancel || !response.assets || !response.assets[0]) {
    return null;
  }

  return response.assets[0];
};

export const imageService = {
  openCamera(config = {}) {
    const includeBase64 = Boolean(config.includeBase64);
    return new Promise((resolve) => {
      launchCamera(buildOptions(includeBase64), (response) => {
        resolve(resolveAsset(response));
      });
    });
  },

  openGallery(config = {}) {
    const includeBase64 = Boolean(config.includeBase64);
    return new Promise((resolve) => {
      launchImageLibrary(buildOptions(includeBase64), (response) => {
        resolve(resolveAsset(response));
      });
    });
  },
};
