import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

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
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
          <SettingItem icon="person" label="Modifier le profil" color={Colors.primary} onPress={() => {}} />
          <SettingItem icon="lock" label="Mot de passe" color={Colors.secondary} onPress={() => {}} />
          <SettingItem icon="credit-card" label="Moyens de paiement" color={Colors.tertiary} onPress={() => {}} />
        </View>

        {/* Notifications */}
        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.sectionCard}>
          <SettingToggle icon="notifications" label="Push notifications" value={pushNotifs} onToggle={setPushNotifs} color={Colors.primary} />
          <SettingToggle icon="email" label="Notifications email" value={emailNotifs} onToggle={setEmailNotifs} color={Colors.secondary} />
        </View>

        {/* Apparence */}
        <Text style={styles.sectionLabel}>Apparence</Text>
        <View style={styles.sectionCard}>
          <SettingToggle icon="dark-mode" label="Mode sombre" value={darkMode} onToggle={setDarkMode} color={Colors.onSurface} />
          <SettingItem icon="language" label="Langue" value="Français" color={Colors.secondary} onPress={() => {}} />
        </View>

        {/* Support */}
        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.sectionCard}>
          <SettingItem icon="help-outline" label="Centre d'aide" color={Colors.secondary} onPress={() => {}} />
          <SettingItem icon="description" label="Conditions d'utilisation" color={Colors.onSurfaceVariant} onPress={() => {}} />
          <SettingItem icon="privacy-tip" label="Politique de confidentialité" color={Colors.onSurfaceVariant} onPress={() => {}} />
        </View>

        {/* Version */}
        <Text style={styles.versionText}>Happipet v1.0.0</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
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
});

export default SettingsScreen;
