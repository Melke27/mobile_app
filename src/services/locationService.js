import Geolocation from '@react-native-community/geolocation';

export const locationService = {
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (info) => {
          resolve({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
            accuracy: info.coords.accuracy,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  },
};
