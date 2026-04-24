import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const EmptyState = ({ title = 'No Data Yet', message, icon = '📭', actionLabel, onAction }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d7e4e8',
    borderRadius: 12,
    backgroundColor: '#fbfeff',
    marginTop: 10,
  },
  icon: {
    fontSize: 28,
    marginBottom: 8,
  },
  title: {
    color: '#204a54',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  text: {
    color: '#577079',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#0b7285',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default EmptyState;
