import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConversationItem, Header } from '../components';
import Colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { getMyConversations } from '../services/api';

// Helper: get the other participant relative to current user
const getOther = (conv, userId) => {
  if (conv.participant_1 === userId) return conv.participant_2_profile;
  return conv.participant_1_profile;
};

// Normalize a Supabase conversation to the shape ConversationItem expects
const normalizeConv = (conv, userId) => {
  const other = getOther(conv, userId) || {};
  const timestamp = conv.last_message_at
    ? new Date(conv.last_message_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : '';
  return {
    ...conv,
    image: other.avatar_url,
    name: other.full_name || 'Inconnu',
    context: '',
    timestamp,
    lastMessage: conv.last_message || '',
    unread: false,
    unreadCount: 0,
    otherUserId: other.id,
  };
};

const StoriesList = ({ stories, onStoryPress }) => (
  <View style={styles.storiesContainer}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
      {stories.map((story) => (
        <TouchableOpacity key={story.id} style={styles.storyItem} onPress={() => onStoryPress(story)}>
          <View style={[styles.storyRing, !story.unread && styles.storyRingSeen]}>
            <Image source={{ uri: story.image }} style={styles.storyImage} resizeMode="cover" />
          </View>
          <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = ['Tout', 'Non lus', 'Archivés'];

  return (
    <View style={styles.filterTabs}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
          onPress={() => onFilterChange(filter)}
        >
          <Text style={[styles.filterTabText, activeFilter === filter && styles.filterTabTextActive]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const MessagesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('Tout');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getMyConversations(user.id);
      setConversations(data.map(c => normalizeConv(c, user.id)));
    } catch {
      // silent fail — show empty state
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const handleConversationPress = (conversation) => {
    navigation.navigate('Chat', { conversation });
  };

  const filteredConversations = conversations.filter((c) => {
    if (activeFilter === 'Non lus') return c.unread;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Messages" showNotification={false} />
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stories */}
          {conversations.length > 0 && (
            <StoriesList
              stories={conversations.slice(0, 5)}
              onStoryPress={handleConversationPress}
            />
          )}

          {/* Filter Tabs */}
          <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          {/* Conversations List */}
          <View style={styles.conversationsContainer}>
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  onPress={() => handleConversationPress(conversation)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Aucune conversation</Text>
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  storiesContainer: {
    marginVertical: 16,
  },
  storiesScroll: {
    paddingHorizontal: 4,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 2,
    marginBottom: 8,
  },
  storyRingSeen: {
    borderColor: Colors.outlineVariant,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  storyName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    width: 64,
    textAlign: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 20,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  filterTabTextActive: {
    color: Colors.onPrimary,
    fontWeight: '700',
  },
  conversationsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
});

export default MessagesScreen;
