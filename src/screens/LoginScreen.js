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
            {navigation.canGoBack() ? (
              <Pressable
                style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backIcon}>{'<'}</Text>
                <Text style={styles.backText}>Back</Text>
              </Pressable>
            ) : null}

            <Text style={styles.title}>Campus Lost & Found</Text>
            <Text style={styles.subtitle}>Sign in to report or recover items</Text>

            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#51686f"
              value={email}
              onChangeText={setEmail}
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              keyboardAppearance="light"
              selectionColor="#0b7285"
              cursorColor="#0b7285"
            />
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#51686f"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoComplete="password"
              textContentType="password"
              keyboardAppearance="light"
              selectionColor="#0b7285"
              cursorColor="#0b7285"
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
  fieldLabel: {
    color: '#355158',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d3dee2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    minHeight: 48,
    backgroundColor: '#fff',
    color: '#0f2f36',
    fontSize: 16,
    lineHeight: 21,
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
