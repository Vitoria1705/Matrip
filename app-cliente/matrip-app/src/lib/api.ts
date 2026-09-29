// Celular físico na mesma rede Wi-Fi alcança o backend pelo IP da máquina.
// (adb reverse não funciona neste device por estar via depuração sem fio.)
// Alternativas: emulador -> http://10.0.2.2:8081/api ; navegador no PC -> localhost
export const API_BASE_URL = 'http://192.168.2.55:8081/api';

/**
 * Função utilitária para fazer requisições à API.
 * Ela já inclui o Content-Type como JSON por padrão.
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers);
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Tenta pegar o token do localStorage
  const token = localStorage.getItem('@Matrip:token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  // Se a resposta for vazia (204 No Content), não tenta parsear JSON
  if (response.status === 204) {
    return null;
  }

  return response.json();
};
