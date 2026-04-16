import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { getMessages, markMessagesAsRead, sendMessage, subscribeToMessages } from '../services/api';

const MessageBubble = ({ message, currentUserId }) => {
  const isMe = message.sender_id === currentUserId;
  const time = message.created_at
    ? new Date(message.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : '';
  return (
    <View style={[styles.messageBubbleContainer, isMe && styles.messageBubbleContainerMe]}>
      <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
        <Text style={[styles.messageText, isMe && styles.messageTextMe]}>{message.text}</Text>
        <Text style={[styles.messageTime, isMe && styles.messageTimeMe]}>{time}</Text>
      </View>
    </View>
  );
};

export const ChatScreen = ({ route, navigation }) => {
  const { conversation } = route.params || {};
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!conversation?.id) return;
    try {
      const data = await getMessages(conversation.id);
      setMessages(data);
      if (user) await markMessagesAsRead(conversation.id, user.id);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [conversation?.id, user]);

  useEffect(() => {
    fetchMessages();
    const channel = subscribeToMessages(conversation?.id, (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
    });
    return () => { channel.unsubscribe(); };
  }, [fetchMessages, conversation?.id]);

  const handleSend = async () => {
    if (!message.trim() || !user || !conversation?.id) return;
    const text = message.trim();
    setMessage('');
    try {
      const newMsg = await sendMessage({ conversationId: conversation.id, senderId: user.id, text });
      setMessages(prev => [...prev, newMsg]);
    } catch {
      Alert.alert('Erreur', "Le message n'a pas pu être envoyé.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Image source={{ uri: conversation?.image }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{conversation?.name || 'Chat'}</Text>
        </View>
        <TouchableOpacity style={styles.headerAction} onPress={() => Alert.alert('Options', 'Que souhaitez-vous faire ?', [{ text: 'Signaler', style: 'destructive' }, { text: 'Annuler', style: 'cancel' }])}>
          <MaterialIcons name="more-vert" size={24} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} currentUserId={user?.id} />}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Écrire un message..."
            placeholderTextColor={Colors.onSurfaceVariant}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <MaterialIcons name="send" size={20} color={message.trim() ? Colors.onPrimary : Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
    backgroundColor: Colors.surface,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  headerStatus: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  headerAction: {
    padding: 4,
  },
  contextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.secondaryFixed,
  },
  contextText: {
    fontSize: 13,
    color: Colors.onSecondaryFixed,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  messageBubbleContainerMe: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  messageBubbleMe: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  messageTextMe: {
    color: Colors.onPrimary,
  },
  messageTime: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
    backgroundColor: Colors.surface,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.onSurface,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
});

export default ChatScreen;
