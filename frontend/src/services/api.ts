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

  console.log('Fazendo requisição para:', url);
  console.log('Headers:', headers);
  console.log('Token:', token);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('Status da resposta:', response.status);
    console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));

    if (response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('cliente');
      window.location.href = '/';
      throw new Error('Sessão expirada');
    }

    if (!response.ok) {
      const text = await response.text();
      console.error('Resposta não OK:', text);
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    console.log('Content-Type da resposta:', contentType);

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Resposta não é JSON:', text);
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
      console.log('Tentando fazer login com:', { rede });
      console.log('URL do login:', api.endpoints.login);

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

      console.log('Status da resposta do login:', response.status);
      console.log('Headers da resposta do login:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const text = await response.text();
        console.error('Erro no login:', text);
        throw new Error('Erro ao fazer login');
      }

      const data = await response.json();
      console.log('Dados do login recebidos:', data);
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  getDashboard: async (mes?: string, ano?: string) => {
    try {
      console.log('Tentando buscar dados do dashboard');
      let url = api.endpoints.dashboard;
      
      if (mes && ano) {
        url += `?mes=${mes}&ano=${ano}`;
      }
      
      console.log('URL do dashboard:', url);
      const response = await fetchWithAuth(url);
      const data = await response.json();
      console.log('Dados do dashboard:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
      throw error;
    }
  },

  getDashboardTotal: async () => {
    try {
      console.log('Tentando buscar dados totais do dashboard');
      const url = `${api.endpoints.dashboard}/total`;
      console.log('URL do dashboard total:', url);
      const response = await fetchWithAuth(url);
      const data = await response.json();
      console.log('Dados totais do dashboard:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar dashboard total:', error);
      throw error;
    }
  },

  getMetas: async () => {
    try {
      console.log('Tentando buscar dados das metas');
      const response = await fetchWithAuth(api.endpoints.metas);
      const data = await response.json();
      console.log('Dados das metas:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      throw error;
    }
  },
}; 