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
import { supabase } from '../lib/supabase';

export const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
    } catch (error) {
      const msg = error.message || '';
      if (msg.toLowerCase().includes('email not confirmed')) {
        Alert.alert(
          'Email non confirmé',
          'Votre adresse email n\'a pas encore été confirmée. Voulez-vous recevoir un nouvel email de confirmation ?',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Renvoyer',
              onPress: async () => {
                try {
                  await supabase.auth.resend({ type: 'signup', email: email.trim() });
                  Alert.alert('Email envoyé', 'Vérifiez votre boîte mail et cliquez sur le lien de confirmation.');
                } catch {
                  Alert.alert('Erreur', 'Impossible d\'envoyer l\'email.');
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Erreur de connexion', msg || 'Email ou mot de passe incorrect.');
      }
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
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="pets" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.appName}>Happipet</Text>
            <Text style={styles.tagline}>La garde d'animaux entre particuliers</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
                placeholder="Mot de passe"
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

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.onPrimary} />
              ) : (
                <Text style={styles.buttonText}>Se connecter</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          {/* Social */}
          <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Google', 'Connexion Google bientôt disponible.')}>
            <MaterialIcons name="public" size={20} color={Colors.onSurface} />
            <Text style={styles.socialButtonText}>Continuer avec Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Apple', 'Connexion Apple bientôt disponible.')}>
            <MaterialIcons name="apple" size={20} color={Colors.onSurface} />
            <Text style={styles.socialButtonText}>Continuer avec Apple</Text>
          </TouchableOpacity>

          {/* Sign up link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Pas encore de compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>S'inscrire</Text>
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
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  appName: { fontSize: 32, fontWeight: '800', color: Colors.primary },
  tagline: { fontSize: 14, color: Colors.onSurfaceVariant, marginTop: 4 },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12, paddingHorizontal: 16, height: 52,
    borderWidth: 1, borderColor: Colors.surfaceContainerHigh,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: Colors.onSurface },
  forgotText: { fontSize: 13, color: Colors.primary, fontWeight: '600', textAlign: 'right' },
  button: {
    backgroundColor: Colors.primary, borderRadius: 12, height: 52,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 16, fontWeight: '700', color: Colors.onPrimary },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  divider: { flex: 1, height: 1, backgroundColor: Colors.surfaceContainerHigh },
  dividerText: { marginHorizontal: 16, fontSize: 13, color: Colors.onSurfaceVariant },
  socialButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12, height: 48, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.surfaceContainerHigh, gap: 8,
  },
  socialButtonText: { fontSize: 15, fontWeight: '600', color: Colors.onSurface },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, marginBottom: 16 },
  signupText: { fontSize: 14, color: Colors.onSurfaceVariant },
  signupLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});

export default LoginScreen;
