import { MaterialIcons } from '@expo/vector-icons';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

const mockUser = {
  name: 'Emmanuel',
  email: 'emmanuel@email.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  phone: '+33 6 12 34 56 78',
  memberSince: 'Janvier 2024',
  pets: [
    { id: '1', name: 'Rex', breed: 'Golden Retriever', age: '3 ans', image: 'https://images.unsplash.com/photo-1552053831-71594a27c62d?w=200&h=200&fit=crop' },
    { id: '2', name: 'Luna', breed: 'Berger Australien', age: '1 an', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop' },
  ],
  stats: { bookings: 12, reviews: 8, favorites: 5 },
};

const MenuItem = ({ icon, label, value, onPress, showChevron = true, color }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIconContainer, color && { backgroundColor: color + '20' }]}>
      <MaterialIcons name={icon} size={20} color={color || Colors.onSurfaceVariant} />
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuLabel}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
    </View>
    {showChevron && (
      <MaterialIcons name="chevron-right" size={24} color={Colors.onSurfaceVariant} />
    )}
  </TouchableOpacity>
);

const PetCard = ({ pet }) => (
  <View style={styles.petCard}>
    <Image source={{ uri: pet.image }} style={styles.petImage} />
    <Text style={styles.petName}>{pet.name}</Text>
    <Text style={styles.petBreed}>{pet.breed}</Text>
    <Text style={styles.petAge}>{pet.age}</Text>
  </View>
);

export const UserProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <MaterialIcons name="settings" size={24} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{mockUser.name}</Text>
          <Text style={styles.userEmail}>{mockUser.email}</Text>
          <Text style={styles.memberSince}>Membre depuis {mockUser.memberSince}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockUser.stats.bookings}</Text>
              <Text style={styles.statLabel}>Gardes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockUser.stats.reviews}</Text>
              <Text style={styles.statLabel}>Avis</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockUser.stats.favorites}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
          </View>
        </View>

        {/* My Pets */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes animaux</Text>
            <TouchableOpacity>
              <MaterialIcons name="add-circle-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsScroll}>
            {mockUser.pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
            <TouchableOpacity style={styles.addPetCard}>
              <MaterialIcons name="add" size={32} color={Colors.primary} />
              <Text style={styles.addPetText}>Ajouter</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <MenuItem icon="bookmark" label="Mes réservations" color={Colors.primary} onPress={() => navigation.navigate('MyBookings')} />
          <MenuItem icon="favorite" label="Favoris" color={Colors.error} onPress={() => navigation.navigate('Favorites')} />
          <MenuItem icon="notifications" label="Notifications" color={Colors.secondary} onPress={() => navigation.navigate('Notifications')} />
          <MenuItem icon="star" label="Mes avis" color={Colors.tertiary} onPress={() => {}} />
        </View>

        <View style={styles.menuSection}>
          <MenuItem icon="credit-card" label="Paiements" color={Colors.primary} onPress={() => {}} />
          <MenuItem icon="help-outline" label="Aide & Support" color={Colors.secondary} onPress={() => {}} />
          <MenuItem icon="info-outline" label="À propos" color={Colors.onSurfaceVariant} onPress={() => {}} />
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <MaterialIcons name="logout" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: Colors.primaryContainer,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  memberSince: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  petsScroll: {
    marginLeft: -4,
  },
  petCard: {
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 12,
    width: 120,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  petImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  petName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  petBreed: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    textAlign: 'center',
  },
  petAge: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  addPetCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderRadius: 16,
    padding: 12,
    width: 120,
    height: 140,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    borderStyle: 'dashed',
  },
  addPetText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  menuSection: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  menuValue: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.error,
  },
});

export default UserProfileScreen;
