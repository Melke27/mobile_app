import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const StatusButton = ({ value, current, onSelect }) => {
  const active = value === current;
  return (
    <Pressable
      style={[styles.statusButton, active && styles.statusButtonActive]}
      onPress={() => onSelect(active ? '' : value)}
    >
      <Text style={[styles.statusButtonText, active && styles.statusButtonTextActive]}>{value}</Text>
    </Pressable>
  );
};

const FilterBar = ({ filters, onChange, onSearch, onReset }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search title, description, or location"
        placeholderTextColor="#6a7f86"
        value={filters.keyword}
        onChangeText={(text) => onChange({ ...filters, keyword: text })}
      />

      <View style={styles.twoColRow}>
        <TextInput
          style={[styles.input, styles.twoColInput]}
          placeholder="Category"
          placeholderTextColor="#6a7f86"
          value={filters.category}
          onChangeText={(text) => onChange({ ...filters, category: text })}
        />
        <TextInput
          style={[styles.input, styles.twoColInput]}
          placeholder="Campus"
          placeholderTextColor="#6a7f86"
          value={filters.campus}
          onChangeText={(text) => onChange({ ...filters, campus: text })}
        />
      </View>

      <View style={styles.row}>
        <StatusButton value="lost" current={filters.status} onSelect={(status) => onChange({ ...filters, status })} />
        <StatusButton
          value="found"
          current={filters.status}
          onSelect={(status) => onChange({ ...filters, status })}
        />
        <Pressable style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>
        <Pressable style={styles.searchButton} onPress={onSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
    color: '#12343b',
  },
  twoColRow: { flexDirection: 'row', gap: 8 },
  twoColInput: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  statusButton: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    minWidth: 72,
    alignItems: 'center',
  },
  statusButtonActive: { backgroundColor: '#0b7285', borderColor: '#0b7285' },
  statusButtonText: { textTransform: 'uppercase', color: '#333', fontWeight: '600' },
  statusButtonTextActive: { color: '#fff' },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#dfe9ec',
  },
  resetButtonText: { color: '#34545c', fontWeight: '700' },
  searchButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#0b7285',
  },
  searchButtonText: { color: '#fff', fontWeight: '700' },
});

export default FilterBar;
