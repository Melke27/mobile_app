import React from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';
import { useItems } from '../context/ItemsContext';

const SavedItemsScreen = ({ navigation }) => {
  const { savedItems, clearSavedItems } = useItems();

  const onClearAll = async () => {
    if (!savedItems.length) {
      return;
    }

    Alert.alert('Clear saved items', 'Remove all saved items from this device?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearSavedItems().catch(() => undefined);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Saved Reports</Text>
          <Text style={styles.subtitle}>⭐ {savedItems.length} saved item(s)</Text>
        </View>
        <Pressable style={styles.clearButton} onPress={onClearAll}>
          <Text style={styles.clearText}>Clear All</Text>
        </Pressable>
      </View>

      <FlatList
        data={savedItems}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => navigation.navigate('ItemDetail', { item })} />
        )}
        ListEmptyComponent={(
          <EmptyState
            icon="⭐"
            title="No Saved Items"
            message="Save reports from item details to quickly access them here."
            actionLabel="Browse Reports"
            onAction={() => navigation.navigate('Home')}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6fafb' },
  header: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#12343b' },
  subtitle: { color: '#5f7a80', marginTop: 2 },
  clearButton: {
    borderWidth: 1,
    borderColor: '#d7a6a6',
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  clearText: { color: '#9f3333', fontWeight: '700', fontSize: 12 },
  listContent: { paddingHorizontal: 12, paddingBottom: 24 },
});

export default SavedItemsScreen;
