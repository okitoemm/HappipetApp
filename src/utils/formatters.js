// Utilitaires pour les dates
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year);
};

export const formatTime = (date, format = 'HH:mm') => {
  if (!date) return '';
  
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return format
    .replace('HH', hours)
    .replace('mm', minutes);
};

// Utilitaires pour les prix
export const formatPrice = (price, currency = '€') => {
  const formatted = typeof price === 'number' ? price.toFixed(2) : '0.00';
  return `${formatted}${currency}`;
};

// Utilitaires pour les ratings
export const generateStars = (rating, maxRating = 5) => {
  const stars = [];
  for (let i = 0; i < maxRating; i++) {
    stars.push(i < Math.round(rating) ? 'filled' : 'empty');
  }
  return stars;
};

// Utilitaires pour les textes
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Utilitaires pour les distances
export const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
};

// Utilitaires pour les lieux
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export default {
  formatDate,
  formatTime,
  formatPrice,
  generateStars,
  truncateText,
  capitalize,
  formatDistance,
  getInitials,
};
