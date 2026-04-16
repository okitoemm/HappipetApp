import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { updateProfile } from '../services/api';

const SettingItem = ({ icon, label, value, onPress, showChevron = true, color }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.settingIcon, color && { backgroundColor: color + '20' }]}>
      <MaterialIcons name={icon} size={20} color={color || Colors.onSurfaceVariant} />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingLabel}>{label}</Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
    </View>
    {showChevron && <MaterialIcons name="chevron-right" size={24} color={Colors.onSurfaceVariant} />}
  </TouchableOpacity>
);

const SettingToggle = ({ icon, label, value, onToggle, color }) => (
  <View style={styles.settingItem}>
    <View style={[styles.settingIcon, color && { backgroundColor: color + '20' }]}>
      <MaterialIcons name={icon} size={20} color={color || Colors.onSurfaceVariant} />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingLabel}>{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: Colors.surfaceContainerHigh, true: Colors.primaryContainer }}
      thumbColor={value ? Colors.primary : Colors.outline}
    />
  </View>
);

export const SettingsScreen = ({ navigation }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);

  // ---- Edit Profile Modal ----
  const [editVisible, setEditVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editVisible && profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCity(profile.city || '');
      setBio(profile.bio || '');
    }
  }, [editVisible, profile]);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Champ requis', 'Le prénom / nom ne peut pas être vide.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(user.id, {
        full_name: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        bio: bio.trim(),
      });
      await refreshProfile();
      setEditVisible(false);
    } catch {
      Alert.alert('Erreur', "La mise à jour a échoué. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  // ---- Password Reset ----
  const handlePasswordReset = () => {
    Alert.alert(
      'Réinitialiser le mot de passe',
      `Un email sera envoyé à ${user?.email}`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Envoyer',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.resetPasswordForEmail(user.email);
              if (error) throw error;
              Alert.alert('Email envoyé', 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.');
            } catch {
              Alert.alert('Erreur', "L'email n'a pas pu être envoyé.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account */}
        <Text style={styles.sectionLabel}>Compte</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            icon="person"
            label="Modifier le profil"
            value={profile?.full_name || user?.email}
            color={Colors.primary}
            onPress={() => setEditVisible(true)}
          />
          <SettingItem
            icon="lock"
            label="Changer le mot de passe"
            color={Colors.secondary}
            onPress={handlePasswordReset}
          />
          <SettingItem
            icon="credit-card"
            label="Moyens de paiement"
            color={Colors.tertiary}
            onPress={() => Alert.alert('Paiements', 'La gestion des paiements sera disponible prochainement.')}
          />
        </View>

        {/* Notifications */}
        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.sectionCard}>
          <SettingToggle icon="notifications" label="Push notifications" value={pushNotifs} onToggle={setPushNotifs} color={Colors.primary} />
          <SettingToggle icon="email" label="Notifications email" value={emailNotifs} onToggle={setEmailNotifs} color={Colors.secondary} />
        </View>

        {/* Support */}
        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.sectionCard}>
          <SettingItem icon="help-outline" label="Centre d'aide" color={Colors.secondary} onPress={() => Alert.alert("Centre d'aide", 'Contactez-nous à support@happipet.fr')} />
          <SettingItem icon="description" label="Conditions d'utilisation" color={Colors.onSurfaceVariant} onPress={() => Alert.alert("Conditions d'utilisation", "Les conditions d'utilisation seront accessibles prochainement.")} />
          <SettingItem icon="privacy-tip" label="Politique de confidentialité" color={Colors.onSurfaceVariant} onPress={() => Alert.alert('Confidentialité', 'La politique de confidentialité sera accessible prochainement.')} />
        </View>

        <Text style={styles.versionText}>Happipet v1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ---- Edit Profile Modal ---- */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le profil</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Prénom / Nom *</Text>
              <TextInput
                style={styles.fieldInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Votre nom complet"
                placeholderTextColor={Colors.onSurfaceVariant}
                autoCapitalize="words"
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
                placeholder="Paris, Lyon, Marseille..."
                placeholderTextColor={Colors.onSurfaceVariant}
                autoCapitalize="words"
              />

              <Text style={styles.fieldLabel}>Bio</Text>
              <TextInput
                style={[styles.fieldInput, styles.fieldInputMulti]}
                value={bio}
                onChangeText={setBio}
                placeholder="Parlez-nous de vous..."
                placeholderTextColor={Colors.onSurfaceVariant}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.6 }]}
              onPress={handleSaveProfile}
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
  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: Colors.onSurfaceVariant,
    textTransform: 'uppercase', letterSpacing: 0.5,
    paddingHorizontal: 20, marginTop: 24, marginBottom: 8,
  },
  sectionCard: {
    marginHorizontal: 16, backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16, overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceContainerHigh,
  },
  settingIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: Colors.onSurface },
  settingValue: { fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },
  versionText: {
    textAlign: 'center', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '90%',
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
  fieldInputMulti: {
    minHeight: 100,
    paddingTop: 12,
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

export default SettingsScreen;
