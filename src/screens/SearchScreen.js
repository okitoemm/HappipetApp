import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
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
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" size={12} color={Colors.onSecondaryFixed} />
                <Text style={styles.verifiedText}>Vérifié</Text>
              </View>
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
          <View style={styles.serviceItem}>
            <MaterialIcons name="pets" size={14} color={Colors.secondary} />
            <Text style={styles.serviceText}>Accepte grands chiens</Text>
          </View>
          <View style={styles.serviceItem}>
            <MaterialIcons name="home_health" size={14} color={Colors.secondary} />
            <Text style={styles.serviceText}>Soins médicaux</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const SearchScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('Prix');
  const filters = ['Prix', "Type d'hébergement", 'Disponibilité', 'Rayon +5km'];

  const handleSitterPress = (sitter) => {
    navigation.navigate('ProfileSearch', { sitter });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={18} color={Colors.outline} />
          <Text style={styles.searchBoxText}>Paris, France</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="tune" size={20} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
          <Text style={styles.resultsCount}>{mockDogSitters.length} dogsitters à Paris</Text>
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
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  searchBoxText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filtersContainer: {
    marginVertical: 12,
    paddingBottom: 8,
  },
  resultsHeader: {
    marginVertical: 16,
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
