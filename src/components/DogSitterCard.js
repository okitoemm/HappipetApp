import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export const DogSitterCard = ({ sitter, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: sitter.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={14} color="#ffc107" />
          <Text style={styles.ratingText}>{sitter.rating}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{sitter.name}</Text>
            <View style={styles.certificationRow}>
              {sitter.certified && (
                <>
                  <MaterialIcons name="verified" size={14} color={Colors.secondary} />
                  <Text style={styles.certificationText}>Gardienne certifiée</Text>
                </>
              )}
              {sitter.topSitter && (
                <>
                  <MaterialIcons name="shield" size={14} color={Colors.secondary} />
                  <Text style={styles.certificationText}>Top Gardien</Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{sitter.price}€</Text>
            <Text style={styles.priceLabel}>par jour</Text>
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          {sitter.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
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
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  certificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certificationText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  priceLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.secondaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSecondaryFixed,
    textTransform: 'uppercase',
  },
});

export default DogSitterCard;
