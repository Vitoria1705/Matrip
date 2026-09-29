import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { authService } from '../services/auth';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'dummy-id',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const idToken = id_token || response.authentication?.idToken;
      
      if (idToken) {
        handleGoogleLogin(idToken);
      } else {
        Alert.alert('Erro', 'Google não retornou o token de ID esperado.');
      }
    } else if (response?.type === 'error') {
      Alert.alert('Erro do Google', response.error?.message || 'Falha ao processar o login.');
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setIsLoading(true);
    try {
      const authResponse = await authService.loginWithGoogle(idToken);
      await authService.saveAuthData(authResponse);
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erro', 'Falha no login com Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      const response = await authService.login({ email, senha: password });
      await authService.saveAuthData(response);
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erro', 'E-mail ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={['#05313d', '#11586a']}
        style={styles.gradientBackground}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header & Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/logo_matrip.png')} style={styles.logo} />
            </View>
            <Text style={styles.title}>Matrip</Text>
            <Text style={styles.subtitle}>Sua próxima aventura começa aqui</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.welcomeTitle}>Bem-vindo de volta</Text>
            <Text style={styles.welcomeSubtitle}>Entre na sua conta para continuar</Text>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail ou CPF</Text>
              <View style={[styles.inputContainer, email ? styles.inputContainerFocused : null]}>
                <Mail size={20} color="#2dd4bf" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com ou 000.000.000-00"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={[styles.inputContainer, password ? styles.inputContainerFocused : null]}>
                <Lock size={20} color="#2dd4bf" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity 
              disabled={isLoading || !isFormValid}
              onPress={handleLogin}
            >
              <LinearGradient
                colors={isFormValid ? ['#05313d', '#11586a'] : ['#f1f5f9', '#f1f5f9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.loginButton, !isFormValid && styles.loginButtonDisabled]}
              >
                <Text style={[styles.loginButtonText, !isFormValid && styles.loginButtonTextDisabled]}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Text>
                {!isLoading && <ArrowRight size={20} color={isFormValid ? "#fff" : "#94a3b8"} style={{marginLeft: 8}} />}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou entre com</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button */}
            <TouchableOpacity 
              style={styles.googleButton} 
              onPress={() => promptAsync()}
              disabled={!request || isLoading}
            >
              <Image source={require('../../assets/google_logo.png')} style={styles.googleIcon} />
              <Text style={styles.googleButtonLabel}>Continuar com Google</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Cadastre-se grátis</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  logoContainer: {
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 100,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 60,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputContainerFocused: {
    borderColor: '#05313d',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#0f172a',
    fontSize: 14,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#05313d',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    shadowColor: '#05313d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButtonTextDisabled: {
    color: '#94a3b8',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    color: '#64748b',
    fontSize: 12,
    paddingHorizontal: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: 'contain',
  },
  googleButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  registerText: {
    color: '#64748b',
    fontSize: 14,
  },
  registerLink: {
    color: '#05313d',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
