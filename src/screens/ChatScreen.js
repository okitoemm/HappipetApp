import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
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

const mockMessages = [
  { id: '1', text: 'Bonjour ! Je serais intéressé pour faire garder mon chien ce weekend.', sender: 'me', time: '14:00' },
  { id: '2', text: 'Bonjour ! Bien sûr, je suis disponible samedi et dimanche. Quel type de chien avez-vous ?', sender: 'other', time: '14:05' },
  { id: '3', text: 'C\'est un Golden Retriever de 3 ans, très sociable !', sender: 'me', time: '14:08' },
  { id: '4', text: 'Parfait, j\'adore les Goldens ! J\'ai un grand jardin clos, il sera très bien ici 🐕', sender: 'other', time: '14:10' },
  { id: '5', text: 'Super ! Quels sont vos tarifs pour 2 jours ?', sender: 'me', time: '14:12' },
  { id: '6', text: 'Je propose 25€/jour, soit 50€ pour le weekend. Ça inclut les promenades et les repas.', sender: 'other', time: '14:15' },
  { id: '7', text: 'C\'est parfait. Je peux déposer Rex samedi matin vers 9h ?', sender: 'me', time: '14:18' },
  { id: '8', text: 'Oui sans problème ! Je vous envoie mon adresse. À samedi alors 😊', sender: 'other', time: '14:20' },
];

const MessageBubble = ({ message }) => {
  const isMe = message.sender === 'me';
  return (
    <View style={[styles.messageBubbleContainer, isMe && styles.messageBubbleContainerMe]}>
      <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
        <Text style={[styles.messageText, isMe && styles.messageTextMe]}>{message.text}</Text>
        <Text style={[styles.messageTime, isMe && styles.messageTimeMe]}>{message.time}</Text>
      </View>
    </View>
  );
};

export const ChatScreen = ({ route, navigation }) => {
  const { conversation } = route.params || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = () => {
    if (message.trim()) {
      const newMsg = {
        id: String(messages.length + 1),
        text: message.trim(),
        sender: 'me',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
      setMessage('');
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
          <Text style={styles.headerStatus}>
            {conversation?.online ? 'En ligne' : 'Hors ligne'}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <MaterialIcons name="more-vert" size={24} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Context Banner */}
      {conversation?.context && (
        <View style={styles.contextBanner}>
          <MaterialIcons name="info-outline" size={16} color={Colors.secondary} />
          <Text style={styles.contextText}>{conversation.context}</Text>
        </View>
      )}

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <MaterialIcons name="add" size={24} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
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
