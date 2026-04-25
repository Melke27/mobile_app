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
import AppIcon from '../components/AppIcon';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';

const StatCard = ({ label, value, iconName }) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <AppIcon name={iconName} size={16} color="#2d6270" />
      <Text style={styles.statValue}>{value}</Text>
    </View>
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
        <EmptyState
          iconName="shield-lock-outline"
          title="Restricted Area"
          message="Admin access only."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.titleRow}>
        <AppIcon name="shield-account-outline" size={22} color="#12343b" />
        <Text style={styles.title}>Admin Moderation</Text>
      </View>

      {stats && (
        <View style={styles.statsGrid}>
          <StatCard label="Users" value={stats.totalUsers} iconName="account-group-outline" />
          <StatCard label="Reports" value={stats.totalReports} iconName="file-document-multiple-outline" />
          <StatCard label="Lost" value={stats.lostReports} iconName="help-circle-outline" />
          <StatCard label="Found" value={stats.foundReports} iconName="hand-coin-outline" />
          <StatCard label="Recovered" value={stats.recoveredReports} iconName="check-circle-outline" />
          <StatCard label="Flagged" value={stats.flaggedReports} iconName="alert-outline" />
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
            <Text style={styles.meta}><AppIcon name="alert-circle-outline" size={13} color="#6f4f4f" /> Reason: {item.flagReason || 'No reason provided'}</Text>
            <Text style={styles.meta}><AppIcon name="account-outline" size={13} color="#6f4f4f" /> By: {item?.reportedBy?.name || 'Unknown'}</Text>

            <View style={styles.actions}>
              <Pressable style={[styles.actionButton, styles.keepButton]} onPress={() => review(item._id, 'keep')}>
                <View style={styles.actionInner}>
                  <AppIcon name="alert-decagram-outline" size={13} color="#ffffff" />
                  <Text style={styles.actionText}>Keep Flagged</Text>
                </View>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.clearButton]} onPress={() => review(item._id, 'clear')}>
                <View style={styles.actionInner}>
                  <AppIcon name="check-circle-outline" size={13} color="#ffffff" />
                  <Text style={styles.actionText}>Clear Flag</Text>
                </View>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={() => remove(item._id)}>
                <View style={styles.actionInner}>
                  <AppIcon name="delete-outline" size={13} color="#ffffff" />
                  <Text style={styles.actionText}>Delete</Text>
                </View>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState iconName="shield-check-outline" message="No flagged reports at this time." />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6fafb', padding: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: '800', color: '#12343b' },
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
  statHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  actionInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  keepButton: { backgroundColor: '#a65f2a' },
  clearButton: { backgroundColor: '#0f7a55' },
  deleteButton: { backgroundColor: '#b04b4b' },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});

export default AdminDashboardScreen;
