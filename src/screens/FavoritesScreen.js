import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { mockDogSitters } from '../constants/mockData';

const FavoriteCard = ({ sitter, onRemove, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <Image source={{ uri: sitter.image }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardName}>{sitter.name}</Text>
        {sitter.certified && (
          <MaterialIcons name="verified" size={16} color={Colors.secondary} />
        )}
      </View>
      <View style={styles.cardLocation}>
        <MaterialIcons name="location-on" size={14} color={Colors.onSurfaceVariant} />
        <Text style={styles.cardLocationText}>{sitter.location}</Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.cardRating}>
          <MaterialIcons name="star" size={14} color={Colors.tertiary} />
          <Text style={styles.cardRatingText}>{sitter.rating} ({sitter.reviews})</Text>
        </View>
        <Text style={styles.cardPrice}>{sitter.price}€/jour</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
      <MaterialIcons name="favorite" size={22} color={Colors.error} />
    </TouchableOpacity>
  </TouchableOpacity>
);

export const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState(mockDogSitters.slice(0, 3));

  const handleRemove = (id) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes favoris</Text>
        <Text style={styles.count}>{favorites.length}</Text>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FavoriteCard
              sitter={item}
              onRemove={() => handleRemove(item.id)}
              onPress={() => navigation.navigate('Home', { screen: 'Profile', params: { sitter: item } })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="favorite-border" size={64} color={Colors.outlineVariant} />
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez des gardiens à vos favoris pour les retrouver facilement.
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('Search')}>
            <Text style={styles.emptyButtonText}>Rechercher des gardiens</Text>
          </TouchableOpacity>
        </View>
      )}
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
  count: {
    fontSize: 14, fontWeight: '700', color: Colors.onPrimary,
    backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12,
  },
  list: { padding: 16 },
  card: {
    flexDirection: 'row', backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16, marginBottom: 12, overflow: 'hidden',
    elevation: 2, shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8,
  },
  cardImage: { width: 100, height: 120 },
  cardContent: { flex: 1, padding: 14, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardName: { fontSize: 16, fontWeight: '700', color: Colors.onSurface },
  cardLocation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardLocationText: { fontSize: 12, color: Colors.onSurfaceVariant },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardRatingText: { fontSize: 12, color: Colors.onSurfaceVariant },
  cardPrice: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  removeButton: {
    position: 'absolute', top: 10, right: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center',
  },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.onSurface, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  emptyButton: {
    marginTop: 24, backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
  },
  emptyButtonText: { fontSize: 14, fontWeight: '700', color: Colors.onPrimary },
});

export default FavoritesScreen;
