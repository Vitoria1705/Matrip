import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, User, Phone, CreditCard } from 'lucide-react-native';
import { authService } from '../services/auth';

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const isValidCPF = (cpf: string) => {
  const digits = cpf.replace(/\D/g, "");
  return digits.length === 11;
};

const isValidPassword = (pass: string) => {
  return pass.length >= 6 && 
         /[a-zA-Z]/.test(pass) && 
         /[0-9]/.test(pass) && 
         /[^a-zA-Z0-9]/.test(pass);
};

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValid =
    name.trim().length > 0 &&
    email.includes("@") &&
    isValidCPF(cpf) &&
    isValidPassword(password) &&
    password === confirm &&
    !isLoading;

  const handleRegister = async () => {
    if (!isValid) return;
    
    setIsLoading(true);
    try {
      const response = await authService.register({
        nome: name,
        email,
        cpf,
        contato: contact,
        senha: password
      });
      
      await authService.saveAuthData(response);
      Alert.alert('Sucesso', 'Conta criada com sucesso! Bem-vindo(a) ao Matrip.');
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao criar conta. Verifique os dados ou tente outro e-mail/CPF.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
          
          {/* Top area */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image source={require('../../assets/logo_matrip.png')} style={styles.logo} />
            </View>
            <Text style={styles.title}>Matrip</Text>
            <Text style={styles.subtitle}>Crie sua conta e explore</Text>
          </View>

          {/* White card */}
          <View style={styles.card}>
            <Text style={styles.welcomeTitle}>Cadastro gratuito</Text>
            <Text style={styles.welcomeSubtitle}>Preencha os dados abaixo para criar sua conta</Text>

            {/* Nome Completo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <View style={[styles.inputContainer, name ? styles.inputContainerFocused : null]}>
                <User size={20} color="#2dd4bf" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={[styles.inputContainer, email ? styles.inputContainerFocused : null]}>
                <Mail size={20} color="#2dd4bf" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* CPF */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF</Text>
              <View style={[
                styles.inputContainer, 
                cpf && !isValidCPF(cpf) ? styles.inputContainerError : (cpf ? styles.inputContainerFocused : null)
              ]}>
                <CreditCard size={20} color="#2dd4bf" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  placeholderTextColor="#94a3b8"
                  value={cpf}
                  onChangeText={(val) => setCpf(formatCPF(val))}
                  keyboardType="numeric"
                />
              </View>
              {cpf.length > 0 && !isValidCPF(cpf) && (
                <Text style={styles.errorText}>CPF inválido</Text>
              )}
            </View>

            {/* Contato */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contato</Text>
              <View style={[styles.inputContainer, contact ? styles.inputContainerFocused : null]}>
                <Phone size={20} color="#2dd4bf" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#94a3b8"
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={[styles.inputContainer, password ? styles.inputContainerFocused : null]}>
                <Lock size={20} color="#2dd4bf" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                </TouchableOpacity>
              </View>
              {password.length > 0 && !isValidPassword(password) && (
                <Text style={styles.errorText}>A senha deve ter no mínimo 6 caracteres, contendo letras, números e símbolos.</Text>
              )}
            </View>

            {/* Confirmar senha */}
            <View style={[styles.inputGroup, { marginBottom: 32 }]}>
              <Text style={styles.label}>Confirmar senha</Text>
              <View style={[
                styles.inputContainer, 
                confirm && confirm !== password ? styles.inputContainerError : (confirm ? styles.inputContainerFocused : null)
              ]}>
                <Lock size={20} color="#2dd4bf" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Repita a senha"
                  placeholderTextColor="#94a3b8"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
                  {showConfirm ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                </TouchableOpacity>
              </View>
              {confirm.length > 0 && confirm !== password && (
                <Text style={styles.errorText}>As senhas não conferem</Text>
              )}
            </View>

            {/* Botão cadastrar */}
            <TouchableOpacity 
              disabled={isLoading || !isValid}
              onPress={handleRegister}
            >
              <LinearGradient
                colors={isValid ? ['#05313d', '#11586a'] : ['#f1f5f9', '#f1f5f9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.loginButton, !isValid && styles.loginButtonDisabled]}
              >
                <Text style={[styles.loginButtonText, !isValid && styles.loginButtonTextDisabled]}>
                  {isLoading ? 'Criando conta...' : 'Criar conta'}
                </Text>
                {!isLoading && <ArrowRight size={20} color={isValid ? "#fff" : "#94a3b8"} style={{marginLeft: 8}} />}
              </LinearGradient>
            </TouchableOpacity>

            {/* Voltar ao login */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.registerLink}>Entrar</Text>
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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 60,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 100,
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
  inputContainerError: {
    borderColor: '#ef4444', // red-500
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
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
