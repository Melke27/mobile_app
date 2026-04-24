import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

      try {
        const found = await getMatchesFor(item);
        setMatches(found);
      } catch (error) {
        console.error(error);
      }
    };

    loadMatches();
  }, [getMatchesFor, item]);

  const onRecovered = async () => {
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
  const canChat = receiverId && receiverId !== user?._id;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
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
        />
        <Pressable style={[styles.button, styles.warn]} onPress={onFlag}>
          <Text style={styles.buttonText}>Flag Post</Text>
        </Pressable>

        {canChat && (
          <Pressable
            style={[styles.button, styles.chatButton]}
            onPress={() => navigation.navigate('Chat', { item, otherUserId: receiverId })}
          >
            <Text style={styles.buttonText}>Chat with Reporter</Text>
          </Pressable>
        )}

        <Text style={styles.sectionTitle}>Potential Matches</Text>
        {matches.length ? (
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
  buttonText: { color: '#fff', fontWeight: '700' },
  flagInput: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d2dde1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  sectionTitle: { marginTop: 20, fontSize: 18, fontWeight: '800', color: '#12343b', marginBottom: 8 },
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
