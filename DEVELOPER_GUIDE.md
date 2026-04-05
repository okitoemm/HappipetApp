# Guide du Développeur - Happipet

## Structure du Projet

```
HappipetApp/
├── src/
│   ├── screens/           # Écrans de l'app
│   │   ├── HomeScreen.js
│   │   ├── SearchScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── MessagesScreen.js
│   │   └── index.js
│   ├── components/        # Composants réutilisables
│   │   ├── Header.js
│   │   ├── DogSitterCard.js
│   │   ├── SearchInput.js
│   │   ├── FilterChip.js
│   │   ├── ConversationItem.js
│   │   └── index.js
│   ├── navigation/        # Configuration de la navigation
│   │   ├── RootNavigator.js
│   │   └── index.js
│   ├── constants/         # Constantes
│   │   ├── colors.js      # Palette Material Design 3
│   │   ├── mockData.js    # Données de test
│   │   ├── config.js      # Configuration de l'app
│   │   ├── styles.js      # Styles communs
│   │   └── index.js
│   └── utils/             # Utilitaires
│       ├── formatters.js  # Formatting & helpers
│       └── index.js
├── App.js                 # Point d'entrée
├── app.json               # Configuration Expo
└── package.json
```

## Démarrage Rapidement

### Installation
```bash
cd HappipetApp
npm install
```

### Lancer l'app
```bash
npm start      # Interactive mode
npm run ios    # iOS Simulator
npm run android # Android Emulator
npm run web    # Web Browser
```

## Ajouter un Nouvel Écran

### 1. Créer le fichier d'écran
```javascript
// src/screens/NewScreen.js
import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { Header } from '../components';
import Colors from '../constants/colors';

export const NewScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {/* Your content */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
});

export default NewScreen;
```

### 2. Exporter depuis src/screens/index.js
```javascript
export { NewScreen } from './NewScreen';
```

### 3. Ajouter à la navigation (RootNavigator.js)
```javascript
<Stack.Screen 
  name="NewScreen" 
  component={NewScreen}
  options={{ title: 'Nouvel Écran' }}
/>
```

## Ajouter un Nouveau Composant

### 1. Créer le composant
```javascript
// src/components/MyComponent.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export const MyComponent = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
});

export default MyComponent;
```

### 2. Exporter depuis src/components/index.js
```javascript
export { MyComponent } from './MyComponent';
```

### 3. Utiliser dans un écran
```javascript
import { MyComponent } from '../components';

// Dans votre écran:
<MyComponent title="Hello" onPress={() => {}} />
```

## Design System

### Couleurs
```javascript
import Colors from '../constants/colors';

// Utilisation
backgroundColor: Colors.primary        // #8f4e00
color: Colors.onSurface              // #191c1d
borderColor: Colors.surfaceVariant    // #e1e3e4
```

### Styles Communs
```javascript
import { commonStyles } from '../constants/styles';

// Utilisation
<View style={commonStyles.card}>
  <Text style={commonStyles.titleLarge}>Title</Text>
</View>
```

### Formatters
```javascript
import { formatPrice, formatDate, getInitials } from '../utils';

formatPrice(25)          // "25.00€"
formatDate(Date.now())   // "31/03/2026"
getInitials("John Doe")  // "JD"
```

## Navigation

### Navigation de Base
```javascript
// Vers un écran dans le même stack
navigation.navigate('OtherScreen', { param: value });

// Vers un écran dans un autre stack
navigation.navigate('Search', { screen: 'SearchMain' });

// Retour à l'écran précédent
navigation.goBack();

// Remplacer l'écran courant
navigation.replace('NewScreen');
```

### Passer des Paramètres
```javascript
// Envoi
navigation.navigate('Profile', { sitter: { id: 1, name: 'Julie' } });

// Réception dans ProfileScreen
const { sitter } = route.params;
```

## Asyncigation avec Données

### Sauvegarder des données locales
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sauvegarder
await AsyncStorage.setItem('favorites', JSON.stringify([1, 2, 3]));

// Récupérer
const favorites = await AsyncStorage.getItem('favorites');
const parsed = favorites ? JSON.parse(favorites) : [];
```

## Tests et Debugging

### Console Logs
```javascript
console.log('Message', value);
```

Affichés dans le terminal Expo pendant le développement.

### React DevTools
```bash
# Pressez 'j' dans le terminal Expo pour ouvrir React DevTools
```

### Reloader l'app
```bash
# Appuyez 'r' dans le terminal Expo
```

## Performance

### Optimisations Recommandées
1. Utiliser `FlatList` pour les longues listes
2. Mémoriser les composants avec `React.memo`
3. Utiliser `useMemo` et `useCallback` pour les calculs lourds
4. Lazy load les images avec `Image` du React Native

## Conventions de Code

### Nommage
- Components: PascalCase (HomeScreen.js)
- Functions: camelCase (handlePress)
- Constants: UPPER_SNAKE_CASE (PRIMARY_COLOR)
- Files: camelCase (mockData.js) ou PascalCase (HomeScreen.js)

### Imports
```javascript
// 1. React et React Native
import React from 'react';
import { View, Text } from 'react-native';

// 2. Dépendances externes
import { MaterialIcons } from '@expo/vector-icons';

// 3. Imports locaux
import Colors from '../constants/colors';
import { Header } from '../components';
```

### Styling
```javascript
// Styles en bas du fichier
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
```

## Ressources Utiles

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Docs](https://reactnative.dev/)
- [Material Design 3](https://m3.material.io/)

## Support

Pour des questions ou des problèmes, consultez la documentation officielle ou contactez l'équipe de développement.

---

**Happy Coding! 🚀**
