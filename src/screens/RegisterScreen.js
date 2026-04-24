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

const RegisterScreen = ({ navigation }) => {
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
            <Pressable
              style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>{'<'}</Text>
              <Text style={styles.backText}>Back</Text>
            </Pressable>

            <Text style={styles.title}>Create Account</Text>

            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#6a7f86"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6a7f86"
              keyboardType="email-address"
              autoCapitalize="none"
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
            <TextInput
              style={styles.input}
              placeholder="Campus"
              placeholderTextColor="#6a7f86"
              value={campus}
              onChangeText={setCampus}
            />

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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#d3dee2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 12,
    backgroundColor: '#f8fbfc',
  },
  backButtonPressed: { opacity: 0.7 },
  backIcon: { color: '#174651', fontWeight: '800', marginRight: 6, fontSize: 13 },
  backText: { color: '#174651', fontWeight: '700', fontSize: 13 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 14, color: '#12343b' },
  input: {
    borderWidth: 1,
    borderColor: '#d3dee2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    color: '#12343b',
  },
  button: { backgroundColor: '#0b7285', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#86a9b2' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default RegisterScreen;
