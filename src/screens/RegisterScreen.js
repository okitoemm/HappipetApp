import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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

export const RegisterScreen = ({ navigation }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await signUp({ email: email.trim(), password, fullName: fullName.trim() });
      Alert.alert(
        'Inscription réussie !',
        'Vérifiez votre email pour confirmer votre compte.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
          </TouchableOpacity>

          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez la communauté Happipet</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={20} color={Colors.onSurfaceVariant} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nom complet"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color={Colors.onSurfaceVariant} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color={Colors.onSurfaceVariant} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe (6 caractères min.)"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={Colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock-outline" size={20} color={Colors.onSurfaceVariant} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.onPrimary} />
              ) : (
                <Text style={styles.buttonText}>S'inscrire</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            En vous inscrivant, vous acceptez nos{' '}
            <Text style={styles.termsLink}>Conditions d'utilisation</Text> et notre{' '}
            <Text style={styles.termsLink}>Politique de confidentialité</Text>.
          </Text>

          {/* Login link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16 },
  backButton: { padding: 4, alignSelf: 'flex-start', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.onSurface },
  subtitle: { fontSize: 15, color: Colors.onSurfaceVariant, marginTop: 4, marginBottom: 32 },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12, paddingHorizontal: 16, height: 52,
    borderWidth: 1, borderColor: Colors.surfaceContainerHigh,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: Colors.onSurface },
  button: {
    backgroundColor: Colors.primary, borderRadius: 12, height: 52,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 16, fontWeight: '700', color: Colors.onPrimary },
  termsText: { fontSize: 12, color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: 24, lineHeight: 18 },
  termsLink: { color: Colors.primary, fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, marginBottom: 16 },
  loginText: { fontSize: 14, color: Colors.onSurfaceVariant },
  loginLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});

export default RegisterScreen;
