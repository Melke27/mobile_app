import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';
import { useItems } from '../context/ItemsContext';
import { DEFAULT_CAMPUS } from '../config/env';

const defaultFilters = { keyword: '', status: '', campus: DEFAULT_CAMPUS, category: '' };

const SearchScreen = ({ navigation }) => {
  const { searchReports } = useItems();

  const [filters, setFilters] = useState(defaultFilters);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback(
    async (currentFilters) => {
      setLoading(true);
      try {
        const found = await searchReports(currentFilters);
        setResults(found);
      } catch (error) {
        Alert.alert('Search failed', error?.response?.data?.message || 'Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [searchReports]
  );

  useEffect(() => {
    runSearch(defaultFilters);
  }, [runSearch]);

  const onSearch = () => runSearch(filters);

  const onReset = () => {
    setFilters(defaultFilters);
    runSearch(defaultFilters);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.title}>Search Items</Text>
        <Text style={styles.subtitle}>{results.length} results</Text>
        <FilterBar filters={filters} onChange={setFilters} onSearch={onSearch} onReset={onReset} />

        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <ItemCard item={item} onPress={() => navigation.navigate('ItemDetail', { item })} />
          )}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          ListEmptyComponent={<EmptyState message="No results yet. Try changing filters." />}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onSearch} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6fafb' },
  content: { flex: 1, padding: 14 },
  title: { fontSize: 20, fontWeight: '800', color: '#12343b' },
  subtitle: { color: '#5d7a80', marginBottom: 10, marginTop: 2 },
});

export default SearchScreen;
