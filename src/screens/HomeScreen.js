import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
import { useAuth } from '../contexts/AuthContext';
import { getFeedPosts, toggleLike } from '../services/api';

const { width } = Dimensions.get('window');

const FeedPost = ({ post, onLike, onProfilePress }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    try {
      await onLike(post.id);
    } catch {
      // rollback on error
      setLiked(!newLiked);
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
    }
  };

  const author = post.user || {};
  const isVerified = false; // à relier au sitter_profile si needed
  const timeAgo = post.created_at
    ? new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    : '';

  return (
    <View style={styles.postCard}>
      {/* Post Header */}
      <TouchableOpacity
        style={styles.postHeader}
        onPress={() => onProfilePress(post)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: author.avatar_url }} style={styles.authorAvatar} />
        <View style={styles.authorInfo}>
          <View style={styles.authorNameRow}>
            <Text style={styles.authorName}>{author.full_name}</Text>
          </View>
          <Text style={styles.postTime}>{timeAgo}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-horiz" size={20} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Post Image */}
      <Image source={{ uri: post.image_url }} style={styles.postImage} resizeMode="cover" />

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
      </View>

      {/* Caption */}
      {post.caption ? (
        <View style={styles.captionContainer}>
          <Text style={styles.captionText}>
            <Text style={styles.captionAuthor}>{author.full_name} </Text>
            {post.caption}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getFeedPosts();
      setPosts(data);
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleLike = useCallback(async (imageId) => {
    if (user) await toggleLike(user.id, imageId);
  }, [user]);

  const handleProfilePress = useCallback(() => {}, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header onNotificationPress={() => navigation.navigate('Notifications')} />
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FeedPost
              post={item}
              onLike={handleLike}
              onProfilePress={handleProfilePress}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={{ height: 40 }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="photo-camera" size={48} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyText}>Aucune publication pour l'instant.</Text>
            </View>
          }
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); fetchPosts(); }}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
});

export default HomeScreen;
