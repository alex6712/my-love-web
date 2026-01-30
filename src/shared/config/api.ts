const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const config = {
  API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME || 'My Love',
}
