import React, { useEffect, useRef, useState } from 'react';
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
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import { imageService } from '../services/imageService';
import { locationService } from '../services/locationService';
import { permissionsService } from '../services/permissionsService';
import { storageService } from '../services/storageService';
import { DEFAULT_CAMPUS } from '../config/env';
import { CAMPUSES, CATEGORIES } from '../utils/constants';
import { generateItemImageUrl } from '../utils/imageFallback';
import { validateReport } from '../utils/validators';

const defaultForm = {
  status: 'lost',
  title: '',
  description: '',
  category: 'Other',
  campus: DEFAULT_CAMPUS,
  locationText: '',
  imageUrl: '',
  location: null,
};

const Chip = ({ label, selected, onPress }) => (
  <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
  </Pressable>
);

const ReportItemScreen = () => {
  const { createReport } = useItems();
  const { user } = useAuth();

  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const skipNextDraftPersist = useRef(false);
  const draftReady = useRef(false);

  useEffect(() => {
    const bootstrap = async () => {
      const draft = await storageService.getJSON(storageService.keys.LAST_REPORT_DRAFT, null);
      if (draft) {
        setForm(draft);
      }

      draftReady.current = true;
      permissionsService.requestNotificationPermission().catch(() => undefined);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (!draftReady.current) {
      return;
    }

    if (skipNextDraftPersist.current) {
      skipNextDraftPersist.current = false;
      return;
    }

    const timer = setTimeout(() => {
      storageService.setJSON(storageService.keys.LAST_REPORT_DRAFT, form).catch(() => undefined);
    }, 300);

    return () => clearTimeout(timer);
  }, [form]);

  const updateForm = (nextPatch) => {
    setForm((prev) => ({ ...prev, ...nextPatch }));
  };

  const applyGeneratedImage = () => {
    updateForm({ imageUrl: generateItemImageUrl(form) });
  };

  const attachPhoto = async (source) => {
    const allowed =
      source === 'gallery'
        ? await permissionsService.requestGalleryPermission()
        : await permissionsService.requestCameraPermission();
    if (!allowed) {
      Alert.alert(
        'Permission',
        source === 'gallery'
          ? 'Gallery permission is required to select photos.'
          : 'Camera permission is required to attach photos.'
      );
      return;
    }

    const asset = source === 'gallery' ? await imageService.openGallery() : await imageService.openCamera();
    if (!asset?.uri) {
      return;
    }

    // Replace with upload endpoint and use returned URL in production.
    updateForm({ imageUrl: asset.uri });
  };

  const attachLocation = async () => {
    const allowed = await permissionsService.requestLocationPermission();
    if (!allowed) {
      Alert.alert('Permission', 'Location permission is required to tag where the item was lost/found.');
      return;
    }

    try {
      const current = await locationService.getCurrentPosition();
      updateForm({ location: current });
    } catch (_error) {
      Alert.alert('Location error', 'Could not access GPS. Please enable location permission.');
    }
  };

  const clearDraft = async () => {
    skipNextDraftPersist.current = true;
    setForm(defaultForm);
    await storageService.remove(storageService.keys.LAST_REPORT_DRAFT);
    Alert.alert('Draft cleared', 'Form has been reset.');
  };

  const onSubmit = async () => {
    const validationError = validateReport(form);
    if (validationError) {
      Alert.alert('Validation', validationError);
      return;
    }

    if (!user?._id) {
      Alert.alert('Session error', 'Please login again.');
      return;
    }

    setSubmitting(true);
    try {
      await createReport({
        ...form,
        imageUrl: form.imageUrl || generateItemImageUrl(form),
        reportedBy: user._id,
      });
      skipNextDraftPersist.current = true;
      setForm(defaultForm);
      await storageService.remove(storageService.keys.LAST_REPORT_DRAFT);
      Alert.alert('Success', 'Report posted successfully.');
    } catch (error) {
      Alert.alert('Failed', error?.response?.data?.message || 'Could not create report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Report Lost or Found Item</Text>
          <Text style={styles.subtitle}>Add photo, location, and details for faster matching.</Text>

          <View style={styles.pointsRow}>
            <Text style={styles.point}>✅ Title</Text>
            <Text style={styles.point}>🖼️ Photo</Text>
            <Text style={styles.point}>📍 Location</Text>
          </View>

          <View style={styles.segmentRow}>
            {['lost', 'found'].map((state) => {
              const active = form.status === state;
              return (
                <Pressable
                  key={state}
                  style={[styles.segment, active && styles.segmentActive]}
                  onPress={() => updateForm({ status: state })}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{state}</Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Title (e.g., Black Samsung Phone)"
            placeholderTextColor="#6a7f86"
            value={form.title}
            onChangeText={(title) => updateForm({ title })}
          />
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Describe key details"
            placeholderTextColor="#6a7f86"
            multiline
            value={form.description}
            onChangeText={(description) => updateForm({ description })}
          />

          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.chipsWrap}>
            {CATEGORIES.map((category) => (
              <Chip
                key={category}
                label={category}
                selected={form.category === category}
                onPress={() => updateForm({ category })}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Campus</Text>
          <View style={styles.chipsWrap}>
            {CAMPUSES.map((campus) => (
              <Chip
                key={campus}
                label={campus}
                selected={form.campus === campus}
                onPress={() => updateForm({ campus })}
              />
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Location Description (e.g., Library Block A)"
            placeholderTextColor="#6a7f86"
            value={form.locationText}
            onChangeText={(locationText) => updateForm({ locationText })}
          />

          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton} onPress={() => attachPhoto('camera')}>
              <Text style={styles.secondaryText}>📸 Use Camera</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => attachPhoto('gallery')}>
              <Text style={styles.secondaryText}>🖼️ From Gallery</Text>
            </Pressable>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton} onPress={attachLocation}>
              <Text style={styles.secondaryText}>{form.location ? '📍 GPS Added' : '📍 Add GPS'}</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={applyGeneratedImage}>
              <Text style={styles.secondaryText}>🎨 Generate Image</Text>
            </Pressable>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={[styles.secondaryButton, styles.secondaryDanger]} onPress={clearDraft}>
              <Text style={[styles.secondaryText, styles.secondaryDangerText]}>Clear Draft</Text>
            </Pressable>
          </View>

          {Boolean(form.imageUrl) && (
            <View style={styles.previewWrap}>
              <Text style={styles.previewTitle}>Attached Photo Preview</Text>
              <Image source={{ uri: form.imageUrl }} style={styles.previewImage} resizeMode="cover" />
            </View>
          )}
          {Boolean(form.location) && (
            <Text style={styles.meta}>
              Coordinates: {form.location.latitude?.toFixed(5)}, {form.location.longitude?.toFixed(5)}
            </Text>
          )}

          <Pressable style={styles.submitButton} onPress={onSubmit} disabled={submitting}>
            <Text style={styles.submitText}>{submitting ? 'Posting...' : 'Submit Report'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6fafb' },
  content: { padding: 14, paddingBottom: 24 },
  title: { fontSize: 20, fontWeight: '800', color: '#12343b', marginBottom: 12 },
  subtitle: { color: '#55727a', marginTop: -6, marginBottom: 8 },
  pointsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  point: {
    borderWidth: 1,
    borderColor: '#d3e3e7',
    borderRadius: 999,
    backgroundColor: '#fbfeff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#1f5360',
    fontWeight: '700',
    fontSize: 12,
  },
  segmentRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cad9de',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  segmentActive: { backgroundColor: '#0b7285', borderColor: '#0b7285' },
  segmentText: { textTransform: 'uppercase', color: '#333', fontWeight: '700' },
  segmentTextActive: { color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#d2dde1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    color: '#12343b',
  },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  sectionLabel: { fontWeight: '700', color: '#33535a', marginBottom: 6, marginTop: 4 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  chip: {
    borderWidth: 1,
    borderColor: '#d1dde1',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#e0f3f6',
    borderColor: '#0b7285',
  },
  chipText: { color: '#3f5b61', fontWeight: '600' },
  chipTextSelected: { color: '#095b6a' },
  actionRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#97b9c1',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 10,
  },
  secondaryDanger: { borderColor: '#d79d9d', backgroundColor: '#fff8f8' },
  secondaryText: { color: '#15545f', fontWeight: '700' },
  secondaryDangerText: { color: '#9e2f2f' },
  previewWrap: {
    borderWidth: 1,
    borderColor: '#d3e2e6',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 8,
  },
  previewTitle: { color: '#204a54', fontWeight: '800', marginBottom: 8 },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#dfecef',
  },
  meta: { color: '#587479', marginBottom: 8, fontWeight: '600' },
  submitButton: {
    backgroundColor: '#1d7e3f',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 2,
  },
  submitText: { color: '#fff', fontWeight: '700' },
});

export default ReportItemScreen;
