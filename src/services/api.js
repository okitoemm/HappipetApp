import { supabase } from '../lib/supabase';

// ========================
// PROFILES
// ========================
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ========================
// SITTER PROFILES
// ========================
export async function getSitters({ city, minRating, maxPrice, service, limit = 20, offset = 0 } = {}) {
  let query = supabase
    .from('sitter_profiles')
    .select(`
      *,
      user:profiles!user_id (id, full_name, avatar_url, city)
    `)
    .order('rating', { ascending: false })
    .range(offset, offset + limit - 1);

  if (city) query = query.ilike('location_text', `%${city}%`);
  if (minRating) query = query.gte('rating', minRating);
  if (maxPrice) query = query.lte('price_per_day', maxPrice);
  if (service) query = query.contains('services', [service]);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getSitterById(sitterId) {
  const { data, error } = await supabase
    .from('sitter_profiles')
    .select(`
      *,
      user:profiles!user_id (id, full_name, avatar_url, city, bio)
    `)
    .eq('id', sitterId)
    .single();
  if (error) throw error;
  return data;
}

export async function getSitterByUserId(userId) {
  const { data, error } = await supabase
    .from('sitter_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertSitterProfile(userId, updates) {
  const { data, error } = await supabase
    .from('sitter_profiles')
    .upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ========================
// PETS
// ========================
export async function getMyPets(ownerId) {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addPet(pet) {
  const { data, error } = await supabase
    .from('pets')
    .insert(pet)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePet(petId, updates) {
  const { data, error } = await supabase
    .from('pets')
    .update(updates)
    .eq('id', petId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePet(petId) {
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', petId);
  if (error) throw error;
}

// ========================
// BOOKINGS
// ========================
export async function createBooking(booking) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getMyBookings(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      pet:pets (name, species, breed, avatar_url),
      sitter:sitter_profiles (
        id, price_per_day, location_text,
        user:profiles!user_id (full_name, avatar_url)
      )
    `)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getSitterBookings(sitterProfileId) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      pet:pets (name, species, breed, avatar_url),
      owner:profiles!owner_id (full_name, avatar_url)
    `)
    .eq('sitter_id', sitterProfileId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateBookingStatus(bookingId, status) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ========================
// REVIEWS
// ========================
export async function getSitterReviews(sitterId) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles!reviewer_id (full_name, avatar_url)
    `)
    .eq('sitter_id', sitterId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createReview(review) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ========================
// CONVERSATIONS & MESSAGES
// ========================
export async function getMyConversations(userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participant_1_profile:profiles!participant_1 (id, full_name, avatar_url),
      participant_2_profile:profiles!participant_2 (id, full_name, avatar_url)
    `)
    .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
    .order('last_message_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getOrCreateConversation(userId, otherUserId) {
  // Check if conversation exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .or(
      `and(participant_1.eq.${userId},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${userId})`
    )
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from('conversations')
    .insert({ participant_1: userId, participant_2: otherUserId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!sender_id (full_name, avatar_url)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function sendMessage({ conversationId, senderId, text }) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, text })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markMessagesAsRead(conversationId, userId) {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('read', false);
  if (error) throw error;
}

// Realtime subscription pour les messages
export function subscribeToMessages(conversationId, onNewMessage) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onNewMessage(payload.new)
    )
    .subscribe();
}

// ========================
// FAVORITES
// ========================
export async function getMyFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      sitter:sitter_profiles (
        *,
        user:profiles!user_id (full_name, avatar_url, city)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function toggleFavorite(userId, sitterId) {
  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('sitter_id', sitterId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from('favorites').delete().eq('id', existing.id);
    if (error) throw error;
    return false; // removed
  }

  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, sitter_id: sitterId });
  if (error) throw error;
  return true; // added
}

// ========================
// NOTIFICATIONS
// ========================
export async function getMyNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function markNotificationRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);
  if (error) throw error;
}

// ========================
// GALLERY / FEED
// ========================
export async function getFeedPosts({ limit = 20, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('gallery_images')
    .select(`
      *,
      user:profiles!user_id (id, full_name, avatar_url)
    `)
    .eq('is_feed_post', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function getSitterGallery(userId) {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function toggleLike(userId, imageId) {
  const { data: existing } = await supabase
    .from('feed_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('image_id', imageId)
    .maybeSingle();

  if (existing) {
    await supabase.from('feed_likes').delete().eq('id', existing.id);
    await supabase.rpc('decrement_likes', { image_id: imageId });
    return false;
  }

  await supabase.from('feed_likes').insert({ user_id: userId, image_id: imageId });
  await supabase.rpc('increment_likes', { image_id: imageId });
  return true;
}

// ========================
// IMAGE UPLOAD
// ========================
export async function uploadImage(bucket, userId, uri) {
  const fileName = `${userId}/${Date.now()}.jpg`;
  const response = await fetch(uri);
  const blob = await response.blob();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, blob, { contentType: 'image/jpeg' });
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}
