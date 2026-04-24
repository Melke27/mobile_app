import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { qrService } from '../services/qrService';

const VerificationScreen = () => {
  const { user } = useAuth();
  const [itemId, setItemId] = useState('');
  const [token, setToken] = useState('');
  const [verification, setVerification] = useState(null);
  const [verificationError, setVerificationError] = useState('');

  const generate = () => {
    if (!itemId.trim() || !user?._id) {
      return;
    }

    const value = qrService.createOwnershipToken({ itemId: itemId.trim(), ownerId: user._id });
    setToken(value);
    setVerification(null);
    setVerificationError('');
  };

  const verify = () => {
    const parsed = qrService.parseOwnershipToken(token);
    setVerification(parsed);
    setVerificationError(parsed ? '' : 'Token is invalid or incomplete.');
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>QR Ownership Verification</Text>
            <Text style={styles.desc}>
              Generate an ownership token. In production, encode this token as a QR image and verify at pickup.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Item ID"
              placeholderTextColor="#6a7f86"
              value={itemId}
              onChangeText={setItemId}
            />

            <Pressable style={styles.button} onPress={generate}>
              <Text style={styles.buttonText}>Generate Token</Text>
            </Pressable>

            <TextInput
              style={[styles.input, styles.multiline]}
              multiline
              value={token}
              onChangeText={setToken}
              placeholder="Token will appear here"
              placeholderTextColor="#6a7f86"
            />

            <Pressable style={[styles.button, styles.alt]} onPress={verify}>
              <Text style={styles.buttonText}>Verify Token</Text>
            </Pressable>

            {verificationError ? <Text style={styles.errorText}>{verificationError}</Text> : null}

            {verification && (
              <View style={styles.result}>
                <Text style={styles.resultText}>Valid Token</Text>
                <Text style={styles.resultText}>Item: {verification.itemId}</Text>
                <Text style={styles.resultText}>Owner: {verification.ownerId}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6fafb' },
  keyboardWrap: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 14 },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#d3e2e6', padding: 14 },
  title: { fontSize: 20, fontWeight: '800', color: '#12343b' },
  desc: { color: '#587277', marginTop: 5, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#c9dadd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    color: '#12343b',
    backgroundColor: '#fff',
  },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
  button: { backgroundColor: '#0b7285', borderRadius: 8, paddingVertical: 11, alignItems: 'center', marginBottom: 10 },
  alt: { backgroundColor: '#1d7e3f' },
  buttonText: { color: '#fff', fontWeight: '700' },
  errorText: { color: '#b54848', marginBottom: 10, fontWeight: '600' },
  result: { backgroundColor: '#e6f6e9', borderRadius: 8, padding: 10 },
  resultText: { color: '#1a5f2f', fontWeight: '600' },
});

export default VerificationScreen;
