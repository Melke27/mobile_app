import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AppIcon from '../components/AppIcon';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';

const resolveId = (value) => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value._id || '';
};

const ChatScreen = ({ route }) => {
  const { item, otherUserId } = route.params;
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const pollingInFlightRef = useRef(false);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (silent && pollingInFlightRef.current) {
      return;
    }

    if (!silent) {
      setLoading(true);
    } else {
      pollingInFlightRef.current = true;
    }

    try {
      const data = await chatService.getConversation(item._id, otherUserId);
      setMessages(data.messages || []);
    } catch (error) {
      if (!silent) {
        Alert.alert('Chat error', error?.response?.data?.message || 'Could not load messages.');
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
      pollingInFlightRef.current = false;
    }
  }, [item._id, otherUserId]);

  useEffect(() => {
    load().catch(() => undefined);

    const timer = setInterval(() => {
      load({ silent: true }).catch(() => undefined);
    }, 8000);

    return () => clearInterval(timer);
  }, [load]);

  const send = async () => {
    const message = text.trim();
    if (!message || sending) {
      return;
    }

    setSending(true);
    try {
      await chatService.sendMessage({
        itemId: item._id,
        receiverId: otherUserId,
        message,
      });
      setText('');
      await load();
    } catch (error) {
      Alert.alert('Send failed', error?.response?.data?.message || 'Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.headerWrap}>
        <AppIcon name="chat-processing-outline" size={18} color="#1e434a" />
        <Text style={styles.header}>Chat about: {item.title || 'Item'}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(m) => m._id}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={7}
        contentContainerStyle={{ padding: 12 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item: message }) => {
          const mine = resolveId(message.senderId) === user._id;
          return (
            <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={[styles.message, mine && styles.myMessage]}>{message.message}</Text>
            </View>
          );
        }}
        ListEmptyComponent={(
          <View style={styles.emptyWrap}>
            <AppIcon name="message-text-outline" size={24} color="#6a7f86" />
            <Text style={styles.emptyText}>No messages yet. Start the conversation.</Text>
          </View>
        )}
      />

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Type message"
          placeholderTextColor="#6a7f86"
          value={text}
          onChangeText={setText}
          editable={!sending}
        />
        <Pressable style={[styles.send, sending && styles.sendDisabled]} onPress={send} disabled={sending}>
          {sending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <View style={styles.sendInner}>
              <AppIcon name="send-outline" size={14} color="#ffffff" />
              <Text style={styles.sendText}>Send</Text>
            </View>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6fafb' },
  headerWrap: { padding: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  header: { fontWeight: '700', color: '#1e434a' },
  bubble: {
    maxWidth: '82%',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  mine: { backgroundColor: '#0b7285', alignSelf: 'flex-end' },
  theirs: { backgroundColor: '#e2eef1', alignSelf: 'flex-start' },
  message: { color: '#172a2f' },
  myMessage: { color: '#fff' },
  emptyWrap: { alignItems: 'center', paddingTop: 28 },
  emptyText: { color: '#6a7f86', marginTop: 6, fontWeight: '600' },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#d4e0e4',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#c6d6db',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    color: '#12343b',
    backgroundColor: '#fff',
  },
  send: { backgroundColor: '#0b7285', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10 },
  sendDisabled: { backgroundColor: '#87aeb5' },
  sendInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sendText: { color: '#fff', fontWeight: '700' },
});

export default ChatScreen;
