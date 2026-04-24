import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { resolveItemImageUrl } from '../utils/imageFallback';

const ItemCard = ({ item, onPress }) => {
  const statusStyle =
    item.status === 'lost' ? styles.lost : item.status === 'recovered' ? styles.recovered : styles.found;
  const imageSource = { uri: resolveItemImageUrl(item) };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={4}
      android_ripple={{ color: '#d8e8ed' }}
    >
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.badge, statusStyle]}>{item.status}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.meta}>{item.category} | {item.campus}</Text>
      <Text style={styles.meta}>{item.locationText || 'No location text'}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#dbe7ea',
  },
  image: {
    width: '100%',
    height: 128,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#dfecef',
  },
  cardPressed: {
    opacity: 0.84,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  title: { flex: 1, fontSize: 16, fontWeight: '800', color: '#1e1e1e', paddingRight: 8 },
  badge: {
    textTransform: 'uppercase',
    fontSize: 11,
    fontWeight: '700',
    minWidth: 74,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  lost: { backgroundColor: '#ffd9d9', color: '#8a1f1f' },
  found: { backgroundColor: '#d8f8dc', color: '#156e22' },
  recovered: { backgroundColor: '#e8ebf8', color: '#2b3c78' },
  description: { color: '#444', marginBottom: 8 },
  meta: { color: '#777', fontSize: 12 },
});

export default ItemCard;
