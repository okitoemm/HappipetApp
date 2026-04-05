import { StyleSheet } from 'react-native';
import Colors from './colors';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  
  // Spacing
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  
  // Cards
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  
  // Buttons
  buttonPrimary: {
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
  
  buttonSecondary: {
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
  
  // Text
  titleLarge: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  
  titleMedium: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  
  titleSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  
  bodyLarge: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  
  bodyMedium: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.onSurface,
  },
  
  bodySmall: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  
  labelLarge: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
    textTransform: 'uppercase',
  },
  
  labelSmall: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
});

export default commonStyles;
