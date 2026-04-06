import { MaterialIcons } from '@expo/vector-icons';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

const ReviewItem = ({ review }) => {
  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <View style={styles.reviewerAvatar}>
            <Text style={styles.avatarText}>{review.reviewer[0]}</Text>
          </View>
          <View>
            <Text style={styles.reviewerName}>{review.reviewer}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>
        <View style={styles.starsContainer}>
          {[...Array(review.rating)].map((_, i) => (
            <MaterialIcons key={i} name="star" size={12} color={Colors.tertiary} />
          ))}
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );
};

const GalleryGrid = ({ images }) => {
  return (
    <View style={styles.galleryContainer}>
      {images.slice(0, 4).map((image, index) => (
        <Image
          key={index}
          source={{ uri: image }}
          style={[
            styles.galleryImage,
            index === 1 && styles.galleryImageTall,
          ]}
          resizeMode="cover"
        />
      ))}
    </View>
  );
};

export const ProfileScreen = ({ route, navigation }) => {
  const { sitter } = route.params || {};
  
  if (!sitter) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Sitter not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: sitter.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroGradient} />
          
          {/* Back and Favorite buttons */}
          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow_back" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.favoriteButton}>
              <MaterialIcons name="favorite" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.mainContent}>
          {/* Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{sitter.name}, Amoureuse des animaux</Text>
              <View style={styles.locationRow}>
                <MaterialIcons name="location_on" size={18} color={Colors.secondary} />
                <Text style={styles.locationText}>{sitter.location || 'Lyon, 69002'}</Text>
              </View>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{sitter.rating}/5</Text>
                <Text style={styles.statLabel}>Avis</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>150+</Text>
                <Text style={styles.statLabel}>Gardes</Text>
              </View>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBar} />
              <Text style={styles.sectionTitle}>À propos</Text>
            </View>
            <View style={styles.aboutBox}>
              <Text style={styles.aboutText}>
                "J'ai grandi avec des chiens et je serais ravie de m'occuper du vôtre. Mon
                appartement est situé juste à côté d'un grand parc, parfait pour les longues
                promenades quotidiennes..."
              </Text>
              <View style={styles.servicesChips}>
                {['Promenade', 'Hébergement', 'Soins d\'urgence'].map((service) => (
                  <View key={service} style={styles.serviceChip}>
                    <Text style={styles.serviceChipText}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Gallery */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderWithButton}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleBar} />
                <Text style={styles.sectionTitle}>Galerie d'animaux gardés</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAllLink}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <GalleryGrid images={sitter.gallery || []} />
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBar} />
              <Text style={styles.sectionTitle}>Avis récents</Text>
            </View>
            <View style={styles.reviewsContainer}>
              {sitter.reviews_data && sitter.reviews_data.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity
              style={styles.ctaButtonPrimary}
              onPress={() => navigation.navigate('Booking', { sitter })}
            >
              <Text style={styles.ctaButtonText}>Demander une garde</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctaButtonSecondary}
              onPress={() => navigation.navigate('Messages', {
                screen: 'Chat',
                params: { conversation: { id: sitter.id, name: sitter.name, image: sitter.image, online: true } },
              })}
            >
              <MaterialIcons name="chat" size={18} color={Colors.primary} />
              <Text style={styles.ctaButtonSecondaryText}>Envoyer un message</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 20 }} />
        </View>
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
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 320,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'rgba(248, 249, 250, 0.6)',
  },
  heroButtons: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    marginTop: -80,
    paddingHorizontal: 16,
    paddingBottom: 20,
    zIndex: 1,
  },
  profileHeader: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  profileInfo: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.tertiaryFixed,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onTertiaryFixed,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onTertiaryFixedVariant,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionHeaderWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleBar: {
    width: 6,
    height: 32,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  seeAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  aboutBox: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
  },
  aboutText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 12,
  },
  servicesChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  serviceChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryImage: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryImageTall: {
    height: 248,
  },
  reviewsContainer: {
    gap: 12,
  },
  reviewItem: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSecondaryFixed,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  reviewDate: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  ctaContainer: {
    gap: 12,
    marginTop: 16,
  },
  ctaButtonPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  ctaButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  ctaButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default ProfileScreen;
