import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Colors from '../constants/colors';
import { HomeScreen, MessagesScreen, ProfileScreen, SearchScreen } from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.surface },
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.surface },
      }}
    >
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen
        name="ProfileSearch"
        component={ProfileScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

const MessagesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.surface },
      }}
    >
      <Stack.Screen name="MessagesMain" component={MessagesScreen} />
    </Stack.Navigator>
  );
};

const ProfileTabScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.surface },
      }}
    >
      <Stack.Screen 
        name="ProfileTab" 
        component={HomeScreen}
        options={{
          title: 'Mon Profil',
        }}
      />
    </Stack.Navigator>
  );
};

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let icon;

            if (route.name === 'Home') {
              iconName = 'home';
              icon = <MaterialIcons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Search') {
              iconName = 'search';
              icon = <MaterialIcons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Messages') {
              iconName = 'mail';
              icon = <MaterialIcons name={iconName} size={size} color={color} />;
            } else if (route.name === 'ProfileTab') {
              iconName = 'person';
              icon = <MaterialIcons name={iconName} size={size} color={color} />;
            }

            return icon;
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.onSurfaceVariant,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.surfaceContainerHigh,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarLabel: 'Accueil',
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            tabBarLabel: 'Recherche',
          }}
        />
        <Tab.Screen
          name="Messages"
          component={MessagesStack}
          options={{
            tabBarLabel: 'Messages',
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileTabScreen}
          options={{
            tabBarLabel: 'Profil',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
