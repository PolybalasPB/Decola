// Configuração da API
const API_URL = import.meta.env.VITE_API_URL || 'https://748a-189-112-77-177.ngrok-free.app';

export const api = {
  baseURL: API_URL,
  endpoints: {
    login: `${API_URL}/api/auth/login`,
    metas: `${API_URL}/api/metas`,
    dashboard: `${API_URL}/api/dashboard`,
  },
}; 