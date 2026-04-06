import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DogSitterCard, FilterChip, Header, SearchInput } from '../components';
import Colors from '../constants/colors';
import { mockDogSitters } from '../constants/mockData';

export const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('Chien');

  const animals = ['Chien', 'Chat', 'Autre'];

  const handleSitterPress = (sitter) => {
    navigation.navigate('Profile', { sitter });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.section}>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Où voulez-vous faire{'\n'}garder votre compagnon ?</Text>
            <Text style={styles.subtitle}>Trouvez le gardien idéal près de chez vous.</Text>
          </View>

          <View style={styles.searchCard}>
            <SearchInput icon="location_on" placeholder="Ville ou code postal" onChangeText={setLocation} />
            <View style={styles.dateInput}>
              <MaterialIcons name="calendar_month" size={20} color={Colors.primary} />
              <View style={styles.dateInputText}>
                <Text style={styles.dateLabel}>Quand ?</Text>
                <Text style={styles.dateValue}>Ajouter des dates</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Filters */}
        <View style={styles.filtersSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
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
          </ScrollView>
        </View>

        {/* Popular Sitters */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dogsitters populaires près de chez vous</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.seeAllButton}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {mockDogSitters.slice(0, 3).map((sitter) => (
            <DogSitterCard
              key={sitter.id}
              sitter={sitter}
              onPress={() => handleSitterPress(sitter)}
            />
          ))}
        </View>

        {/* Extra space for bottom navigation */}
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
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  searchCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 8,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
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
    fontSize: 11,
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
  filtersSection: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterScroll: {
    flexGrow: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  seeAllButton: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default HomeScreen;
