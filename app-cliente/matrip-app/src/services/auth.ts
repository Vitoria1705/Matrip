import { apiFetch } from '../lib/api';

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

export const authService = {
  async login(params: LoginParams): Promise<AuthResponse> {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
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

  logout() {
    localStorage.removeItem('@Matrip:token');
    localStorage.removeItem('@Matrip:user');
  },
  
  saveAuthData(data: AuthResponse) {
    localStorage.setItem('@Matrip:token', data.token);
    localStorage.setItem('@Matrip:user', JSON.stringify({
      nome: data.nome,
      email: data.email
    }));
  },
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('@Matrip:token');
    if (!token) return false;

    try {
      // O JWT tem 3 partes separadas por ponto. O payload é a segunda parte.
      const payloadBase64 = token.split('.')[1];
      // Decodifica a base64
      const decodedJson = atob(payloadBase64);
      const payload = JSON.parse(decodedJson);
      
      // O exp vem em segundos, então multiplicamos por 1000 para comparar com o Date.now()
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (e) {
      // Se der qualquer erro na decodificação do token, consideramos inválido
      this.logout();
      return false;
    }
  }
};
