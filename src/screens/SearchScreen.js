import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterChip } from '../components';
import Colors from '../constants/colors';

const WEEK_DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS    = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

function generateSearchDates() {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day:   WEEK_DAYS[d.getDay()],
      date:  d.getDate().toString(),
      month: MONTHS[d.getMonth()],
      iso:   d.toISOString().split('T')[0],
    };
  });
}
const SEARCH_DATES = generateSearchDates();
import { getSitters } from '../services/api';

const SearchResultCard = ({ sitter, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.resultImageContainer}>
        <Image
          source={{ uri: sitter.image }}
          style={styles.resultImage}
          resizeMode="cover"
        />
        <View style={styles.resultRatingBadge}>
          <MaterialIcons name="star" size={14} color="#ffc107" />
          <Text style={styles.resultRatingText}>{sitter.rating}</Text>
        </View>
      </View>

      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <View style={styles.resultInfo}>
            <View style={styles.resultTitleRow}>
              <Text style={styles.resultTitle}>{sitter.name}</Text>
              {sitter.certified && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={12} color={Colors.onSecondaryFixed} />
                  <Text style={styles.verifiedText}>Vérifié</Text>
                </View>
              )}
              {sitter.topSitter && (
                <View style={styles.topBadge}>
                  <Text style={styles.topBadgeText}>TOP</Text>
                </View>
              )}
            </View>
            <Text style={styles.resultLocation}>{sitter.location}</Text>
          </View>
          <View style={styles.resultPriceContainer}>
            <Text style={styles.resultPrice}>{sitter.price}€</Text>
            <Text style={styles.resultPriceLabel}>/ jour</Text>
          </View>
        </View>

        <Text numberOfLines={2} style={styles.resultDescription}>
          {sitter.description}
        </Text>

        <View style={styles.resultServices}>
          {(sitter.tags || []).slice(0, 2).map((tag) => (
            <View key={tag} style={styles.serviceItem}>
              <MaterialIcons name="check-circle" size={14} color={Colors.secondary} />
              <Text style={styles.serviceText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const SearchScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('Prix');
  const [location, setLocation] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('Chien');
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [searchDates, setSearchDates] = useState([]);

  const toggleSearchDate = (iso) => {
    setSearchDates(prev =>
      prev.includes(iso) ? prev.filter(d => d !== iso) : [...prev, iso]
    );
  };

  const dateDisplayText = searchDates.length === 0
    ? 'Ajouter des dates'
    : searchDates.length === 1
      ? new Date(searchDates[0]).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      : `${searchDates.length} jours sélectionnés`;
  const filters = ['Prix', "Type d'hébergement", 'Disponibilité', 'Rayon +5km'];
  const animals = ['Chien', 'Chat', 'Autre'];

  const fetchSitters = useCallback(async (city = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSitters({ city: city || undefined });
      setSitters(data);
    } catch (e) {
      setError('Impossible de charger les gardiens.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSitters();
  }, [fetchSitters]);

  const handleSearch = () => fetchSitters(location);

  const handleSitterPress = (sitter) => {
    navigation.navigate('ProfileSearch', { sitter });
  };

  const ListHeader = (
    <View>
      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.searchTitle}>Où voulez-vous faire{"\n"}garder votre compagnon ?</Text>
        <Text style={styles.searchSubtitle}>Trouvez le gardien idéal près de chez vous.</Text>
        <View style={styles.searchCard}>
          <View style={styles.searchInputRow}>
            <MaterialIcons name="location-on" size={20} color={Colors.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Ville ou code postal"
              placeholderTextColor={Colors.outlineVariant}
              value={location}
              onChangeText={setLocation}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity style={styles.dateInput} onPress={() => setDateModalVisible(true)} activeOpacity={0.7}>
            <MaterialIcons name="event" size={20} color={Colors.primary} />
            <View style={styles.dateInputText}>
              <Text style={styles.dateLabel}>Quand ?</Text>
              <Text style={[styles.dateValue, searchDates.length > 0 && { color: Colors.primary }]}>{dateDisplayText}</Text>
            </View>
            {searchDates.length > 0 && (
              <TouchableOpacity onPress={() => setSearchDates([])}>
                <MaterialIcons name="close" size={18} color={Colors.outline} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchCta} onPress={handleSearch}>
            <MaterialIcons name="search" size={20} color={Colors.onPrimary} />
            <Text style={styles.searchCtaText}>Rechercher</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Animal Filters */}
      <View style={styles.animalFilters}>
        {animals.map((animal) => (
          <FilterChip
            key={animal}
            label={animal}
            selected={selectedAnimal === animal}
            onPress={() => setSelectedAnimal(animal)}
            icon={
              <MaterialIcons
                name="pets"
                size={16}
                color={selectedAnimal === animal ? Colors.onPrimaryContainer : Colors.onSurface}
              />
            }
          />
        ))}
      </View>

      {/* Filters */}
      <FlatList
        data={filters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={styles.filtersContainer}
        renderItem={({ item }) => (
          <FilterChip
            label={item}
            selected={selectedFilter === item}
            onPress={() => setSelectedFilter(item)}
          />
        )}
      />

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {loading ? 'Chargement...' : `${sitters.length} gardien${sitters.length !== 1 ? 's' : ''}${location ? ` à ${location}` : ''}`}
        </Text>
        <Text style={styles.resultsSubtitle}>Disponibles pour vos dates sélectionnées</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Date Picker Modal */}
      <Modal visible={dateModalVisible} transparent animationType="slide" onRequestClose={() => setDateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner des dates</Text>
              <TouchableOpacity onPress={() => setDateModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              <View style={styles.dateGrid}>
                {SEARCH_DATES.map(d => {
                  const selected = searchDates.includes(d.iso);
                  return (
                    <TouchableOpacity
                      key={d.iso}
                      style={[styles.dateGridCard, selected && styles.dateGridCardSelected]}
                      onPress={() => toggleSearchDate(d.iso)}
                    >
                      <Text style={[styles.dateGridDay, selected && styles.dateGridTextSelected]}>{d.day}</Text>
                      <Text style={[styles.dateGridNumber, selected && styles.dateGridTextSelected]}>{d.date}</Text>
                      <Text style={[styles.dateGridMonth, selected && styles.dateGridTextSelected]}>{d.month}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalConfirm}
              onPress={() => setDateModalVisible(false)}
            >
              <Text style={styles.modalConfirmText}>
                {searchDates.length === 0 ? 'Ignorer' : `Confirmer (${searchDates.length} jour${searchDates.length > 1 ? 's' : ''})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={loading || error || sitters.length === 0 ? [] : sitters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        renderItem={({ item: sitter }) => (
          <SearchResultCard
            sitter={{
              id: sitter.id,
              name: sitter.user?.full_name,
              location: sitter.location_text,
              rating: sitter.rating,
              reviews: sitter.review_count,
              price: sitter.price_per_day,
              certified: sitter.certified,
              topSitter: sitter.top_sitter,
              image: sitter.user?.avatar_url,
              tags: sitter.tags,
              description: sitter.description,
            }}
            onPress={() => handleSitterPress(sitter)}
          />
        )}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={40} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => fetchSitters(location)} style={styles.retryButton}>
                <Text style={styles.retryText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : sitters.length === 0 ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="search-off" size={40} color={Colors.onSurfaceVariant} />
              <Text style={styles.errorText}>Aucun gardien trouvé{location ? ` à ${location}` : ''}.</Text>
            </View>
          ) : null
        }
      />
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
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 6,
    lineHeight: 32,
  },
  searchSubtitle: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
    lineHeight: 20,
  },
  searchCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 10,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.onSurface,
    padding: 0,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    marginTop: 8,
  },
  dateInputText: {
    flex: 1,
    gap: 2,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  searchCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    marginTop: 10,
  },
  searchCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  animalFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filtersContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  resultsHeader: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  resultsCount: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: Colors.onSurface },
  dateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingVertical: 8 },
  dateGridCard: { width: '13%', minWidth: 44, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.outline + '40', backgroundColor: Colors.surfaceContainerLowest },
  dateGridCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryContainer + '40' },
  dateGridDay: { fontSize: 9, color: Colors.onSurfaceVariant, fontWeight: '600', textTransform: 'uppercase' },
  dateGridNumber: { fontSize: 16, fontWeight: '800', color: Colors.onSurface, marginVertical: 2 },
  dateGridMonth: { fontSize: 9, color: Colors.onSurfaceVariant },
  dateGridTextSelected: { color: Colors.primary },
  modalConfirm: { marginTop: 16, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  modalConfirmText: { fontSize: 15, fontWeight: '700', color: Colors.onPrimary },
  resultsSubtitle: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  resultsContainer: {
    gap: 12,
    paddingHorizontal: 16,
  },
  resultCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  resultImageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultRatingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  resultRatingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  resultContent: {
    padding: 16,
    gap: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: Colors.secondaryFixed,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSecondaryFixed,
    textTransform: 'uppercase',
  },
  topBadge: {
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  topBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.onTertiary,
    letterSpacing: 0.5,
  },
  resultLocation: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  resultPriceContainer: {
    alignItems: 'flex-end',
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  resultPriceLabel: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  resultDescription: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  resultServices: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  serviceText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default SearchScreen;
