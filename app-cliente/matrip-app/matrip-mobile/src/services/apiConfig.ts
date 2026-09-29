import Constants from 'expo-constants';

/**
 * Retorna a URL base da API dinamicamente.
 * 
 * Se estiver rodando no Expo Go em desenvolvimento local, ele pega o IP do computador
 * (Metro Bundler) automaticamente, ignorando o IP fixo no .env.
 * 
 * Se for build de produção (APK/AAB) ou não conseguir achar o IP, 
 * ele faz fallback para a variável EXPO_PUBLIC_API_URL do arquivo .env.
 */
export function getApiUrl(): string {
  const debuggerHost = Constants.expoConfig?.hostUri;
  
  if (debuggerHost) {
    // debuggerHost é algo como "192.168.3.9:8081"
    const machineIp = debuggerHost.split(':')[0];
    
    // O backend Java roda na porta 8081, certifique-se que é a porta correta
    return `http://${machineIp}:8081/api`; 
  }
  
  // Fallback de Produção usando a variável de ambiente built-in do Expo
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081/api';
}
