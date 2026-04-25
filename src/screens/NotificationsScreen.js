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
import AppIcon from '../components/AppIcon';
import { notificationService } from '../services/notificationService';

const NotificationCard = ({ item, onPress }) => {
  const unread = !item.readAt;

  return (
    <Pressable style={[styles.card, unread && styles.unreadCard]} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <AppIcon name={unread ? 'bell-alert-outline' : 'bell-check-outline'} size={14} color={unread ? '#0b7285' : '#5f7a80'} />
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        {unread && <Text style={styles.unreadBadge}>NEW</Text>}
      </View>
      <Text style={styles.cardBody}>{item.body}</Text>
      <View style={styles.metaRow}>
        <AppIcon name="clock-time-four-outline" size={12} color="#789097" />
        <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
    </Pressable>
  );
};

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationService.getMyNotifications({ limit: 50 });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      Alert.alert('Notifications', error?.response?.data?.message || 'Could not load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNotification = async (notification) => {
    try {
      if (!notification.readAt) {
        await notificationService.markRead(notification._id);
      }

      await load();

      if (notification?.meta?.itemId) {
        navigation.navigate('ItemDetail', { item: { _id: notification.meta.itemId } });
      }
    } catch (error) {
      Alert.alert('Notifications', error?.response?.data?.message || 'Could not open notification.');
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      await load();
    } catch (error) {
      Alert.alert('Notifications', error?.response?.data?.message || 'Could not update notifications.');
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <AppIcon name="bell-badge-outline" size={20} color="#12343b" />
            <Text style={styles.title}>Alerts</Text>
          </View>
          <View style={styles.subtitleRow}>
            <AppIcon name="bell-ring-outline" size={16} color="#5f7a80" />
            <Text style={styles.subtitle}>{unreadCount} unread notification(s)</Text>
          </View>
        </View>
        <Pressable style={styles.markButton} onPress={markAllRead}>
          <View style={styles.markButtonInner}>
            <AppIcon name="email-check-outline" size={13} color="#ffffff" />
            <Text style={styles.markButtonText}>Mark all read</Text>
          </View>
        </Pressable>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        renderItem={({ item }) => <NotificationCard item={item} onPress={() => openNotification(item)} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={
          <EmptyState
            iconName="email-outline"
            title="No Alerts Yet"
            message="Match and chat notifications will appear here."
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6fafb' },
  header: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  title: { fontSize: 22, fontWeight: '800', color: '#12343b' },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  subtitle: { color: '#5f7a80' },
  markButton: {
    backgroundColor: '#0b7285',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  markButtonInner: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  markButtonText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d8e4e7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  unreadCard: {
    borderColor: '#86b8c2',
    backgroundColor: '#f1fbfd',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 8 },
  cardTitle: { fontWeight: '700', color: '#1d3438', flexShrink: 1, paddingRight: 8 },
  unreadBadge: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#0b7285',
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  cardBody: { color: '#4f666b', marginTop: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  meta: { color: '#789097', fontSize: 12 },
});

export default NotificationsScreen;
