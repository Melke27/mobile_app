import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
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
import { useItems } from '../context/ItemsContext';
import { DEFAULT_CAMPUS } from '../config/env';
import { imageService } from '../services/imageService';
import { permissionsService } from '../services/permissionsService';
import { storageService } from '../services/storageService';
import { isValidEmail } from '../utils/validators';

const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) {
    return 'U';
  }
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
};

const toProfileImageValue = (asset) => {
  if (!asset) {
    return '';
  }
  if (asset.base64) {
    const mime = asset.type || 'image/jpeg';
    return `data:${mime};base64,${asset.base64}`;
  }
  return asset.uri || '';
};

const AccountScreen = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const { clearSavedItems } = useItems();
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    campus: DEFAULT_CAMPUS,
    avatarUrl: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingImage, setChangingImage] = useState(false);
  const [clearingData, setClearingData] = useState(false);

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      campus: user?.campus || DEFAULT_CAMPUS,
      avatarUrl: user?.avatarUrl || '',
    });
  }, [user]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) {
      return 'Unknown';
    }
    try {
      return new Date(user.createdAt).toLocaleDateString();
    } catch (_error) {
      return 'Unknown';
    }
  }, [user?.createdAt]);

  const updateProfileField = (patch) => setProfileForm((prev) => ({ ...prev, ...patch }));
  const updatePasswordField = (patch) => setPasswordForm((prev) => ({ ...prev, ...patch }));

  const chooseProfileImage = async (source) => {
    setChangingImage(true);
    try {
      const allowed =
        source === 'camera'
          ? await permissionsService.requestCameraPermission()
          : await permissionsService.requestGalleryPermission();
      if (!allowed) {
        Alert.alert('Permission', 'Permission is required to change profile image.');
        return;
      }

      const asset =
        source === 'camera'
          ? await imageService.openCamera({ includeBase64: true })
          : await imageService.openGallery({ includeBase64: true });
      const avatarUrl = toProfileImageValue(asset);
      if (!avatarUrl) {
        return;
      }
      updateProfileField({ avatarUrl });
    } catch (_error) {
      Alert.alert('Image', 'Could not load image. Please try again.');
    } finally {
      setChangingImage(false);
    }
  };

  const onSaveProfile = async () => {
    const payload = {
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      campus: profileForm.campus.trim(),
      avatarUrl: profileForm.avatarUrl,
    };

    if (!payload.name) {
      Alert.alert('Validation', 'Please enter your name.');
      return;
    }
    if (!isValidEmail(payload.email)) {
      Alert.alert('Validation', 'Please enter a valid email.');
      return;
    }
    if (!payload.campus) {
      Alert.alert('Validation', 'Please enter your campus.');
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile(payload);
      Alert.alert('Success', 'Profile updated successfully.');
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      Alert.alert('Validation', 'Please fill all password fields.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Validation', 'New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      Alert.alert('Validation', 'New password and confirm password do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      Alert.alert('Success', 'Password updated successfully.');
    } finally {
      setChangingPassword(false);
    }
  };

  const onLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const onClearSavedItems = () => {
    Alert.alert('Clear Saved Items', 'Remove all your bookmarked/saved items from this phone?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          setClearingData(true);
          try {
            await clearSavedItems();
            Alert.alert('Done', 'Saved items cleared.');
          } finally {
            setClearingData(false);
          }
        },
      },
    ]);
  };

  const onClearDraftAndCache = () => {
    Alert.alert(
      'Clear Draft + Cache',
      'This clears report draft and cached feed data on this phone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setClearingData(true);
            try {
              await Promise.all([
                storageService.remove(storageService.keys.LAST_REPORT_DRAFT),
                storageService.remove(storageService.keys.CACHED_REPORTS),
              ]);
              Alert.alert('Done', 'Draft and cache cleared.');
            } finally {
              setClearingData(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.headerCard}>
            <View style={styles.avatarWrap}>
              {profileForm.avatarUrl ? (
                <Image source={{ uri: profileForm.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarInitials}>{getInitials(profileForm.name)}</Text>
              )}
            </View>
            <Text style={styles.nameText}>{profileForm.name || 'Campus User'}</Text>
            <Text style={styles.metaText}>Member since {memberSince}</Text>
            <View style={styles.imageButtonsRow}>
              <Pressable style={styles.imageButton} onPress={() => chooseProfileImage('camera')} disabled={changingImage}>
                <Text style={styles.imageButtonText}>{changingImage ? 'Working...' : 'Camera'}</Text>
              </Pressable>
              <Pressable style={styles.imageButton} onPress={() => chooseProfileImage('gallery')} disabled={changingImage}>
                <Text style={styles.imageButtonText}>{changingImage ? 'Working...' : 'Gallery'}</Text>
              </Pressable>
              <Pressable
                style={[styles.imageButton, styles.removeImageButton]}
                onPress={() => updateProfileField({ avatarUrl: '' })}
                disabled={changingImage}
              >
                <Text style={[styles.imageButtonText, styles.removeImageButtonText]}>Remove</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Profile Settings</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#6a7f86"
              value={profileForm.name}
              onChangeText={(name) => updateProfileField({ name })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6a7f86"
              keyboardType="email-address"
              autoCapitalize="none"
              value={profileForm.email}
              onChangeText={(email) => updateProfileField({ email })}
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Campus"
              placeholderTextColor="#6a7f86"
              value={profileForm.campus}
              onChangeText={(campus) => updateProfileField({ campus })}
            />
            <Pressable
              style={[styles.primaryButton, savingProfile && styles.primaryButtonDisabled]}
              onPress={onSaveProfile}
              disabled={savingProfile}
            >
              <Text style={styles.primaryButtonText}>{savingProfile ? 'Saving...' : 'Save Profile'}</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Security</Text>
            <TextInput
              style={styles.input}
              placeholder="Current password"
              placeholderTextColor="#6a7f86"
              secureTextEntry
              value={passwordForm.currentPassword}
              onChangeText={(currentPassword) => updatePasswordField({ currentPassword })}
            />
            <TextInput
              style={styles.input}
              placeholder="New password"
              placeholderTextColor="#6a7f86"
              secureTextEntry
              value={passwordForm.newPassword}
              onChangeText={(newPassword) => updatePasswordField({ newPassword })}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#6a7f86"
              secureTextEntry
              value={passwordForm.confirmNewPassword}
              onChangeText={(confirmNewPassword) => updatePasswordField({ confirmNewPassword })}
            />
            <Pressable
              style={[styles.primaryButton, changingPassword && styles.primaryButtonDisabled]}
              onPress={onChangePassword}
              disabled={changingPassword}
            >
              <Text style={styles.primaryButtonText}>{changingPassword ? 'Updating...' : 'Change Password'}</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Actions</Text>
            <Pressable style={styles.actionButton} onPress={onClearSavedItems} disabled={clearingData}>
              <Text style={styles.actionButtonText}>{clearingData ? 'Working...' : 'Clear Saved Items'}</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={onClearDraftAndCache} disabled={clearingData}>
              <Text style={styles.actionButtonText}>{clearingData ? 'Working...' : 'Clear Draft + Cache'}</Text>
            </Pressable>
            <Pressable style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutText}>Sign Out</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4f8fa' },
  content: { padding: 14, paddingBottom: 24, gap: 12 },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d9e7ea',
    padding: 14,
    alignItems: 'center',
  },
  avatarWrap: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#d7edf2',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#9cc3cd',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarInitials: { fontSize: 34, fontWeight: '800', color: '#184650' },
  nameText: { marginTop: 10, fontSize: 20, fontWeight: '800', color: '#143b44' },
  metaText: { marginTop: 2, color: '#5f7a80' },
  imageButtonsRow: { marginTop: 12, flexDirection: 'row', gap: 8 },
  imageButton: {
    borderWidth: 1,
    borderColor: '#9dc2cb',
    backgroundColor: '#f4fcff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  imageButtonText: { color: '#105666', fontWeight: '700' },
  removeImageButton: { borderColor: '#e6b7b7', backgroundColor: '#fff7f7' },
  removeImageButtonText: { color: '#8f3232' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d9e7ea',
    padding: 14,
  },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#123841', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#d2dde1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    color: '#12343b',
    backgroundColor: '#fff',
  },
  primaryButton: { backgroundColor: '#0b7285', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  primaryButtonDisabled: { backgroundColor: '#86a9b2' },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  actionButton: {
    borderWidth: 1,
    borderColor: '#c0d6dc',
    backgroundColor: '#f7fcfd',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: { color: '#21464f', fontWeight: '700' },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#e3b1b1',
    backgroundColor: '#fff6f6',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 2,
  },
  logoutText: { color: '#9f3333', fontWeight: '800' },
});

export default AccountScreen;
