import { MaterialIcons } from '@expo/vector-icons';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

const mockNotifications = [
  { id: '1', type: 'booking', title: 'Réservation confirmée', body: 'Camille R. a accepté votre demande de garde pour Rex.', time: 'Il y a 2h', read: false, icon: 'check-circle', color: '#4CAF50' },
  { id: '2', type: 'message', title: 'Nouveau message', body: 'Marc vous a envoyé un message.', time: 'Il y a 5h', read: false, icon: 'chat', color: Colors.secondary },
  { id: '3', type: 'reminder', title: 'Rappel garde demain', body: 'N\'oubliez pas de déposer Rex chez Camille demain à 9h.', time: 'Hier', read: true, icon: 'notifications', color: Colors.primary },
  { id: '4', type: 'review', title: 'Laissez un avis !', body: 'Comment s\'est passée la garde de Luna chez Thomas ?', time: 'Il y a 3j', read: true, icon: 'star', color: Colors.tertiary },
  { id: '5', type: 'promo', title: 'Offre spéciale', body: 'Profitez de -20% sur votre prochaine garde ce weekend !', time: 'Il y a 5j', read: true, icon: 'local-offer', color: '#FF5722' },
  { id: '6', type: 'booking', title: 'Garde terminée', body: 'La garde de Rex chez Marie L. est terminée. Rex va bien !', time: 'Il y a 1 sem', read: true, icon: 'pets', color: Colors.primary },
];

const NotificationItem = ({ notification }) => (
  <TouchableOpacity style={[styles.notifItem, !notification.read && styles.notifItemUnread]} activeOpacity={0.7}>
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Tout lire</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
