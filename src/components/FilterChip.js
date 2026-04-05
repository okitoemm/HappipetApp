import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export const FilterChip = ({ 
  label, 
  selected = false, 
  onPress = () => {},
  icon = null 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && styles.chipSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && icon}
      <Text
        style={[
          styles.text,
          selected && styles.textSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  textSelected: {
    color: Colors.onPrimaryContainer,
    fontWeight: '700',
  },
});

export default FilterChip;
