import { MaterialIcons } from '@expo/vector-icons';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

export const BookingConfirmationScreen = ({ route, navigation }) => {
  const { sitter, service, dates, total } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <View style={styles.successCircle}>
            <MaterialIcons name="check" size={48} color={Colors.onPrimary} />
          </View>
        </View>

        <Text style={styles.title}>Réservation confirmée !</Text>
        <Text style={styles.subtitle}>
          Votre demande de garde a été envoyée à {sitter?.name || 'le gardien'}.
          Vous recevrez une confirmation sous peu.
        </Text>

        {/* Booking Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Gardien</Text>
            <Text style={styles.detailValue}>{sitter?.name || '-'}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="wb-sunny" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{service?.label || '-'}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="calendar-today" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Durée</Text>
            <Text style={styles.detailValue}>{dates?.length || 0} jour(s)</Text>
          </View>
          <View style={[styles.detailRow, styles.detailRowTotal]}>
            <MaterialIcons name="credit-card" size={20} color={Colors.primary} />
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={styles.detailValueTotal}>{total || 0}€</Text>
          </View>
        </View>

        <Text style={styles.refText}>Réf. #HP-{Date.now().toString().slice(-6)}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => {
            navigation.popToTop();
            navigation.navigate('Messages');
          }}
        >
          <MaterialIcons name="chat" size={18} color={Colors.primary} />
          <Text style={styles.messageButtonText}>Envoyer un message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => {
            navigation.popToTop();
          }}
        >
          <Text style={styles.homeButtonText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    marginBottom: 24,
  },
  successCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onSurface,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 20,
    marginTop: 32,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
  },
  detailRowTotal: {
    borderBottomWidth: 0,
    paddingTop: 16,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  detailValueTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  refText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 16,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  messageButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  homeButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.primary,
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
});

export default BookingConfirmationScreen;
