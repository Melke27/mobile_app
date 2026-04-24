import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EmptyState = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#666',
    fontSize: 14,
  },
});

export default EmptyState;
