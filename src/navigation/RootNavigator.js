import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import Colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import {
    BookingConfirmationScreen,
    BookingScreen,
    ChatScreen,
    FavoritesScreen,
    ForgotPasswordScreen,
    HomeScreen,
    LoginScreen,
    MessagesScreen,
    MyBookingsScreen,
    NotificationsScreen,
    ProfileScreen,
    RegisterScreen,
    SearchScreen,
    SettingsScreen,
    UserProfileScreen,
} from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ========================
// AUTH STACK (non connecté)
// ========================
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: Colors.surface } }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.surface },
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
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
      <Stack.Screen name="ProfileSearch" component={ProfileScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
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
      <Stack.Screen name="Chat" component={ChatScreen} />
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
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export const Navigation = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surface }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
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
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: 2,
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Accueil' }} />
          <Tab.Screen name="Search" component={SearchStack} options={{ tabBarLabel: 'Recherche' }} />
          <Tab.Screen name="Messages" component={MessagesStack} options={{ tabBarLabel: 'Messages' }} />
          <Tab.Screen name="ProfileTab" component={ProfileTabScreen} options={{ tabBarLabel: 'Profil' }} />
        </Tab.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default Navigation;
