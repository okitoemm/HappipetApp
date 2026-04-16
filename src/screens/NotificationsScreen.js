import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from '../services/api';

const NOTIF_ICONS = { booking: 'event', message: 'chat', review: 'star', promo: 'local-offer', default: 'notifications' };
const NOTIF_COLORS = { booking: Colors.primary, message: Colors.secondary, review: Colors.tertiary, promo: '#FF5722', default: Colors.onSurfaceVariant };

const normalizeNotif = (n) => ({
  ...n,
  read: n.read ?? false,
  icon: NOTIF_ICONS[n.type] || NOTIF_ICONS.default,
  color: NOTIF_COLORS[n.type] || NOTIF_COLORS.default,
  time: n.created_at ? new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '',
});

const NotificationItem = ({ notification, onPress }) => (
  <TouchableOpacity
    style={[styles.notifItem, !notification.read && styles.notifItemUnread]}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={[styles.notifIcon, { backgroundColor: notification.color + '20' }]}>
      <MaterialIcons name={notification.icon} size={22} color={notification.color} />
    </View>
    <View style={styles.notifContent}>
      <View style={styles.notifHeader}>
        <Text style={[styles.notifTitle, !notification.read && styles.notifTitleUnread]}>{notification.title}</Text>
        <Text style={styles.notifTime}>{notification.time}</Text>
      </View>
      <Text style={styles.notifBody} numberOfLines={2}>{notification.body}</Text>
    </View>
    {!notification.read && <View style={styles.unreadDot} />}
  </TouchableOpacity>
);

export const NotificationsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getMyNotifications(user.id);
      setNotifications(data.map(normalizeNotif));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { /* silent */ }
  };

  const handleNotifPress = async (notif) => {
    if (!notif.read) {
      try {
        await markNotificationRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
      } catch { /* silent */ }
    }
    if (notif.type === 'message') {
      navigation.navigate('Messages');
    } else if (notif.type === 'booking') {
      navigation.navigate('MyBookings');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead} disabled={unreadCount === 0}>
          <Text style={[styles.markAllRead, unreadCount === 0 && { opacity: 0.4 }]}>Tout lire</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem notification={item} onPress={() => handleNotifPress(item)} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 60 }} />
        ) : (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <MaterialIcons name="notifications-none" size={48} color={Colors.outlineVariant} />
            <Text style={{ color: Colors.onSurfaceVariant, marginTop: 12 }}>Aucune notification</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceContainerHigh,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.onSurface },
  markAllRead: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  list: { paddingVertical: 8 },
  notifItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
  },
  notifItemUnread: { backgroundColor: Colors.primaryContainer + '15' },
  notifIcon: {
    width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: '600', color: Colors.onSurface, flex: 1 },
  notifTitleUnread: { fontWeight: '700' },
  notifTime: { fontSize: 11, color: Colors.onSurfaceVariant, marginLeft: 8 },
  notifBody: { fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 18 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginLeft: 8,
  },
  separator: { height: 1, backgroundColor: Colors.surfaceContainerHigh, marginLeft: 74 },
});

export default NotificationsScreen;
