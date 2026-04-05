# Happipet - Application Mobile React Native Expo

Happipet est une application mobile qui met en relation des propriétaires de chiens avec des dogsitters qualifiés pour la garde d'animaux.

## Architecture du Projet

```
src/
├── screens/           # Écrans de l'application
│   ├── HomeScreen.js         # Page d'accueil avec recherche
│   ├── SearchScreen.js       # Résultats de recherche
│   ├── ProfileScreen.js      # Profil détaillé du dogsitter
│   └── MessagesScreen.js     # Messagerie
├── components/        # Composants réutilisables
│   ├── Header.js            # Barre d'en-tête
│   ├── DogSitterCard.js     # Carte de dogsitter
│   ├── SearchInput.js       # Input de recherche
│   ├── FilterChip.js        # Chips de filtrage
│   └── ConversationItem.js  # Item de conversation
├── navigation/        # Système de navigation
│   └── RootNavigator.js     # Configuration React Navigation
├── constants/         # Constantes de l'application
│   ├── colors.js           # Design palette Material Design 3
│   └── mockData.js         # Données de test
└── utils/            # Utilitaires
```

## Screens Principales

### 1. **HomeScreen** 🏠
- Barre de recherche avec localisation et calendrier
- Filtres rapides par type d'animal (Chien, Chat, Autre)
- Liste des dogsitters populaires
- Cartes avec notation, prix et services

### 2. **SearchScreen** 🔍
- Barre de recherche persistante
- Filtres avancés (Prix, Type d'hébergement, Disponibilité, Rayon)
- Grille de résultats avec images et détails
- Badges de vérification

### 3. **ProfileScreen** 👤
- Photo héros du dogsitter
- Boutons de retour et favoris
- Informations de base (nom, localisation, notation)
- Section "À propos" avec services
- Galerie d'animaux gardés (layout Bento Grid)
- Section des avis récents
- Boutons d'action (Demander une garde, Envoyer un message)

### 4. **MessagesScreen** 💬
- Stories style Facebook/Instagram
- Filtres (Tout, Non lus, Archivés)
- Liste des conversations actives
- Indicateurs en ligne et badges non-lus

## Design System

### Couleurs (Material Design 3)
- **Primary**: #8f4e00 (Orange)
- **Secondary**: #356094 (Bleu)
- **Tertiary**: #705d00 (Or)
- **Surface Colors**: Nuances de gris/blanc
- **Accent Colors**: Verts, oranges pour les highlights

### Typographie
- **Font**: Plus Jakarta Sans
- **Tailles**: Body (14px), Titles (18-28px), Labels (12px)

### Composants
- **Cards**: Bordure radius 16px, elevation légère
- **Buttons**: Radius 12px, Primary/Secondary variants
- **Inputs**: Radius 12px, avec icônes Material Icons
- **Chips**: Radius 20px, pour les filtres

## Installation

### Prérequis
- Node.js 16+
- npm ou yarn
- Expo CLI

### Étapes d'installation

```bash
# 1. Naviguer vers le projet
cd /Users/user/Documents/🍎0REPUTTYAPPS/HappipetApp

# 2. Installer les dépendances (déjà faites)
npm install

# 3. Lancer l'application

# Pour iOS (simulateur)
npm run ios
# ou
expo start --ios

# Pour Android (émulateur)
npm run android
# ou
expo start --android

# Pour le web
npm run web
# ou
expo start --web

# Ou simplement
npm start  # ou expo start
```

## Structure des Données

### DogSitter
```javascript
{
  id: string,
  name: string,
  location: string,
  rating: number,
  reviews: number,
  price: number,
  certified: boolean,
  topSitter: boolean,
  image: string,
  tags: string[],
  description: string,
  services: string[],
  gallery: string[],
  reviews_data: Review[]
}
```

### Conversation
```javascript
{
  id: string,
  name: string,
  context: string,
  lastMessage: string,
  timestamp: string,
  unread: boolean,
  online: boolean,
  image: string,
  unreadCount?: number
}
```

## Navigation

L'application utilise **React Navigation** avec:
- **BottomTabNavigator**: 4 onglets (Accueil, Recherche, Messages, Profil)
- **NativeStackNavigator**: Pour les transitions entre les écrans

```
RootNavigator (BottomTabNavigator)
├── Home (Stack)
│   ├── HomeScreen
│   └── ProfileScreen
├── Search (Stack)
│   ├── SearchScreen
│   └── ProfileScreen
├── Messages (Stack)
│   └── MessagesScreen
└── Profile (Tab)
    └── PlaceholderScreen
```

## Dépendances Principales

```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "@react-navigation/stack": "^6.x",
  "react-native-screens": "^3.x",
  "react-native-safe-area-context": "^4.x",
  "react-native-gesture-handler": "^2.x",
  "react-native-reanimated": "^3.x",
  "@react-native-async-storage/async-storage": "^1.x",
  "@expo/vector-icons": "^13.x",
  "expo": "^50.x"
}
```

## Utilisation des Maquettes

L'application suit fidèlement les maquettes HTML/CSS fournies:

✅ **Accueil** - Barre de recherche + filtres + liste populaires
✅ **Profil** - Page complète avec hero image, galerie, avis
✅ **Recherche** - Filtres + grille de résultats
✅ **Messagerie** - Conversations avec stories

Tous les éléments visuels, couleurs et layouts respectent le design Material Design 3 des maquettes.

## Prochaines Étapes

- [ ] Intégration Backend API
- [ ] Authentification utilisateur
- [ ] Système de paiement
- [ ] Push notifications
- [ ] Géolocalisation
- [ ] Stockage localisé (AsyncStorage)
- [ ] Tests unitaires et E2E
- [ ] Builds production iOS/Android

## Développement

### Hot Reload
Appuyez sur 'r' dans le terminal Expo pour recharger l'application.

### Debugging
- Utilisez `console.log()` dans le terminal Expo
- Utilisez React DevTools avec Expo
- Utilisez la commande `expo start --localhost`

## Support

Pour toute question ou problème, consultez la [documentation Expo](https://docs.expo.dev/) ou la [documentation React Navigation](https://reactnavigation.org/).

---

**Développé avec ❤️ pour Happipet**
