import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const options = {
  mediaType: 'photo',
  quality: 0.8,
  maxWidth: 1280,
  maxHeight: 1280,
};

const resolveAsset = (response) => {
  if (response.didCancel || !response.assets || !response.assets[0]) {
    return null;
  }

  return response.assets[0];
};

export const imageService = {
  openCamera() {
    return new Promise((resolve) => {
      launchCamera(options, (response) => {
        resolve(resolveAsset(response));
      });
    });
  },

  openGallery() {
    return new Promise((resolve) => {
      launchImageLibrary(options, (response) => {
        resolve(resolveAsset(response));
      });
    });
  },
};
