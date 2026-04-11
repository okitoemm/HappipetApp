import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { resetPassword } from '../services/auth';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre email.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <MaterialIcons name="mark-email-read" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.successTitle}>Email envoyé !</Text>
          <Text style={styles.successText}>
            Vérifiez votre boîte mail à {email} et suivez les instructions pour réinitialiser votre mot de passe.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
          </TouchableOpacity>

          <Text style={styles.title}>Mot de passe oublié</Text>
          <Text style={styles.subtitle}>
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </Text>

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

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.onPrimary} />
            ) : (
              <Text style={styles.buttonText}>Envoyer le lien</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  backButton: { padding: 4, alignSelf: 'flex-start', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.onSurface },
  subtitle: { fontSize: 15, color: Colors.onSurfaceVariant, marginTop: 8, marginBottom: 32, lineHeight: 22 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12, paddingHorizontal: 16, height: 52,
    borderWidth: 1, borderColor: Colors.surfaceContainerHigh, marginBottom: 24,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: Colors.onSurface },
  button: {
    backgroundColor: Colors.primary, borderRadius: 12, height: 52,
    justifyContent: 'center', alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 16, fontWeight: '700', color: Colors.onPrimary },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  successCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  successTitle: { fontSize: 24, fontWeight: '800', color: Colors.onSurface, marginBottom: 12 },
  successText: { fontSize: 15, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
});

export default ForgotPasswordScreen;
