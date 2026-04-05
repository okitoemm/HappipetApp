// Configuration générale de l'application
export const APP_CONFIG = {
  appName: 'Happipet',
  version: '1.0.0',
  apiBaseUrl: 'https://api.happipet.app', // À remplacer par votre API
  
  // Timeouts
  requestTimeout: 10000,
  
  // Pagination
  itemsPerPage: 20,
  
  // Formats
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'HH:mm',
  
  // Tarification
  currency: '€',
  
  // Localisation
  locale: 'fr-FR',
  timezone: 'Europe/Paris',
};

// Clés de stockage AsyncStorage
export const STORAGE_KEYS = {
  USER_DATA: 'happipet_user_data',
  AUTH_TOKEN: 'happipet_auth_token',
  FAVORITES: 'happipet_favorites',
  SEARCH_HISTORY: 'happipet_search_history',
  PREFERENCES: 'happipet_preferences',
};

// Endpoints API (à implémenter)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  DOGSITTERS: {
    LIST: '/dogsitters',
    DETAIL: '/dogsitters/:id',
    SEARCH: '/dogsitters/search',
    REVIEWS: '/dogsitters/:id/reviews',
  },
  MESSAGES: {
    LIST: '/messages',
    CONVERSATIONS: '/conversations',
    DETAIL: '/conversations/:id',
  },
  BOOKINGS: {
    CREATE: '/bookings',
    LIST: '/bookings',
    DETAIL: '/bookings/:id',
  },
};

export default {
  APP_CONFIG,
  STORAGE_KEYS,
  API_ENDPOINTS,
};
