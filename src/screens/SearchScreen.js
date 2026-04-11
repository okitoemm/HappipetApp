import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Image,
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
import { mockDogSitters } from '../constants/mockData';

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
  const [searchActive, setSearchActive] = useState(false);
  const filters = ['Prix', "Type d'hébergement", 'Disponibilité', 'Rayon +5km'];
  const animals = ['Chien', 'Chat', 'Autre'];

  const handleSitterPress = (sitter) => {
    navigation.navigate('ProfileSearch', { sitter });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>Où voulez-vous faire{'\n'}garder votre compagnon ?</Text>
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
              />
            </View>
            <View style={styles.dateInput}>
              <MaterialIcons name="event" size={20} color={Colors.primary} />
              <View style={styles.dateInputText}>
                <Text style={styles.dateLabel}>Quand ?</Text>
                <Text style={styles.dateValue}>Ajouter des dates</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.searchCta} onPress={() => setSearchActive(true)}>
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
                  color={
                    selectedAnimal === animal
                      ? Colors.onPrimaryContainer
                      : Colors.onSurface
                  }
                />
              }
            />
          ))}
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              selected={selectedFilter === filter}
              onPress={() => setSelectedFilter(filter)}
            />
          ))}
        </ScrollView>

        {/* Results Title */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>{mockDogSitters.length} dogsitters{location ? ` à ${location}` : ' à Paris'}</Text>
          <Text style={styles.resultsSubtitle}>
            Disponibles pour vos dates sélectionnées
          </Text>
        </View>

        {/* Results Grid */}
        <View style={styles.resultsContainer}>
          {mockDogSitters.map((sitter) => (
            <SearchResultCard
              key={sitter.id}
              sitter={sitter}
              onPress={() => handleSitterPress(sitter)}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
});

export default SearchScreen;
