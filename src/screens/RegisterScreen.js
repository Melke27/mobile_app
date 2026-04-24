import React, { useState } from 'react';
import {
  Alert,
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
import { DEFAULT_CAMPUS } from '../config/env';
import { isValidEmail } from '../utils/validators';

const RegisterScreen = () => {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState(DEFAULT_CAMPUS);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter your name.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Validation', 'Please enter a valid email.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation', 'Password should be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, campus: campus.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput style={styles.input} placeholder="Campus" value={campus} onChangeText={setCampus} />

            <Pressable style={[styles.button, submitting && styles.buttonDisabled]} onPress={onSubmit} disabled={submitting}>
              <Text style={styles.buttonText}>{submitting ? 'Creating...' : 'Create Account'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#eef5f8' },
  keyboardWrap: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#e2edf0' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 14, color: '#12343b' },
  input: {
    borderWidth: 1,
    borderColor: '#d3dee2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  button: { backgroundColor: '#0b7285', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#86a9b2' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default RegisterScreen;
