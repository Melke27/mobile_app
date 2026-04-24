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

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) {
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
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
            <Text style={styles.title}>Campus Lost & Found</Text>
            <Text style={styles.subtitle}>Sign in to report or recover items</Text>

            <TextInput
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Email"
              placeholderTextColor="#6a7f86"
              value={email}
              onChangeText={setEmail}
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#6a7f86"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Pressable style={[styles.button, submitting && styles.buttonDisabled]} onPress={onSubmit} disabled={submitting}>
              <Text style={styles.buttonText}>{submitting ? 'Signing in...' : 'Login'}</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Create new account</Text>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2edf0',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#12343b' },
  subtitle: { marginTop: 4, color: '#5d7278', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#d3dee2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#12343b',
  },
  button: {
    backgroundColor: '#0b7285',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: '#86a9b2',
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  link: { marginTop: 12, color: '#0b7285', textAlign: 'center', fontWeight: '600' },
});

export default LoginScreen;
