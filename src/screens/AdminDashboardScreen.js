import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';

const StatCard = ({ label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const AdminDashboardScreen = () => {
  const { isAdmin } = useAuth();
  const { getFlaggedReports, deleteReport, reviewFlaggedReport, getAdminStats } = useItems();

  const [flagged, setFlagged] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [flaggedData, statsData] = await Promise.all([getFlaggedReports({ limit: 100 }), getAdminStats()]);
      setFlagged(flaggedData.items || []);
      setStats(statsData.stats || null);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Could not load admin dashboard.');
    } finally {
      setLoading(false);
    }
  }, [getFlaggedReports, getAdminStats]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    try {
      await deleteReport(id);
      await load();
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Delete failed.');
    }
  };

  const review = async (id, action) => {
    try {
      await reviewFlaggedReport(id, action, action === 'clear' ? 'False alarm' : 'Keep flagged for investigation');
      await load();
    } catch (error) {
      Alert.alert('Review failed', error?.response?.data?.message || 'Could not review this report.');
    }
  };

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.root}>
        <EmptyState message="Admin access only." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Admin Moderation</Text>

      {stats && (
        <View style={styles.statsGrid}>
          <StatCard label="Users" value={stats.totalUsers} />
          <StatCard label="Reports" value={stats.totalReports} />
          <StatCard label="Lost" value={stats.lostReports} />
          <StatCard label="Found" value={stats.foundReports} />
          <StatCard label="Recovered" value={stats.recoveredReports} />
          <StatCard label="Flagged" value={stats.flaggedReports} />
        </View>
      )}

      <Text style={styles.sectionTitle}>Flagged Reports</Text>
      <FlatList
        data={flagged}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.meta}>Reason: {item.flagReason || 'No reason provided'}</Text>
            <Text style={styles.meta}>By: {item?.reportedBy?.name || 'Unknown'}</Text>

            <View style={styles.actions}>
              <Pressable style={[styles.actionButton, styles.keepButton]} onPress={() => review(item._id, 'keep')}>
                <Text style={styles.actionText}>Keep Flagged</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.clearButton]} onPress={() => review(item._id, 'clear')}>
                <Text style={styles.actionText}>Clear Flag</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={() => remove(item._id)}>
                <Text style={styles.actionText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState message="No flagged reports at this time." />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6fafb', padding: 14 },
  title: { fontSize: 20, fontWeight: '800', color: '#12343b', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1f4047', marginTop: 6, marginBottom: 8 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  statCard: {
    width: '31%',
    minWidth: 100,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d4e4e8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  statValue: { fontSize: 20, fontWeight: '800', color: '#164a55' },
  statLabel: { color: '#5b7a82', marginTop: 2, fontSize: 12 },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#edd3d3',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#451717' },
  meta: { color: '#6f4f4f', marginTop: 4 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  actionButton: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  keepButton: { backgroundColor: '#a65f2a' },
  clearButton: { backgroundColor: '#0f7a55' },
  deleteButton: { backgroundColor: '#b04b4b' },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});

export default AdminDashboardScreen;
