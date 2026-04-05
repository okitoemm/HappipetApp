import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export const SearchInput = ({ icon = 'location_on', placeholder = 'Chercher...', onChangeText = () => {} }) => {
  const [text, setText] = useState('');

  const handleChange = (value) => {
    setText(value);
    onChangeText(value);
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={20} color={Colors.primary} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={text}
        onChangeText={handleChange}
        placeholderTextColor={Colors.outlineVariant}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.onSurface,
    padding: 0,
  },
});

export default SearchInput;
