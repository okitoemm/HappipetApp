import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components';
import Colors from '../constants/colors';
import { mockDogSitters, mockFeedPosts } from '../constants/mockData';

const { width } = Dimensions.get('window');

const FeedPost = ({ post, onLike, onProfilePress }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <View style={styles.postCard}>
      {/* Post Header */}
      <TouchableOpacity
        style={styles.postHeader}
        onPress={() => onProfilePress(post)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
        <View style={styles.authorInfo}>
          <View style={styles.authorNameRow}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            {post.author.certified && (
              <MaterialIcons name="verified" size={14} color={Colors.secondary} />
            )}
            {post.author.topSitter && (
              <View style={styles.topBadge}>
                <Text style={styles.topBadgeText}>TOP</Text>
              </View>
            )}
          </View>
          <Text style={styles.postTime}>
            {post.author.role === 'sitter' ? '🐕 Gardien' : '👤 Propriétaire'} · {post.timeAgo}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-horiz" size={20} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Post Image */}
      <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />

      {/* Actions */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <MaterialIcons
              name={liked ? 'favorite' : 'favorite-border'}
              size={24}
              color={liked ? Colors.error : Colors.onSurface}
            />
          </TouchableOpacity>
          <Text style={styles.likesCount}>{likesCount}</Text>
        </View>
        {post.author.role === 'sitter' && post.sitterId && (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => onProfilePress(post)}
          >
            <Text style={styles.bookButtonText}>Voir le profil</Text>
            <MaterialIcons name="arrow-forward" size={14} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.captionText}>
          <Text style={styles.captionAuthor}>{post.author.name} </Text>
          {post.caption}
        </Text>
      </View>

      {/* Animal Tag */}
      <View style={styles.animalTag}>
        <MaterialIcons name="pets" size={12} color={Colors.secondary} />
        <Text style={styles.animalTagText}>
          {post.animal.name} · {post.animal.breed}
        </Text>
      </View>
    </View>
  );
};

export const HomeScreen = ({ navigation }) => {
  const handleProfilePress = (post) => {
    if (post.sitterId) {
      const sitter = mockDogSitters.find(s => s.id === post.sitterId);
      if (sitter) {
        navigation.navigate('Profile', { sitter });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onNotificationPress={() => navigation.navigate('Notifications')} />
      <FlatList
        data={mockFeedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FeedPost
            post={item}
            onProfilePress={handleProfilePress}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  feedList: {
    paddingTop: 4,
  },
  separator: {
    height: 8,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  postCard: {
    backgroundColor: Colors.surfaceContainerLowest,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primaryContainer,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 10,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  topBadge: {
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  topBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.onTertiary,
    letterSpacing: 0.5,
  },
  postTime: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  postImage: {
    width: width,
    height: width,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  postActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButton: {
    padding: 2,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  bookButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  captionContainer: {
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  captionText: {
    fontSize: 13,
    color: Colors.onSurface,
    lineHeight: 19,
  },
  captionAuthor: {
    fontWeight: '700',
  },
  animalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  animalTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
  },
});

export default HomeScreen;
