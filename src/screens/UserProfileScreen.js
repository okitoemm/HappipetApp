import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { addPet, getBookingsCount, getFavoritesCount, getMyPets, updateProfile, uploadImage, upsertSitterProfile } from '../services/api';

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
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({ bookings: 0, reviews: 0, favorites: 0 });
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Edit modal
  const [editVisible, setEditVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);

  // Add Pet modal
  const [addPetVisible, setAddPetVisible] = useState(false);
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('dog');
  const [petBreed, setPetBreed] = useState('');
  const [petSaving, setPetSaving] = useState(false);

  // Become Sitter modal
  const [sitterModalVisible, setSitterModalVisible] = useState(false);
  const [sitterDesc, setSitterDesc] = useState('');
  const [sitterPrice, setSitterPrice] = useState('');
  const [sitterLocation, setSitterLocation] = useState('');
  const [sitterSaving, setSitterSaving] = useState(false);

  useEffect(() => {
    if (editVisible && profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCity(profile.city || '');
    }
  }, [editVisible, profile]);

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

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Requis', 'Le nom ne peut pas être vide.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(user.id, {
        full_name: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
      });
      await refreshProfile();
      setEditVisible(false);
    } catch {
      Alert.alert('Erreur', 'La mise à jour a échoué.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'L\'accès à la galerie est nécessaire.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset.base64) {
      Alert.alert('Erreur', 'Impossible de lire l\'image.');
      return;
    }
    setAvatarUploading(true);
    try {
      const publicUrl = await uploadImage('avatars', user.id, asset.base64);
      await updateProfile(user.id, { avatar_url: publicUrl });
      await refreshProfile();
    } catch (err) {
      Alert.alert('Erreur', err.message || 'Impossible de mettre à jour la photo.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAddPet = async () => {
    if (!petName.trim()) {
      Alert.alert('Requis', 'Le nom de l\'animal est obligatoire.');
      return;
    }
    setPetSaving(true);
    try {
      await addPet({
        owner_id: user.id,
        name: petName.trim(),
        species: petSpecies,
        breed: petBreed.trim() || null,
      });
      setPetName('');
      setPetSpecies('dog');
      setPetBreed('');
      setAddPetVisible(false);
      fetchData();
    } catch (err) {
      Alert.alert('Erreur', err.message || 'Impossible d\'ajouter l\'animal.');
    } finally {
      setPetSaving(false);
    }
  };

  const handleBecomeSitter = async () => {
    if (!sitterPrice.trim()) {
      Alert.alert('Requis', 'Veuillez indiquer votre tarif par jour.');
      return;
    }
    setSitterSaving(true);
    try {
      await upsertSitterProfile(user.id, {
        description: sitterDesc.trim(),
        price_per_day: parseFloat(sitterPrice) || 0,
        location_text: sitterLocation.trim() || profile?.city || '',
      });
      setSitterModalVisible(false);
      Alert.alert('Profil créé !', 'Votre profil de gardien est maintenant visible dans les recherches.');
    } catch (err) {
      Alert.alert('Erreur', err.message || 'Impossible de créer le profil gardien.');
    } finally {
      setSitterSaving(false);
    }
  };

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
          <TouchableOpacity onPress={handleAvatarPick} style={styles.avatarContainer} disabled={avatarUploading}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <MaterialIcons name="person" size={40} color={Colors.onSurfaceVariant} />
              </View>
            )}
            <View style={styles.avatarOverlay}>
              {avatarUploading
                ? <ActivityIndicator size="small" color={Colors.onPrimary} />
                : <MaterialIcons name="camera-alt" size={16} color={Colors.onPrimary} />
              }
            </View>
          </TouchableOpacity>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{profile?.full_name || user?.email}</Text>
            <TouchableOpacity onPress={() => setEditVisible(true)} style={styles.editNameBtn}>
              <MaterialIcons name="edit" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
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
            <TouchableOpacity onPress={() => setAddPetVisible(true)}>
              <MaterialIcons name="add-circle-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsScroll}>
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
            <TouchableOpacity style={styles.addPetCard} onPress={() => setAddPetVisible(true)}>
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
          <MenuItem icon="pets" label="Devenir gardien" color={Colors.primary} onPress={() => {
            setSitterDesc(profile?.bio || '');
            setSitterLocation(profile?.city || '');
            setSitterPrice('');
            setSitterModalVisible(true);
          }} />
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

      {/* ---- Edit Name Modal ---- */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier mes infos</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Prénom / Nom *</Text>
            <TextInput
              style={styles.fieldInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Votre nom complet"
              placeholderTextColor={Colors.onSurfaceVariant}
              autoCapitalize="words"
              autoFocus
            />

            <Text style={styles.fieldLabel}>Téléphone</Text>
            <TextInput
              style={styles.fieldInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="+33 6 12 34 56 78"
              placeholderTextColor={Colors.onSurfaceVariant}
              keyboardType="phone-pad"
            />

            <Text style={styles.fieldLabel}>Ville</Text>
            <TextInput
              style={styles.fieldInput}
              value={city}
              onChangeText={setCity}
              placeholder="Paris, Lyon..."
              placeholderTextColor={Colors.onSurfaceVariant}
              autoCapitalize="words"
            />

            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color={Colors.onPrimary} />
                : <Text style={styles.saveButtonText}>Enregistrer</Text>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ---- Add Pet Modal ---- */}
      <Modal visible={addPetVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter un animal</Text>
              <TouchableOpacity onPress={() => setAddPetVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Nom *</Text>
            <TextInput
              style={styles.fieldInput}
              value={petName}
              onChangeText={setPetName}
              placeholder="Rex, Luna..."
              placeholderTextColor={Colors.onSurfaceVariant}
              autoCapitalize="words"
              autoFocus
            />

            <Text style={styles.fieldLabel}>Espèce</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              {[{ label: 'Chien 🐶', value: 'dog' }, { label: 'Chat 🐱', value: 'cat' }, { label: 'Autre', value: 'other' }].map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setPetSpecies(opt.value)}
                  style={[styles.fieldInput, { flex: 1, alignItems: 'center', justifyContent: 'center',
                    borderColor: petSpecies === opt.value ? Colors.primary : Colors.outlineVariant,
                    borderWidth: petSpecies === opt.value ? 2 : 1 }]}
                >
                  <Text style={{ color: petSpecies === opt.value ? Colors.primary : Colors.onSurfaceVariant, fontWeight: '600' }}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Race</Text>
            <TextInput
              style={styles.fieldInput}
              value={petBreed}
              onChangeText={setPetBreed}
              placeholder="Golden Retriever, Berger Australien..."
              placeholderTextColor={Colors.onSurfaceVariant}
              autoCapitalize="words"
            />

            <TouchableOpacity
              style={[styles.saveButton, petSaving && { opacity: 0.6 }]}
              onPress={handleAddPet}
              disabled={petSaving}
            >
              {petSaving
                ? <ActivityIndicator color={Colors.onPrimary} />
                : <Text style={styles.saveButtonText}>Ajouter</Text>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ---- Become Sitter Modal ---- */}
      <Modal visible={sitterModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Devenir gardien</Text>
              <TouchableOpacity onPress={() => setSitterModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Tarif par jour (€) *</Text>
            <TextInput
              style={styles.fieldInput}
              value={sitterPrice}
              onChangeText={setSitterPrice}
              placeholder="25"
              placeholderTextColor={Colors.onSurfaceVariant}
              keyboardType="numeric"
              autoFocus
            />

            <Text style={styles.fieldLabel}>Ville / Zone</Text>
            <TextInput
              style={styles.fieldInput}
              value={sitterLocation}
              onChangeText={setSitterLocation}
              placeholder="Paris 15ème, Lyon..."
              placeholderTextColor={Colors.onSurfaceVariant}
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Présentation</Text>
            <TextInput
              style={[styles.fieldInput, { height: 80, textAlignVertical: 'top' }]}
              value={sitterDesc}
              onChangeText={setSitterDesc}
              placeholder="Décrivez votre expérience avec les animaux..."
              placeholderTextColor={Colors.onSurfaceVariant}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[styles.saveButton, sitterSaving && { opacity: 0.6 }]}
              onPress={handleBecomeSitter}
              disabled={sitterSaving}
            >
              {sitterSaving
                ? <ActivityIndicator color={Colors.onPrimary} />
                : <Text style={styles.saveButtonText}>Créer mon profil gardien</Text>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    borderWidth: 3,
    borderColor: Colors.primaryContainer,
  },
  avatarContainer: {
    marginBottom: 12,
    position: 'relative',
    alignSelf: 'center',
  },
  avatarPlaceholder: {
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editNameBtn: {
    padding: 4,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    marginBottom: 6,
    marginTop: 14,
  },
  fieldInput: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.onSurface,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default UserProfileScreen;
