// EXEMPLES D'UTILISATION DES COMPOSANTS HAPPIPET

// ============================================================================
// 1. HEADER
// ============================================================================

import { Header } from '../components';

// Utilisation simple:
<Header />

// Avec callback sur notification:
<Header 
  onNotificationPress={() => navigation.navigate('Notifications')}
/>

// Sans icône notification:
<Header showNotification={false} />


// ============================================================================
// 2. DOG SITTER CARD
// ============================================================================

import { DogSitterCard } from '../components';
import { mockDogSitters } from '../constants/mockData';

// Utilisation dans une liste:
{mockDogSitters.map((sitter) => (
  <DogSitterCard
    key={sitter.id}
    sitter={sitter}
    onPress={() => navigation.navigate('Profile', { sitter })}
  />
))}

// Structure attendue du sitter:
const sitter = {
  id: '1',
  name: 'Camille R.',
  location: 'Paris 5e',
  rating: 4.9,
  reviews: 150,
  price: 25,
  certified: true,
  topSitter: false,
  image: 'https://...', // URL valide
  tags: ['JARDIN CLOS', "PAS D'AUTRES ANIMAUX"],
  description: '...',
  services: [...],
  gallery: [...],
  reviews_data: [...]
};


// ============================================================================
// 3. SEARCH INPUT
// ============================================================================

import { SearchInput } from '../components';
import { useState } from 'react';

const MyScreen = () => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  return (
    <View>
      {/* Recherche par localisation */}
      <SearchInput 
        icon="location_on" 
        placeholder="Ville ou code postal"
        onChangeText={setLocation}
      />

      {/* Recherche par date */}
      <SearchInput 
        icon="calendar_month" 
        placeholder="Ajouter des dates"
        onChangeText={setDate}
      />

      {/* Recherche personnalisée */}
      <SearchInput 
        icon="search" 
        placeholder="Chercher..."
        onChangeText={(text) => console.log('Recherche:', text)}
      />
    </View>
  );
};


// ============================================================================
// 4. FILTER CHIP
// ============================================================================

import { FilterChip } from '../components';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/colors';

const MyScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('Chien');
  const animals = ['Chien', 'Chat', 'Autre'];

  return (
    <View style={{ flexDirection: 'row' }}>
      {animals.map((animal) => (
        <FilterChip
          key={animal}
          label={animal}
          selected={selectedFilter === animal}
          onPress={() => setSelectedFilter(animal)}
          // Optionnel: ajouter une icône
          icon={
            selectedFilter === animal ? (
              <MaterialIcons name="pets" size={16} color={Colors.onPrimaryContainer} />
            ) : null
          }
        />
      ))}
    </View>
  );
};


// ============================================================================
// 5. CONVERSATION ITEM
// ============================================================================

import { ConversationItem } from '../components';
import { mockConversations } from '../constants/mockData';

// Utilisation dans une liste:
{mockConversations.map((conversation) => (
  <ConversationItem
    key={conversation.id}
    conversation={conversation}
    onPress={() => navigation.navigate('Chat', { conversation })}
  />
))}

// Structure attendue du conversation:
const conversation = {
  id: '1',
  name: 'Marc',
  context: 'Garde de Rex terminée',
  lastMessage: 'Merci beaucoup pour la garde...',
  timestamp: '14:20',
  unread: true,
  online: true,
  image: 'https://...',
  // Optionnel:
  unreadCount: 1, // Affiche le badge
};


// ============================================================================
// NAVIGATION
// ============================================================================

// Naviguer vers un écran:
navigation.navigate('Screen', { param: value });

// Naviguer vers ProfileScreen depuis HomeScreen:
navigation.navigate('Profile', { sitter: sitterData });

// Naviguer vers ProfileScreen depuis SearchScreen:
navigation.navigate('ProfileSearch', { sitter: sitterData });

// Retourner à l'écran précédent:
navigation.goBack();

// Remplacer l'écran courant:
navigation.replace('NewScreen');

// Réinitialiser la stack:
navigation.popToTop();


// ============================================================================
// HOOKS UTILES
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

// Obtenir l'objet navigation:
const navigation = useNavigation();

// Obtenir les paramètres de route:
const route = useRoute();
const { sitter } = route.params;

// État local:
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);

// Effet au montage:
useEffect(() => {
  // Charger les données
  console.log('Component mounted');
  
  return () => {
    // Cleanup
    console.log('Component unmounted');
  };
}, []);


// ============================================================================
// FORMATTERS UTILES
// ============================================================================

import { 
  formatPrice, 
  formatDate, 
  formatTime,
  getInitials,
  truncateText,
  capitalize 
} from '../utils/formatters';

// Formats:
formatPrice(25)                    // "25.00€"
formatDate(new Date())             // "31/03/2026"
formatTime(new Date())             // "14:30"
getInitials("John Doe")            // "JD"
truncateText("Lorem ipsum dolor", 10) // "Lorem ipsu..."
capitalize("hello")                // "Hello"


// ============================================================================
// CONSTANTES UTILES
// ============================================================================

import Colors from '../constants/colors';
import { commonStyles } from '../constants/styles';
import { APP_CONFIG, STORAGE_KEYS } from '../constants/config';

// Utiliser les couleurs Material Design 3:
<View style={{ backgroundColor: Colors.primary }}>
  <Text style={{ color: Colors.onPrimary }}>Primary</Text>
</View>

// Utiliser les styles communs:
<View style={commonStyles.card}>
  <Text style={commonStyles.titleLarge}>Titre</Text>
</View>

// Utiliser la configuration:
console.log(APP_CONFIG.appName);      // "Happipet"
console.log(APP_CONFIG.currency);    // "€"


// ============================================================================
// ASYNC STORAGE
// ============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

// Sauvegarder les favoris:
const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES, 
      JSON.stringify(favorites)
    );
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Charger les favoris:
const loadFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};


// ============================================================================
// PATTERH D'UN NOUVEL ÉCRAN
// ============================================================================

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Colors from '../constants/colors';
import { Header } from '../components';

export const MyNewScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView style={styles.scrollView}>
        {/* Your content */}
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
});

export default MyNewScreen;


// ============================================================================
// BONNES PRATIQUES
// ============================================================================

// ✅ Faire:
- Utiliser les couleurs de Colors.js
- Utiliser les composants réutilisables
- Garder les files organisées par type
- Documenter le code complexe
- Utiliser des constantes plutôt que des hardcoded values

// ❌ Ne pas faire:
- N'écrivez pas les couleurs en dur (#ff0000)
- Ne créez pas des composants similaires
- Ne mélangez pas la logique avec l'UI
- N'ignorez pas les propTypes/TypeScript
- Ne pessimisez pas sans mesurer

═══════════════════════════════════════════════════════════════════════════════

Pour plus d'exemples, consultez les fichiers dans src/screens/

Happy Coding! 🎉
