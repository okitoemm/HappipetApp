import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export const ConversationItem = ({ conversation, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: conversation.image }}
          style={styles.avatar}
          resizeMode="cover"
        />
        {conversation.online && (
          <View style={styles.onlineIndicator} />
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{conversation.name}</Text>
            <Text style={styles.context}>({conversation.context})</Text>
          </View>
          <Text style={styles.timestamp}>{conversation.timestamp}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.message,
              conversation.unread && styles.unreadMessage,
            ]}
          >
            {conversation.lastMessage}
          </Text>
          {conversation.unreadCount ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
            </View>
          ) : conversation.unread ? (
            <View style={styles.unreadIndicator} />
          ) : (
            <MaterialIcons
              name="done_all"
              size={14}
              color={Colors.secondary}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatarContainer: {
    position: 'relative',
    width: 56,
    height: 56,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  contentContainer: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  context: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  message: {
    flex: 1,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  unreadMessage: {
    fontWeight: '600',
    color: Colors.onSurface,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: Colors.onPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});

export default ConversationItem;
