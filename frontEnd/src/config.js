let apiUrl = 'http://localhost:8081'; // Default API URL

if (import.meta.env.VITE_API_URL) {
  apiUrl = import.meta.env.VITE_API_URL;
}

export { apiUrl };
