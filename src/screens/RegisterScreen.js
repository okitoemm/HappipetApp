import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
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
import { addPet, updateProfile, upsertSitterProfile } from '../services/api';

const { width } = Dimensions.get('window');

// step indices
// 0: credentials   → both
// 1: role          → both
// 2: name          → both
// 3: city          → both
// 4: pet           → owner  | price      → sitter
// 5: confirm       → owner  | description→ sitter
// 6:                          confirm    → sitter
const OWNER_TOTAL = 5; // last data step before confirm
const SITTER_TOTAL = 6;

export const RegisterScreen = ({ navigation }) => {
  const { signUp } = useAuth();

  // step & navigation
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // role
  const [role, setRole] = useState(null); // 'owner' | 'sitter'

  // common
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  // owner
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('dog');
  const [petBreed, setPetBreed] = useState('');

  // sitter
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // ui state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = role === 'sitter' ? SITTER_TOTAL : OWNER_TOTAL;
  const progress = Math.min(step / totalSteps, 1);
  const isConfirmStep = (role === 'owner' && step === 5) || (role === 'sitter' && step === 6);

  const animate = (direction = 'forward') => {
    const startVal = direction === 'forward' ? width : -width;
    slideAnim.setValue(-startVal);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }).start();
  };

  const goNext = () => {
    setError('');
    animate('forward');
    setStep(s => s + 1);
  };

  const goBack = () => {
    if (step === 0) { navigation.goBack(); return; }
    setError('');
    animate('back');
    setStep(s => s - 1);
  };

  const validate = () => {
    if (step === 0) {
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return 'Email invalide.';
      if (password.length < 6) return 'Mot de passe : 6 caractères minimum.';
    }
    if (step === 1 && !role) return 'Choisis un profil pour continuer.';
    if (step === 2 && !name.trim()) return 'Entre ton prénom pour continuer.';
    if (step === 4 && role === 'sitter' && (!price.trim() || isNaN(parseFloat(price)))) return 'Entre un tarif valide.';
    return null;
  };

  const handleNext = () => {
    const err = validate();
    if (err) { setError(err); return; }
    goNext();
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await signUp({ email: email.trim(), password, fullName: name.trim() });
      const userId = data?.user?.id;

      if (userId) {
        // Profile data (best-effort — may fail if email confirmation required & no session)
        await updateProfile(userId, {
          full_name: name.trim(),
          city: city.trim() || null,
        }).catch(() => {});

        if (role === 'owner' && petName.trim()) {
          await addPet({
            owner_id: userId,
            name: petName.trim(),
            species: petSpecies,
            breed: petBreed.trim() || null,
          }).catch(() => {});
        }

        if (role === 'sitter') {
          await upsertSitterProfile(userId, {
            description: description.trim() || null,
            price_per_day: parseFloat(price) || 0,
            location_text: city.trim() || null,
          }).catch(() => {});
        }
      }

      setDone(true);
      // If session exists, AuthContext will auto-navigate to home.
      // If email confirmation required, show confirmation message.
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Done screen ───────────────────────────────────────────────────────────
  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.doneContainer}>
          <View style={styles.doneCircle}>
            <Text style={styles.doneEmoji}>{role === 'sitter' ? '🏠' : '🐾'}</Text>
          </View>
          <Text style={styles.doneTitle}>
            {role === 'sitter' ? 'Bienvenue, gardien !' : 'Bienvenue chez Happipet !'}
          </Text>
          <Text style={styles.doneSubtitle}>
            {role === 'sitter'
              ? 'Ton profil gardien est créé. Tu apparais maintenant dans les recherches.'
              : 'Ton compte est prêt. Tu peux maintenant trouver le gardien idéal pour ton animal.'}
          </Text>
          <Text style={styles.doneHint}>
            Vérifie ta boîte mail pour confirmer ton adresse si nécessaire.
          </Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.doneBtnText}>Accéder à l'application</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Step renderer ─────────────────────────────────────────────────────────
  const renderStep = () => {
    // Step 0 — Credentials
    if (step === 0) return (
      <View style={styles.stepContent}>
        <Text style={styles.stepEmoji}>👋</Text>
        <Text style={styles.stepTitle}>Créons ton compte</Text>
        <Text style={styles.stepSubtitle}>Quelques secondes pour commencer l'aventure.</Text>

        <View style={styles.inputBox}>
          <MaterialIcons name="email" size={20} color={Colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.outlineVariant}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
        </View>

        <View style={styles.inputBox}>
          <MaterialIcons name="lock-outline" size={20} color={Colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe (6 car. min.)"
            placeholderTextColor={Colors.outlineVariant}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPwd}
          />
          <TouchableOpacity onPress={() => setShowPwd(v => !v)}>
            <MaterialIcons name={showPwd ? 'visibility' : 'visibility-off'} size={20} color={Colors.outlineVariant} />
          </TouchableOpacity>
        </View>
      </View>
    );

    // Step 1 — Role selection
    if (step === 1) return (
      <View style={styles.stepContent}>
        <Text style={styles.stepEmoji}>🐶</Text>
        <Text style={styles.stepTitle}>Tu es plutôt…</Text>
        <Text style={styles.stepSubtitle}>Ton expérience sera personnalisée selon ton choix.</Text>

        <TouchableOpacity
          style={[styles.roleCard, role === 'owner' && styles.roleCardActive]}
          onPress={() => setRole('owner')}
          activeOpacity={0.8}
        >
          <View style={styles.roleCardEmoji}><Text style={styles.roleEmoji}>🐾</Text></View>
          <View style={styles.roleCardText}>
            <Text style={[styles.roleTitle, role === 'owner' && { color: Colors.primary }]}>Propriétaire</Text>
            <Text style={styles.roleDesc}>J'ai un animal et je cherche quelqu'un pour le garder.</Text>
          </View>
          {role === 'owner' && <MaterialIcons name="check-circle" size={24} color={Colors.primary} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, role === 'sitter' && styles.roleCardActive]}
          onPress={() => setRole('sitter')}
          activeOpacity={0.8}
        >
          <View style={styles.roleCardEmoji}><Text style={styles.roleEmoji}>🏠</Text></View>
          <View style={styles.roleCardText}>
            <Text style={[styles.roleTitle, role === 'sitter' && { color: Colors.primary }]}>Gardien</Text>
            <Text style={styles.roleDesc}>J'adore les animaux et je propose mes services de garde.</Text>
          </View>
          {role === 'sitter' && <MaterialIcons name="check-circle" size={24} color={Colors.primary} />}
        </TouchableOpacity>
      </View>
    );

    // Step 2 — Name
    if (step === 2) return (
      <View style={styles.stepContent}>
        <Text style={styles.stepEmoji}>😊</Text>
        <Text style={styles.stepTitle}>Comment tu t'appelles ?</Text>
        <Text style={styles.stepSubtitle}>Ton prénom sera affiché sur ton profil.</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="person-outline" size={20} color={Colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Ton prénom et nom"
            placeholderTextColor={Colors.outlineVariant}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoFocus
          />
        </View>
      </View>
    );

    // Step 3 — City
    if (step === 3) return (
      <View style={styles.stepContent}>
        <Text style={styles.stepEmoji}>📍</Text>
        <Text style={styles.stepTitle}>Dans quelle ville ?</Text>
        <Text style={styles.stepSubtitle}>
          {role === 'owner'
            ? 'On trouvera les gardiens près de chez toi.'
            : 'Les propriétaires proches pourront te trouver.'}
        </Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="location-on" size={20} color={Colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Paris, Lyon, Marseille…"
            placeholderTextColor={Colors.outlineVariant}
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
            autoFocus
          />
        </View>
        <TouchableOpacity onPress={goNext} style={styles.skipLink}>
          <Text style={styles.skipText}>Je remplirai ça plus tard</Text>
        </TouchableOpacity>
      </View>
    );

    // Step 4 — Owner: pet | Sitter: price
    if (step === 4) {
      if (role === 'owner') return (
        <View style={styles.stepContent}>
          <Text style={styles.stepEmoji}>🐕</Text>
          <Text style={styles.stepTitle}>Ajoute ton animal</Text>
          <Text style={styles.stepSubtitle}>Tu pourras en ajouter d'autres plus tard depuis ton profil.</Text>

          <View style={styles.inputBox}>
            <MaterialIcons name="pets" size={20} color={Colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Nom de l'animal (Rex, Luna…)"
              placeholderTextColor={Colors.outlineVariant}
              value={petName}
              onChangeText={setPetName}
              autoCapitalize="words"
              autoFocus
            />
          </View>

          <View style={styles.speciesRow}>
            {[{ label: '🐶 Chien', value: 'dog' }, { label: '🐱 Chat', value: 'cat' }, { label: '🐾 Autre', value: 'other' }].map(s => (
              <TouchableOpacity
                key={s.value}
                style={[styles.speciesBtn, petSpecies === s.value && styles.speciesBtnActive]}
                onPress={() => setPetSpecies(s.value)}
              >
                <Text style={[styles.speciesBtnText, petSpecies === s.value && { color: Colors.primary, fontWeight: '700' }]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputBox}>
            <MaterialIcons name="edit" size={20} color={Colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Race (optionnel)"
              placeholderTextColor={Colors.outlineVariant}
              value={petBreed}
              onChangeText={setPetBreed}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity onPress={goNext} style={styles.skipLink}>
            <Text style={styles.skipText}>Passer cette étape</Text>
          </TouchableOpacity>
        </View>
      );

      // Sitter: price
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepEmoji}>💰</Text>
          <Text style={styles.stepTitle}>Quel est ton tarif ?</Text>
          <Text style={styles.stepSubtitle}>Ton tarif par jour de garde. Tu pourras le modifier à tout moment.</Text>
          <View style={styles.inputBoxLarge}>
            <TextInput
              style={styles.inputPrice}
              placeholder="25"
              placeholderTextColor={Colors.outlineVariant}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              autoFocus
            />
            <Text style={styles.priceSuffix}>€ / jour</Text>
          </View>
        </View>
      );
    }

    // Step 5 — Owner: confirm | Sitter: description
    if (step === 5) {
      if (role === 'owner') return (
        <View style={styles.stepContent}>
          <Text style={styles.stepEmoji}>✅</Text>
          <Text style={styles.stepTitle}>Tout est prêt !</Text>
          <Text style={styles.stepSubtitle}>Voici ton profil. Clique sur créer pour lancer l'aventure.</Text>
          <View style={styles.summaryCard}>
            <SummaryRow icon="person" label="Nom" value={name} />
            {city ? <SummaryRow icon="location-on" label="Ville" value={city} /> : null}
            {petName ? <SummaryRow icon="pets" label="Animal" value={`${petName} (${petSpecies})`} /> : null}
          </View>
        </View>
      );

      // Sitter: description
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepEmoji}>✍️</Text>
          <Text style={styles.stepTitle}>Présente-toi !</Text>
          <Text style={styles.stepSubtitle}>Quelques mots sur ton expérience avec les animaux. (optionnel)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ex : Amoureux des animaux depuis toujours, j'ai grandi avec des chiens..."
            placeholderTextColor={Colors.outlineVariant}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            autoFocus
          />
          <TouchableOpacity onPress={goNext} style={styles.skipLink}>
            <Text style={styles.skipText}>Passer cette étape</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Step 6 — Sitter: confirm
    if (step === 6 && role === 'sitter') return (
      <View style={styles.stepContent}>
        <Text style={styles.stepEmoji}>🚀</Text>
        <Text style={styles.stepTitle}>Profil gardien prêt !</Text>
        <Text style={styles.stepSubtitle}>Tu seras visible dans les recherches dès l'activation de ton compte.</Text>
        <View style={styles.summaryCard}>
          <SummaryRow icon="person" label="Nom" value={name} />
          {city ? <SummaryRow icon="location-on" label="Zone" value={city} /> : null}
          <SummaryRow icon="euro" label="Tarif" value={`${price} €/jour`} />
          {description ? <SummaryRow icon="notes" label="Bio" value={description.slice(0, 60) + (description.length > 60 ? '…' : '')} /> : null}
        </View>
      </View>
    );

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>

        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <MaterialIcons name={step === 0 ? 'close' : 'arrow-back'} size={24} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.stepCounter}>
            {step + 1} / {totalSteps + 1}
          </Text>
        </View>

        {/* Step content */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            {renderStep()}
          </Animated.View>

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <MaterialIcons name="error-outline" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </ScrollView>

        {/* CTA Button */}
        <View style={styles.footer}>
          {isConfirmStep ? (
            <TouchableOpacity
              style={[styles.nextBtn, loading && styles.nextBtnDisabled]}
              onPress={handleCreate}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={Colors.onPrimary} />
                : <>
                    <Text style={styles.nextBtnText}>Créer mon compte 🎉</Text>
                  </>
              }
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>Continuer</Text>
              <MaterialIcons name="arrow-forward" size={20} color={Colors.onPrimary} />
            </TouchableOpacity>
          )}

          {step === 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Déjà un compte ? <Text style={{ fontWeight: '700', color: Colors.primary }}>Se connecter</Text></Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Helper component ─────────────────────────────────────────────────────────
const SummaryRow = ({ icon, label, value }) => (
  <View style={styles.summaryRow}>
    <MaterialIcons name={icon} size={18} color={Colors.primary} />
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue} numberOfLines={1}>{value}</Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  progressBar: { height: 4, backgroundColor: Colors.surfaceContainerHigh },
  progressFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { padding: 4 },
  stepCounter: { fontSize: 13, color: Colors.onSurfaceVariant, fontWeight: '600' },

  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20 },

  stepContent: { paddingTop: 16 },
  stepEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  stepTitle: { fontSize: 26, fontWeight: '800', color: Colors.onSurface, textAlign: 'center', lineHeight: 32 },
  stepSubtitle: { fontSize: 15, color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, marginBottom: 32, lineHeight: 22 },

  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 14, paddingHorizontal: 16, height: 54,
    borderWidth: 1.5, borderColor: Colors.surfaceContainerHigh,
    marginBottom: 14,
  },
  input: { flex: 1, fontSize: 16, color: Colors.onSurface },

  inputBoxLarge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14,
    paddingHorizontal: 24, paddingVertical: 20,
    borderWidth: 1.5, borderColor: Colors.surfaceContainerHigh, marginBottom: 14,
  },
  inputPrice: { fontSize: 48, fontWeight: '800', color: Colors.onSurface, textAlign: 'center', minWidth: 80 },
  priceSuffix: { fontSize: 20, color: Colors.onSurfaceVariant, fontWeight: '600' },

  textArea: {
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14,
    padding: 16, fontSize: 15, color: Colors.onSurface,
    borderWidth: 1.5, borderColor: Colors.surfaceContainerHigh,
    minHeight: 140, textAlignVertical: 'top', marginBottom: 14,
  },

  skipLink: { alignSelf: 'center', paddingVertical: 12 },
  skipText: { fontSize: 14, color: Colors.onSurfaceVariant, textDecorationLine: 'underline' },

  // Role cards
  roleCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 18,
    padding: 18, marginBottom: 14,
    borderWidth: 2, borderColor: 'transparent',
  },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryContainer + '18' },
  roleCardEmoji: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  roleEmoji: { fontSize: 26 },
  roleCardText: { flex: 1 },
  roleTitle: { fontSize: 17, fontWeight: '700', color: Colors.onSurface },
  roleDesc: { fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 3, lineHeight: 18 },

  // Pet species
  speciesRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  speciesBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1.5, borderColor: Colors.surfaceContainerHigh,
  },
  speciesBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryContainer + '25' },
  speciesBtnText: { fontSize: 13, color: Colors.onSurfaceVariant },

  // Summary
  summaryCard: {
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16,
    padding: 16, gap: 12,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryLabel: { fontSize: 13, color: Colors.onSurfaceVariant, width: 48 },
  summaryValue: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.onSurface },

  // Error
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.error + '15', borderRadius: 10, padding: 12, marginTop: 8 },
  errorText: { flex: 1, fontSize: 13, color: Colors.error },

  // Footer
  footer: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 16 : 24, paddingTop: 12, gap: 12 },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: 16, height: 56,
  },
  nextBtnDisabled: { opacity: 0.6 },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: Colors.onPrimary },
  loginLink: { alignItems: 'center' },
  loginLinkText: { fontSize: 14, color: Colors.onSurfaceVariant },

  // Done screen
  doneContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  doneCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.primaryContainer + '40',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  doneEmoji: { fontSize: 50 },
  doneTitle: { fontSize: 26, fontWeight: '800', color: Colors.onSurface, textAlign: 'center', marginBottom: 12 },
  doneSubtitle: { fontSize: 15, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22, marginBottom: 12 },
  doneHint: { fontSize: 12, color: Colors.outlineVariant, textAlign: 'center', marginBottom: 32 },
  doneBtn: { backgroundColor: Colors.primary, borderRadius: 16, height: 56, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { fontSize: 16, fontWeight: '700', color: Colors.onPrimary },
});


export default RegisterScreen;
