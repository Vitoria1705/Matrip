import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { getApiUrl } from './apiConfig';

export interface LoginParams {
  email: string;
  senha: string;
}

export interface RegisterParams {
  nome: string;
  email: string;
  cpf: string;
  contato: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  nome: string;
  email: string;
}

export interface UserProfile {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  contato: string;
  tipo: string;
}

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('@Matrip:token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${getApiUrl()}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro na requisição');
  }

  return response.json();
};

export const authService = {
  async login(params: LoginParams): Promise<AuthResponse> {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    return apiFetch('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },

  async register(params: RegisterParams): Promise<AuthResponse> {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getProfile(): Promise<UserProfile> {
    return apiFetch('/users/me', {
      method: 'GET',
    });
  },

  // Profile Updates via API
  async updateEmail(newEmail: string): Promise<void> {
    return apiFetch('/users/update-email', {
      method: 'PUT',
      body: JSON.stringify({ newEmail }),
    });
  },

  async updatePhone(newPhone: string): Promise<void> {
    return apiFetch('/users/update-phone', {
      method: 'PUT',
      body: JSON.stringify({ newPhone }),
    });
  },

  async updatePassword(newPassword: string): Promise<void> {
    return apiFetch('/users/update-password', {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    });
  },

  async logout() {
    await AsyncStorage.removeItem('@Matrip:token');
    await AsyncStorage.removeItem('@Matrip:user');
  },

  async saveAuthData(data: AuthResponse) {
    await AsyncStorage.setItem('@Matrip:token', data.token);
    await AsyncStorage.setItem('@Matrip:user', JSON.stringify({
      nome: data.nome,
      email: data.email
    }));
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('@Matrip:token');
      if (!token) return false;

      const decoded = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        await this.logout();
        return false;
      }

      return true;
    } catch (e) {
      await this.logout();
      return false;
    }
  }
};
