import { api } from '../config/api';

const getToken = () => localStorage.getItem('token');

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'ngrok-skip-browser-warning': 'true',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('cliente');
      window.location.href = '/';
      throw new Error('Sessão expirada');
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error('Resposta do servidor não é JSON');
    }

    return response;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

export const apiService = {
  login: async (rede: string, senha: string) => {
    try {
      const response = await fetch(api.endpoints.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ rede, senha }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error('Erro ao fazer login');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  getDashboard: async (mes?: string, ano?: string) => {
    try {
      let url = api.endpoints.dashboard;
      if (mes && ano) {
        url += `?mes=${mes}&ano=${ano}`;
      }
      
      const response = await fetchWithAuth(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
      throw error;
    }
  },

  getDashboardTotal: async () => {
    try {
      const url = `${api.endpoints.dashboard}/total`;
      const response = await fetchWithAuth(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dashboard total:', error);
      throw error;
    }
  },

  getMetas: async () => {
    try {
      const response = await fetchWithAuth(api.endpoints.metas);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      throw error;
    }
  },
}; 