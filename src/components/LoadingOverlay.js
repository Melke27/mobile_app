import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingOverlay = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});

export default LoadingOverlay;
