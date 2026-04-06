import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
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

const DATES = [
  { day: 'Lun', date: '7', month: 'Avr' },
  { day: 'Mar', date: '8', month: 'Avr' },
  { day: 'Mer', date: '9', month: 'Avr' },
  { day: 'Jeu', date: '10', month: 'Avr' },
  { day: 'Ven', date: '11', month: 'Avr' },
  { day: 'Sam', date: '12', month: 'Avr' },
  { day: 'Dim', date: '13', month: 'Avr' },
];

const SERVICES = [
  { id: 'walk', icon: 'directions-walk', label: 'Promenade', price: 15 },
  { id: 'hosting', icon: 'home', label: 'Hébergement', price: 25 },
  { id: 'daycare', icon: 'wb-sunny', label: 'Garde journée', price: 20 },
  { id: 'medical', icon: 'healing', label: 'Soins médicaux', price: 30 },
];

const PETS = [
  { id: '1', name: 'Rex', breed: 'Golden Retriever', image: 'https://images.unsplash.com/photo-1552053831-71594a27c62d?w=200&h=200&fit=crop' },
  { id: '2', name: 'Luna', breed: 'Berger Australien', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop' },
];

export const BookingScreen = ({ route, navigation }) => {
  const { sitter } = route.params || {};
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);

  const toggleDate = (date) => {
    setSelectedDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const selectedServiceData = SERVICES.find(s => s.id === selectedService);
  const totalPrice = selectedServiceData ? selectedServiceData.price * Math.max(selectedDates.length, 1) : 0;

  const canBook = selectedDates.length > 0 && selectedService && selectedPet;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Réserver une garde</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Sitter Info */}
        {sitter && (
          <View style={styles.sitterCard}>
            <Image source={{ uri: sitter.image }} style={styles.sitterImage} />
            <View style={styles.sitterInfo}>
              <Text style={styles.sitterName}>{sitter.name}</Text>
              <View style={styles.sitterRating}>
                <MaterialIcons name="star" size={16} color={Colors.tertiary} />
                <Text style={styles.sitterRatingText}>{sitter.rating} ({sitter.reviews} avis)</Text>
              </View>
              <Text style={styles.sitterPrice}>À partir de {sitter.price}€/jour</Text>
            </View>
          </View>
        )}

        {/* Select Pet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quel animal ?</Text>
          <View style={styles.petsRow}>
            {PETS.map(pet => (
              <TouchableOpacity
                key={pet.id}
                style={[styles.petCard, selectedPet === pet.id && styles.petCardSelected]}
                onPress={() => setSelectedPet(pet.id)}
              >
                <Image source={{ uri: pet.image }} style={styles.petImage} />
                <Text style={[styles.petName, selectedPet === pet.id && styles.petNameSelected]}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.breed}</Text>
                {selectedPet === pet.id && (
                  <View style={styles.petCheck}>
                    <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Select Service */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type de service</Text>
          {SERVICES.map(service => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceItem, selectedService === service.id && styles.serviceItemSelected]}
              onPress={() => setSelectedService(service.id)}
            >
              <View style={[styles.serviceIcon, selectedService === service.id && styles.serviceIconSelected]}>
                <MaterialIcons name={service.icon} size={22} color={selectedService === service.id ? Colors.onPrimary : Colors.onSurfaceVariant} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>{service.label}</Text>
                <Text style={styles.servicePrice}>{service.price}€/jour</Text>
              </View>
              <View style={[styles.radio, selectedService === service.id && styles.radioSelected]}>
                {selectedService === service.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Select Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quand ?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DATES.map(d => (
              <TouchableOpacity
                key={d.date}
                style={[styles.dateCard, selectedDates.includes(d.date) && styles.dateCardSelected]}
                onPress={() => toggleDate(d.date)}
              >
                <Text style={[styles.dateDay, selectedDates.includes(d.date) && styles.dateDaySelected]}>{d.day}</Text>
                <Text style={[styles.dateNumber, selectedDates.includes(d.date) && styles.dateNumberSelected]}>{d.date}</Text>
                <Text style={[styles.dateMonth, selectedDates.includes(d.date) && styles.dateMonthSelected]}>{d.month}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Price Summary */}
        {canBook && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Résumé</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{selectedServiceData?.label} × {selectedDates.length} jour(s)</Text>
              <Text style={styles.summaryValue}>{totalPrice}€</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frais de service</Text>
              <Text style={styles.summaryValue}>{Math.round(totalPrice * 0.1)}€</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>{totalPrice + Math.round(totalPrice * 0.1)}€</Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <View style={styles.ctaPriceContainer}>
          <Text style={styles.ctaTotal}>{totalPrice + Math.round(totalPrice * 0.1)}€</Text>
          <Text style={styles.ctaSubtotal}>{selectedDates.length} jour(s)</Text>
        </View>
        <TouchableOpacity
          style={[styles.ctaButton, !canBook && styles.ctaButtonDisabled]}
          disabled={!canBook}
          onPress={() => navigation.navigate('BookingConfirmation', { sitter, service: selectedServiceData, dates: selectedDates, total: totalPrice + Math.round(totalPrice * 0.1) })}
        >
          <Text style={styles.ctaButtonText}>Confirmer la réservation</Text>
        </TouchableOpacity>
      </View>
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
  scrollView: { flex: 1 },
  sitterCard: {
    flexDirection: 'row', padding: 16, margin: 16,
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16,
    elevation: 2, shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8,
  },
  sitterImage: { width: 60, height: 60, borderRadius: 30, marginRight: 14 },
  sitterInfo: { flex: 1, justifyContent: 'center' },
  sitterName: { fontSize: 17, fontWeight: '700', color: Colors.onSurface },
  sitterRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  sitterRatingText: { fontSize: 13, color: Colors.onSurfaceVariant },
  sitterPrice: { fontSize: 14, fontWeight: '600', color: Colors.primary, marginTop: 4 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.onSurface, marginBottom: 14 },
  petsRow: { flexDirection: 'row', gap: 12 },
  petCard: {
    alignItems: 'center', padding: 14, borderRadius: 16, flex: 1,
    backgroundColor: Colors.surfaceContainerLowest, borderWidth: 2, borderColor: 'transparent',
  },
  petCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryContainer + '20' },
  petImage: { width: 56, height: 56, borderRadius: 28, marginBottom: 8 },
  petName: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  petNameSelected: { color: Colors.primary },
  petBreed: { fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2, textAlign: 'center' },
  petCheck: { position: 'absolute', top: 8, right: 8 },
  serviceItem: {
    flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 10,
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14, borderWidth: 2, borderColor: 'transparent',
  },
  serviceItemSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryContainer + '20' },
  serviceIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  serviceIconSelected: { backgroundColor: Colors.primary },
  serviceInfo: { flex: 1 },
  serviceLabel: { fontSize: 15, fontWeight: '600', color: Colors.onSurface },
  servicePrice: { fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.outline,
    justifyContent: 'center', alignItems: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  dateCard: {
    alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, marginRight: 10,
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14, borderWidth: 2, borderColor: 'transparent',
  },
  dateCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryContainer },
  dateDay: { fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant },
  dateDaySelected: { color: Colors.onPrimaryContainer },
  dateNumber: { fontSize: 22, fontWeight: '800', color: Colors.onSurface, marginVertical: 2 },
  dateNumberSelected: { color: Colors.onPrimaryContainer },
  dateMonth: { fontSize: 11, color: Colors.onSurfaceVariant },
  dateMonthSelected: { color: Colors.onPrimaryContainer },
  summaryCard: {
    margin: 16, padding: 16, backgroundColor: Colors.surfaceContainerLowest, borderRadius: 16,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: Colors.onSurface, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  summaryLabel: { fontSize: 14, color: Colors.onSurfaceVariant },
  summaryValue: { fontSize: 14, fontWeight: '600', color: Colors.onSurface },
  summaryTotal: { borderTopWidth: 1, borderTopColor: Colors.surfaceContainerHigh, marginTop: 8, paddingTop: 12 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: Colors.onSurface },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  ctaContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.surfaceContainerHigh,
  },
  ctaPriceContainer: {},
  ctaTotal: { fontSize: 22, fontWeight: '800', color: Colors.onSurface },
  ctaSubtotal: { fontSize: 12, color: Colors.onSurfaceVariant },
  ctaButton: {
    backgroundColor: Colors.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14,
  },
  ctaButtonDisabled: { backgroundColor: Colors.surfaceContainerHigh },
  ctaButtonText: { fontSize: 15, fontWeight: '700', color: Colors.onPrimary },
});

export default BookingScreen;
