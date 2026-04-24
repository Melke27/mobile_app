import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { itemService } from '../services/itemService';
import { resolveItemImageUrl } from '../utils/imageFallback';

const ItemDetailScreen = ({ route, navigation }) => {
  const initial = route.params?.item || {};
  const { user } = useAuth();
  const { markRecovered, flagReport, getMatchesFor } = useItems();

  const [item, setItem] = useState(initial);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(!initial?.title);
  const [flagReason, setFlagReason] = useState('Suspicious or spam report');

  useEffect(() => {
    const bootstrap = async () => {
      if (initial?.title) {
        return;
      }

      if (!initial?._id) {
        return;
      }

      setLoading(true);
      try {
        const data = await itemService.getById(initial._id);
        setItem(data.item || initial);
      } catch (error) {
        Alert.alert('Item', error?.response?.data?.message || 'Could not load item details.');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [initial]);

  useEffect(() => {
    const loadMatches = async () => {
      if (!item?._id) {
        return;
      }

      if (!user?._id) {
        setMatches([]);
        return;
      }

      try {
        const found = await getMatchesFor(item);
        setMatches(found);
      } catch (error) {
        console.error(error);
      }
    };

    loadMatches();
  }, [getMatchesFor, item, user?._id]);

  const openAccountTab = () => {
    navigation.navigate('GuestMain', { screen: 'Account' });
  };

  const onRecovered = async () => {
    if (!user?._id) {
      Alert.alert('Login required', 'Please sign in to update item status.');
      openAccountTab();
      return;
    }

    if (!item?._id) {
      return;
    }

    try {
      const data = await markRecovered(item._id);
      setItem(data.item || { ...item, status: 'recovered' });
      Alert.alert('Updated', 'Item marked as recovered.');
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Could not update status.');
    }
  };

  const onFlag = async () => {
    if (!user?._id) {
      Alert.alert('Login required', 'Please sign in to flag a report.');
      openAccountTab();
      return;
    }

    if (!item?._id) {
      return;
    }

    try {
      await flagReport(item._id, flagReason.trim() || 'Suspicious or spam report');
      Alert.alert('Reported', 'This post has been flagged for admin review.');
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Could not flag this post.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderWrap}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const receiverId = item?.reportedBy?._id;
  const isRecovered = item?.status === 'recovered';
  const canChat = Boolean(user?._id) && receiverId && receiverId !== user?._id;
  const isGuest = !user?._id;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: resolveItemImageUrl(item) }} style={styles.itemImage} resizeMode="cover" />
        <Text style={styles.title}>{item.title || 'Item Details'}</Text>
        <Text style={styles.badge}>{(item.status || 'unknown').toUpperCase()}</Text>
        <Text style={styles.info}>{item.description || 'No description'}</Text>
        <Text style={styles.info}>Category: {item.category || 'N/A'}</Text>
        <Text style={styles.info}>Campus: {item.campus || 'N/A'}</Text>
        <Text style={styles.info}>Location: {item.locationText || 'Not provided'}</Text>
        <Text style={styles.info}>Reported by: {item?.reportedBy?.name || 'Unknown'}</Text>
        {item?.createdAt && (
          <Text style={styles.info}>Reported at: {new Date(item.createdAt).toLocaleString()}</Text>
        )}

        {isGuest ? (
          <View style={styles.guestCard}>
            <Text style={styles.guestTitle}>Sign in for full actions</Text>
            <Text style={styles.guestMeta}>Login to report, flag, recover items, and chat with reporters.</Text>
            <Pressable style={[styles.button, styles.authButton]} onPress={openAccountTab}>
              <Text style={styles.buttonText}>Go to Login</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.row}>
              <Pressable
                style={[styles.button, isRecovered && styles.disabledButton]}
                onPress={onRecovered}
                disabled={isRecovered}
              >
                <Text style={styles.buttonText}>{isRecovered ? 'Already Recovered' : 'Mark Recovered'}</Text>
              </Pressable>
            </View>

            <TextInput
              style={styles.flagInput}
              value={flagReason}
              onChangeText={setFlagReason}
              placeholder="Reason for flagging"
              placeholderTextColor="#6a7f86"
            />
            <Pressable style={[styles.button, styles.warn]} onPress={onFlag}>
              <Text style={styles.buttonText}>Flag Post</Text>
            </Pressable>
          </>
        )}

        {canChat && (
          <Pressable
            style={[styles.button, styles.chatButton]}
            onPress={() => navigation.navigate('Chat', { item, otherUserId: receiverId })}
          >
            <Text style={styles.buttonText}>Chat with Reporter</Text>
          </Pressable>
        )}

        <Text style={styles.sectionTitle}>Potential Matches</Text>
        {isGuest ? (
          <Text style={styles.matchMeta}>Login to see personalized match scoring.</Text>
        ) : matches.length ? (
          matches.slice(0, 5).map((entry, idx) => {
            const candidate = entry.item || entry;
            const score = entry.score;
            return (
              <View style={styles.matchCard} key={candidate._id || idx}>
                <Text style={styles.matchTitle}>{candidate.title}</Text>
                <Text style={styles.matchMeta}>Status: {candidate.status}</Text>
                {typeof score === 'number' && (
                  <Text style={styles.matchMeta}>Confidence: {Math.round(score * 100)}%</Text>
                )}
              </View>
            );
          })
        ) : (
          <Text style={styles.matchMeta}>No strong matches found yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6fafb' },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 14, paddingBottom: 24 },
  itemImage: {
    width: '100%',
    height: 210,
    borderRadius: 12,
    backgroundColor: '#dfecef',
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#12343b' },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#d9eef2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontWeight: '700',
    color: '#145866',
  },
  info: { marginTop: 8, color: '#33474c', lineHeight: 20 },
  row: { flexDirection: 'row', gap: 8, marginTop: 16 },
  button: {
    backgroundColor: '#0b7285',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#8ea8ae' },
  warn: { backgroundColor: '#b04b4b', marginTop: 8 },
  chatButton: { marginTop: 10, backgroundColor: '#1d7e3f' },
  authButton: { marginTop: 10, backgroundColor: '#0b7285' },
  buttonText: { color: '#fff', fontWeight: '700' },
  flagInput: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d2dde1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#12343b',
  },
  sectionTitle: { marginTop: 20, fontSize: 18, fontWeight: '800', color: '#12343b', marginBottom: 8 },
  guestCard: {
    marginTop: 16,
    backgroundColor: '#eef7f9',
    borderWidth: 1,
    borderColor: '#c8dfe5',
    borderRadius: 10,
    padding: 12,
  },
  guestTitle: { fontWeight: '800', color: '#15424c', fontSize: 15 },
  guestMeta: { marginTop: 5, color: '#4a6d75' },
  matchCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d8e4e7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  matchTitle: { fontWeight: '700', color: '#1d3438' },
  matchMeta: { color: '#57777f', marginTop: 2 },
});

export default ItemDetailScreen;
