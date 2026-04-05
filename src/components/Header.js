import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export const Header = ({ title, onNotificationPress, showNotification = true }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="pets" size={24} color={Colors.primary} />
          <Text style={styles.title}>Happipet</Text>
        </View>
        {showNotification && (
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={onNotificationPress}
          >
            <MaterialIcons name="notifications" size={20} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.surface,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    fontStyle: 'italic',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
