const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise, prepend the API URL
  return `${API_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

export default API_URL;
