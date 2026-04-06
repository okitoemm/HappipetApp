import { useState } from 'react';
import {
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
import { mockConversations } from '../constants/mockData';

const StoriesList = () => {
  const stories = mockConversations.slice(0, 4);

  return (
    <View style={styles.storiesContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.storiesScroll}
      >
        {stories.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem}>
            <View style={styles.storyRing}>
              <Image
                source={{ uri: story.image }}
                style={styles.storyImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.storyName} numberOfLines={1}>
              {story.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

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
  const [activeFilter, setActiveFilter] = useState('Tout');

  const handleConversationPress = (conversation) => {
    navigation.navigate('Chat', { conversation });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Messages" showNotification={false} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stories */}
        <StoriesList />

        {/* Filter Tabs */}
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Conversations List */}
        <View style={styles.conversationsContainer}>
          {mockConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onPress={() => handleConversationPress(conversation)}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
});

export default MessagesScreen;
