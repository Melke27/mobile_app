import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import { itemService } from '../services/itemService';
import AppIcon from '../components/AppIcon';
import { generateItemImageUrl, resolveItemImageUrl } from '../utils/imageFallback';

const ActionButton = ({
  label,
  iconName,
  onPress,
  style,
  disabled = false,
}) => (
  <Pressable
    style={[styles.button, style, disabled && styles.disabledButton]}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.buttonInner}>
      <AppIcon name={iconName} size={15} color="#ffffff" />
      <Text style={styles.buttonText}>{label}</Text>
    </View>
  </Pressable>
);

const ItemDetailScreen = ({ route, navigation }) => {
  const initial = route.params?.item || {};
  const { user } = useAuth();
  const { markRecovered, flagReport, getMatchesFor, toggleSavedItem, isItemSaved } = useItems();

  const [item, setItem] = useState(initial);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(!initial?.title);
  const [flagReason, setFlagReason] = useState('Suspicious or spam report');
  const [failedPrimaryImage, setFailedPrimaryImage] = useState(false);

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
    if (navigation.getState()?.routeNames?.includes('Login')) {
      navigation.navigate('Login');
      return;
    }
    navigation.goBack();
  };

  const imageSource = useMemo(() => {
    const url = failedPrimaryImage ? generateItemImageUrl(item) : resolveItemImageUrl(item);
    return { uri: url };
  }, [failedPrimaryImage, item]);

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

  const onToggleSaved = async () => {
    if (!item?._id) {
      return;
    }
    try {
      const nowSaved = await toggleSavedItem(item);
      Alert.alert(nowSaved ? 'Saved' : 'Removed', nowSaved ? 'Item saved to your device.' : 'Item removed from saved list.');
    } catch (_error) {
      Alert.alert('Save failed', 'Could not update saved items.');
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `${item.title || 'Lost/Found Item'}\n${item.description || ''}\nCampus: ${item.campus || 'N/A'}\nLocation: ${item.locationText || 'N/A'}`,
        title: item.title || 'Lost/Found Item',
      });
    } catch (_error) {
      Alert.alert('Share failed', 'Could not share this item right now.');
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
  const saved = isItemSaved(item?._id);
  const statusIconName =
    item.status === 'lost'
      ? 'compass-outline'
      : item.status === 'recovered'
        ? 'check-circle-outline'
        : 'package-variant-closed';

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={imageSource}
          style={styles.itemImage}
          resizeMode="cover"
          onError={() => setFailedPrimaryImage(true)}
        />
        <Text style={styles.title}>{item.title || 'Item Details'}</Text>
        <Text style={styles.badge}>
          <AppIcon name={statusIconName} size={14} color="#145866" /> {(item.status || 'unknown').toUpperCase()}
        </Text>
        <Text style={styles.info}>{item.description || 'No description'}</Text>
        <Text style={styles.info}><AppIcon name="tag-outline" size={14} color="#33474c" /> Category: {item.category || 'N/A'}</Text>
        <Text style={styles.info}><AppIcon name="school-outline" size={14} color="#33474c" /> Campus: {item.campus || 'N/A'}</Text>
        <Text style={styles.info}><AppIcon name="map-marker-outline" size={14} color="#33474c" /> Location: {item.locationText || 'Not provided'}</Text>
        <Text style={styles.info}><AppIcon name="account-outline" size={14} color="#33474c" /> Reported by: {item?.reportedBy?.name || 'Unknown'}</Text>
        {item?.createdAt && (
          <Text style={styles.info}><AppIcon name="clock-time-four-outline" size={14} color="#33474c" /> Reported at: {new Date(item.createdAt).toLocaleString()}</Text>
        )}

        {isGuest ? (
          <View style={styles.guestCard}>
            <View style={styles.guestTitleRow}>
              <AppIcon name="shield-account-outline" size={16} color="#15424c" />
              <Text style={styles.guestTitle}>Sign in for full actions</Text>
            </View>
            <Text style={styles.guestMeta}>Login to report, flag, recover items, and chat with reporters.</Text>
            <ActionButton label="Go to Login" iconName="login" style={styles.authButton} onPress={openAccountTab} />
          </View>
        ) : (
          <>
            <View style={styles.row}>
              <ActionButton
                label={isRecovered ? 'Already Recovered' : 'Mark Recovered'}
                iconName={isRecovered ? 'check-circle-outline' : 'clipboard-check-outline'}
                style={styles.recoverButton}
                onPress={onRecovered}
                disabled={isRecovered}
              />
            </View>

            <TextInput
              style={styles.flagInput}
              value={flagReason}
              onChangeText={setFlagReason}
              placeholder="Reason for flagging"
              placeholderTextColor="#6a7f86"
            />
            <ActionButton label="Flag Post" iconName="flag-outline" style={styles.warn} onPress={onFlag} />
          </>
        )}

        {canChat && (
          <ActionButton
            label="Chat with Reporter"
            iconName="chat-processing-outline"
            style={styles.chatButton}
            onPress={() => navigation.navigate('Chat', { item, otherUserId: receiverId })}
          />
        )}

        <View style={styles.row}>
          <ActionButton
            label={saved ? 'Remove from Saved' : 'Save Item'}
            iconName={saved ? 'bookmark-remove-outline' : 'bookmark-plus-outline'}
            style={styles.saveButton}
            onPress={onToggleSaved}
          />
        </View>
        <View style={styles.row}>
          <ActionButton label="Share Item" iconName="share-variant-outline" style={styles.shareButton} onPress={onShare} />
        </View>

        <View style={styles.sectionTitleRow}>
          <AppIcon name="target-account" size={18} color="#12343b" />
          <Text style={styles.sectionTitle}>Potential Matches</Text>
        </View>
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
    justifyContent: 'center',
    minHeight: 42,
    flex: 1,
  },
  buttonInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  disabledButton: { backgroundColor: '#8ea8ae' },
  recoverButton: { backgroundColor: '#0b7285' },
  warn: { backgroundColor: '#b04b4b', marginTop: 8 },
  chatButton: { marginTop: 10, backgroundColor: '#1d7e3f' },
  authButton: { marginTop: 10, backgroundColor: '#0b7285' },
  saveButton: { marginTop: 10, backgroundColor: '#b57e14' },
  shareButton: { marginTop: 10, backgroundColor: '#3457a8' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
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
  sectionTitleRow: { marginTop: 20, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#12343b' },
  guestCard: {
    marginTop: 16,
    backgroundColor: '#eef7f9',
    borderWidth: 1,
    borderColor: '#c8dfe5',
    borderRadius: 10,
    padding: 12,
  },
  guestTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
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
