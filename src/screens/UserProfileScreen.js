import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { getBookingsCount, getFavoritesCount, getMyPets } from '../services/api';

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
    {pet.avatar_url ? (
      <Image source={{ uri: pet.avatar_url }} style={styles.petImage} />
    ) : (
      <View style={[styles.petImage, { backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' }]}>
        <MaterialIcons name="pets" size={32} color={Colors.onSurfaceVariant} />
      </View>
    )}
    <Text style={styles.petName}>{pet.name}</Text>
    <Text style={styles.petBreed}>{pet.breed || pet.species}</Text>
    {pet.birth_date ? <Text style={styles.petAge}>{pet.birth_date}</Text> : null}
  </View>
);

export const UserProfileScreen = ({ navigation }) => {
  const { user, profile, signOut } = useAuth();
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({ bookings: 0, reviews: 0, favorites: 0 });

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const petsData = await getMyPets(user.id);
      setPets(petsData ?? []);
    } catch { /* silent */ }
    try {
      const [bookingsCount, favCount] = await Promise.all([
        getBookingsCount(user.id),
        getFavoritesCount(user.id),
      ]);
      setStats({ bookings: bookingsCount, reviews: 0, favorites: favCount });
    } catch { /* silent */ }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : '';

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
          <Image source={{ uri: profile?.avatar_url }} style={styles.avatar} />
          <Text style={styles.userName}>{profile?.full_name || user?.email}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {memberSince ? <Text style={styles.memberSince}>Membre depuis {memberSince}</Text> : null}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.bookings}</Text>
              <Text style={styles.statLabel}>Gardes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.reviews}</Text>
              <Text style={styles.statLabel}>Avis</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.favorites}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
          </View>
        </View>

        {/* My Pets */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes animaux</Text>
            <TouchableOpacity onPress={() => Alert.alert('Ajouter un animal', 'Cette fonctionnalité sera disponible prochainement.')}>
              <MaterialIcons name="add-circle-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsScroll}>
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
            <TouchableOpacity style={styles.addPetCard} onPress={() => Alert.alert('Ajouter un animal', 'Cette fonctionnalité sera disponible prochainement.')}>
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
          <MenuItem icon="star" label="Mes avis" color={Colors.tertiary} onPress={() => Alert.alert('Mes avis', 'Cette fonctionnalité sera disponible prochainement.')} />
        </View>

        <View style={styles.menuSection}>
          <MenuItem icon="credit-card" label="Paiements" color={Colors.primary} onPress={() => Alert.alert('Paiements', 'Cette fonctionnalité sera disponible prochainement.')} />
          <MenuItem icon="help-outline" label="Aide & Support" color={Colors.secondary} onPress={() => Alert.alert('Aide & Support', 'Contactez-nous \u00e0 support@happipet.fr')} />
          <MenuItem icon="info-outline" label="\u00c0 propos" color={Colors.onSurfaceVariant} onPress={() => Alert.alert('Happipet', 'Version 1.0.0\nApplication de garde d\'animaux entre particuliers.')} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [{ text: 'Annuler', style: 'cancel' }, { text: 'Se déconnecter', style: 'destructive', onPress: () => signOut() }])}>
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
