import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { adamaCampusGallery, adamaHeroImage } from '../assets/images';

const ADAMA_COORDINATE = {
  latitude: 8.5538,
  longitude: 39.2904,
};

const HomeScreen = ({ navigation }) => {
  const { items, loadLatest, loading } = useItems();
  const { user } = useAuth();

  const init = useCallback(() => {
    loadLatest().catch((error) => console.error(error));
  }, [loadLatest]);

  useEffect(() => {
    init();
  }, [init]);

  const summary = useMemo(() => {
    const lost = items.filter((item) => item.status === 'lost').length;
    const found = items.filter((item) => item.status === 'found').length;
    const recovered = items.filter((item) => item.status === 'recovered').length;

    return { lost, found, recovered };
  }, [items]);

  const openAdamaMap = useCallback(async () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${ADAMA_COORDINATE.latitude},${ADAMA_COORDINATE.longitude}`;
    try {
      const supported = await Linking.canOpenURL(mapsUrl);
      if (!supported) {
        Alert.alert('Map', 'Could not open maps on this device.');
        return;
      }
      await Linking.openURL(mapsUrl);
    } catch (_error) {
      Alert.alert('Map', 'Could not open Adama University map right now.');
    }
  }, []);

  const requireLogin = useCallback(() => {
    Alert.alert('Login required', 'Please sign in first to use this feature.');
    navigation.navigate('Account');
  }, [navigation]);

  const listHeader = (
    <View style={styles.headerContainer}>
      <ImageBackground source={adamaHeroImage} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Adama Campus Lost & Found</Text>
          <Text style={styles.heroSubtitle}>Fast reporting, trusted matching, easy recovery</Text>
        </View>
      </ImageBackground>

      <View style={styles.actionGrid}>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          onPress={() => (user ? navigation.navigate('Report') : requireLogin())}
        >
          <Text style={styles.actionTitle}>📝 Report Item</Text>
          <Text style={styles.actionMeta}>Lost or found</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.actionTitle}>🔎 Search Reports</Text>
          <Text style={styles.actionMeta}>Filter by campus</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          onPress={() => (user ? navigation.navigate('Alerts') : requireLogin())}
        >
          <Text style={styles.actionTitle}>🔔 Check Alerts</Text>
          <Text style={styles.actionMeta}>Stay updated</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Campus Overview</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summary.lost}</Text>
            <Text style={styles.summaryLabel}>Lost</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summary.found}</Text>
            <Text style={styles.summaryLabel}>Found</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summary.recovered}</Text>
            <Text style={styles.summaryLabel}>Recovered</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adama University Map</Text>
        <View style={styles.mapCard}>
          <Image source={adamaCampusGallery[1]} style={styles.mapPreviewImage} />
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayTitle}>Adama Science and Technology University</Text>
            <Text style={styles.mapOverlayMeta}>Lat {ADAMA_COORDINATE.latitude} | Lng {ADAMA_COORDINATE.longitude}</Text>
          </View>
        </View>
        <Pressable style={({ pressed }) => [styles.mapButton, pressed && styles.mapButtonPressed]} onPress={openAdamaMap}>
          <Text style={styles.mapButtonText}>Open in Google Maps</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adama Campus Gallery</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
          {adamaCampusGallery.map((image, index) => (
            <View style={styles.galleryCard} key={`gallery-${index}`}>
              <Image source={image} style={styles.galleryImage} />
              <Text style={styles.galleryText}>Adama Campus</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.feedTitle}>Latest Lost & Found Reports</Text>
      <Text style={styles.feedSubtitle}>Live feed from the campus community</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => navigation.navigate('ItemDetail', { item })} />
        )}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={init} />}
        ListEmptyComponent={(
          <EmptyState
            icon="🧺"
            title="No Reports Yet"
            message="Start by posting a lost or found item."
            actionLabel="Create First Report"
            onAction={() => (user ? navigation.navigate('Report') : requireLogin())}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4f7f8' },
  listContent: { paddingHorizontal: 12, paddingBottom: 24 },
  headerContainer: { paddingTop: 12 },
  hero: {
    height: 190,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0b2232',
  },
  heroImage: { opacity: 0.86 },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(12, 36, 46, 0.42)',
  },
  heroTitle: { color: '#f9feff', fontSize: 24, fontWeight: '900' },
  heroSubtitle: { color: '#d8edf2', marginTop: 4, fontSize: 14, fontWeight: '600' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  actionButton: {
    flexGrow: 1,
    minWidth: 105,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d5e4e8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  actionPressed: { opacity: 0.75 },
  actionTitle: { color: '#153742', fontWeight: '800', fontSize: 13 },
  actionMeta: { color: '#638088', marginTop: 3, fontSize: 12 },
  section: { marginTop: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#173944', marginBottom: 8 },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d4e4e8',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  summaryValue: { fontSize: 18, fontWeight: '800', color: '#164a55' },
  summaryLabel: { color: '#5f7a80', marginTop: 2, fontSize: 12 },
  mapCard: {
    borderWidth: 1,
    borderColor: '#d3e2e6',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  mapPreviewImage: {
    height: 180,
    width: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(10, 34, 44, 0.72)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  mapOverlayTitle: {
    color: '#f2fbff',
    fontWeight: '800',
    fontSize: 13,
  },
  mapOverlayMeta: {
    color: '#c8e7ef',
    marginTop: 2,
    fontSize: 12,
  },
  mapButton: {
    marginTop: 8,
    backgroundColor: '#0d6f7c',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  mapButtonPressed: { opacity: 0.8 },
  mapButtonText: { color: '#fff', fontWeight: '800' },
  galleryRow: { gap: 10 },
  galleryCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d8e5e8',
    overflow: 'hidden',
  },
  galleryImage: { width: '100%', height: 128 },
  galleryText: { color: '#32525a', fontWeight: '700', padding: 10 },
  feedTitle: { marginTop: 14, fontSize: 20, fontWeight: '900', color: '#13363d' },
  feedSubtitle: { color: '#5f7a80', marginTop: 2, marginBottom: 2 },
});

export default HomeScreen;
