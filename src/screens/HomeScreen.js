import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components';
import Colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { createFeedPost, getFeedPosts, toggleLike, uploadImage } from '../services/api';

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

  // Create post state
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [postCaption, setPostCaption] = useState('');
  const [postImageBase64, setPostImageBase64] = useState(null);
  const [postImageUri, setPostImageUri] = useState(null);
  const [postSubmitting, setPostSubmitting] = useState(false);

  const openPostModal = () => {
    setPostCaption('');
    setPostImageBase64(null);
    setPostImageUri(null);
    setPostModalVisible(true);
  };

  const handlePickPostImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      setPostImageUri(result.assets[0].uri);
      setPostImageBase64(result.assets[0].base64);
    }
  };

  const handleCreatePost = async () => {
    if (!postImageBase64) {
      Alert.alert('Photo requise', 'Veuillez sélectionner une photo.');
      return;
    }
    setPostSubmitting(true);
    try {
      const imageUrl = await uploadImage('gallery', user.id, postImageBase64);
      await createFeedPost({ userId: user.id, imageUrl, caption: postCaption.trim() });
      setPostModalVisible(false);
      fetchPosts();
    } catch (err) {
      Alert.alert('Erreur', err.message || 'Impossible de publier.');
    } finally {
      setPostSubmitting(false);
    }
  };

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

      {/* Create Post Modal */}
      <Modal visible={postModalVisible} transparent animationType="slide" onRequestClose={() => setPostModalVisible(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Nouvelle publication</Text>
                <TouchableOpacity onPress={() => setPostModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color={Colors.onSurface} />
                </TouchableOpacity>
              </View>

              {/* Image picker */}
              <TouchableOpacity style={styles.imagePicker} onPress={handlePickPostImage} activeOpacity={0.7}>
                {postImageUri ? (
                  <Image source={{ uri: postImageUri }} style={styles.imagePreview} resizeMode="cover" />
                ) : (
                  <View style={styles.imagePickerPlaceholder}>
                    <MaterialIcons name="add-photo-alternate" size={40} color={Colors.onSurfaceVariant} />
                    <Text style={styles.imagePickerText}>Choisir une photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Caption */}
              <TextInput
                style={styles.captionInput}
                placeholder="Écrivez une légende..."
                placeholderTextColor={Colors.outlineVariant}
                value={postCaption}
                onChangeText={setPostCaption}
                multiline
                maxLength={500}
              />

              <TouchableOpacity
                style={[styles.publishBtn, (!postImageBase64 || postSubmitting) && styles.publishBtnDisabled]}
                onPress={handleCreatePost}
                disabled={!postImageBase64 || postSubmitting}
              >
                {postSubmitting
                  ? <ActivityIndicator color={Colors.onPrimary} />
                  : <Text style={styles.publishBtnText}>Publier</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openPostModal} activeOpacity={0.85}>
        <MaterialIcons name="add" size={28} color={Colors.onPrimary} />
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: Colors.onSurface },
  imagePicker: { borderRadius: 16, overflow: 'hidden', marginBottom: 14, backgroundColor: Colors.surfaceContainerLow, height: 180 },
  imagePickerPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  imagePickerText: { fontSize: 13, color: Colors.onSurfaceVariant },
  imagePreview: { width: '100%', height: '100%' },
  captionInput: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, padding: 14, fontSize: 14, color: Colors.onSurface, minHeight: 80, textAlignVertical: 'top', marginBottom: 14 },
  publishBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  publishBtnDisabled: { opacity: 0.5 },
  publishBtnText: { fontSize: 15, fontWeight: '700', color: Colors.onPrimary },
});

export default HomeScreen;
