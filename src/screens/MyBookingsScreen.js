import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

const MOCK_BOOKINGS = [
  {
    id: '1', sitterName: 'Marie Dupont', sitterImage: 'https://randomuser.me/api/portraits/women/1.jpg',
    service: 'Garde à domicile', pet: 'Luna', dates: '15-18 Juin 2025',
    total: '135€', status: 'upcoming', statusLabel: 'À venir',
  },
  {
    id: '2', sitterName: 'Pierre Martin', sitterImage: 'https://randomuser.me/api/portraits/men/2.jpg',
    service: 'Promenade', pet: 'Max', dates: '20 Juin 2025',
    total: '25€', status: 'upcoming', statusLabel: 'À venir',
  },
  {
    id: '3', sitterName: 'Sophie Bernard', sitterImage: 'https://randomuser.me/api/portraits/women/3.jpg',
    service: 'Garde à domicile', pet: 'Luna', dates: '1-3 Mai 2025',
    total: '105€', status: 'completed', statusLabel: 'Terminée',
  },
  {
    id: '4', sitterName: 'Marie Dupont', sitterImage: 'https://randomuser.me/api/portraits/women/1.jpg',
    service: 'Visite à domicile', pet: 'Max', dates: '10 Avril 2025',
    total: '20€', status: 'completed', statusLabel: 'Terminée',
  },
  {
    id: '5', sitterName: 'Lucas Moreau', sitterImage: 'https://randomuser.me/api/portraits/men/4.jpg',
    service: 'Pension', pet: 'Luna', dates: '20-22 Mars 2025',
    total: '150€', status: 'cancelled', statusLabel: 'Annulée',
  },
];

const TABS = [
  { key: 'all', label: 'Toutes' },
  { key: 'upcoming', label: 'À venir' },
  { key: 'completed', label: 'Terminées' },
  { key: 'cancelled', label: 'Annulées' },
];

const statusColors = {
  upcoming: Colors.secondary,
  completed: Colors.primary,
  cancelled: Colors.error,
};

const BookingCard = ({ booking, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.cardTop}>
      <Image source={{ uri: booking.sitterImage }} style={styles.sitterAvatar} />
      <View style={styles.cardInfo}>
        <Text style={styles.sitterName}>{booking.sitterName}</Text>
        <Text style={styles.serviceText}>{booking.service}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusColors[booking.status] + '18' }]}>
        <Text style={[styles.statusText, { color: statusColors[booking.status] }]}>{booking.statusLabel}</Text>
      </View>
    </View>
    <View style={styles.cardDivider} />
    <View style={styles.cardBottom}>
      <View style={styles.detailRow}>
        <MaterialIcons name="pets" size={16} color={Colors.onSurfaceVariant} />
        <Text style={styles.detailText}>{booking.pet}</Text>
      </View>
      <View style={styles.detailRow}>
        <MaterialIcons name="event" size={16} color={Colors.onSurfaceVariant} />
        <Text style={styles.detailText}>{booking.dates}</Text>
      </View>
      <Text style={styles.totalText}>{booking.total}</Text>
    </View>
  </TouchableOpacity>
);

export const MyBookingsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? MOCK_BOOKINGS
    : MOCK_BOOKINGS.filter(b => b.status === activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes réservations</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length > 0 ? (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <BookingCard booking={item} onPress={() => {}} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="event-busy" size={64} color={Colors.outlineVariant} />
          <Text style={styles.emptyTitle}>Aucune réservation</Text>
          <Text style={styles.emptySubtitle}>
            Vous n'avez pas encore de réservation dans cette catégorie.
          </Text>
        </View>
      )}
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
  tabs: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8,
  },
  tab: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant },
  tabTextActive: { color: Colors.onPrimary },
  list: { padding: 16 },
  card: {
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16, padding: 16,
    marginBottom: 12, elevation: 2,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  sitterAvatar: { width: 48, height: 48, borderRadius: 24 },
  cardInfo: { flex: 1, marginLeft: 12 },
  sitterName: { fontSize: 16, fontWeight: '700', color: Colors.onSurface },
  serviceText: { fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
  cardDivider: { height: 1, backgroundColor: Colors.surfaceContainerHigh, marginVertical: 12 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 13, color: Colors.onSurfaceVariant },
  totalText: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.onSurface, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});

export default MyBookingsScreen;
