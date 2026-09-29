import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, LogOut, User, Mail, Phone, CreditCard, X, ShieldCheck, Lock, Eye, EyeOff, Map, Heart, HelpCircle, MessageCircle, ChevronRight } from 'lucide-react-native';
import { authService, type UserProfile } from '../services/auth';

const PRIMARY = '#05313d';
const GRADIENT_END = '#11586a';
const ACCENT = '#2dd4bf';
const DANGER = '#dc2626';

type ModalType = 'none' | 'email' | 'phone' | 'password';
type Step = 'cpf' | 'input' | 'verify' | 'success';

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const isValidPassword = (pass: string) => {
  return pass.length >= 6 && 
         /[a-zA-Z]/.test(pass) && 
         /[0-9]/.test(pass) && 
         /[^a-zA-Z0-9]/.test(pass);
};

export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [step, setStep] = useState<Step>('cpf');
  
  // Forms
  const [cpfInput, setCpfInput] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [navigation]);

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      setProfile(data);
    } catch (error) {
      Alert.alert('Sessão expirada', 'Faça login novamente.');
      await authService.logout();
      navigation.replace('Login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigation.replace('Login');
  };

  const resetModal = () => {
    setActiveModal('none');
    setStep('cpf');
    setCpfInput('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword('');
    setConfirmPassword('');
    setSmsCode('');
  };

  const verifyCPF = () => {
    if (!profile?.cpf) {
      Alert.alert('Erro', 'Seu perfil não possui um CPF cadastrado.');
      return;
    }
    const cleanProfileCpf = profile.cpf.replace(/\D/g, "");
    const cleanInputCpf = cpfInput.replace(/\D/g, "");
    
    if (cleanInputCpf === cleanProfileCpf) {
      if (activeModal === 'password') {
        // Senha pula pra etapa de verify link
        setStep('verify');
        Alert.alert('E-mail enviado', 'Simulamos o envio de um link de recuperação para seu e-mail.');
      } else {
        setStep('input');
      }
    } else {
      Alert.alert('CPF Inválido', 'O CPF digitado não confere com o titular da conta.');
    }
  };

  // --- Handlers de Ação ---
  
  const handleUpdateEmail = async () => {
    if (!newEmail.includes('@')) return Alert.alert('Erro', 'Digite um e-mail válido.');
    setStep('verify');
    Alert.alert('E-mail enviado', 'Enviamos um link de confirmação para o novo e-mail.');
  };

  const confirmEmailUpdate = async () => {
    setIsProcessing(true);
    await authService.updateEmail(newEmail);
    if (profile) setProfile({ ...profile, email: newEmail });
    setIsProcessing(false);
    setStep('success');
  };

  const handleUpdatePhone = async () => {
    if (newPhone.length < 10) return Alert.alert('Erro', 'Digite um número válido.');
    setStep('verify');
    Alert.alert('SMS Enviado', 'Enviamos um código de confirmação. (Dica: digite qualquer código para testar)');
  };

  const confirmPhoneUpdate = async () => {
    if (smsCode.length < 4) return Alert.alert('Erro', 'Código inválido.');
    setIsProcessing(true);
    await authService.updatePhone(newPhone);
    if (profile) setProfile({ ...profile, contato: newPhone });
    setIsProcessing(false);
    setStep('success');
  };

  const handleUpdatePassword = async () => {
    if (!isValidPassword(newPassword)) {
      return Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres, contendo letras, números e símbolos.');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Erro', 'As senhas não conferem.');
    }
    
    setIsProcessing(true);
    await authService.updatePassword(newPassword);
    setIsProcessing(false);
    setStep('success');
  };

  const finishPasswordUpdate = async () => {
    resetModal();
    await handleLogout();
  };

  // --- Renders Dinâmicos do Modal ---

  const renderModalContent = () => {
    if (step === 'cpf') {
      return (
        <View style={styles.modalBody}>
          <ShieldCheck size={48} color={PRIMARY} style={styles.modalIcon} />
          <Text style={styles.modalTitle}>Confirme sua identidade</Text>
          <Text style={styles.modalText}>Digite seu CPF atual para autorizar esta alteração de segurança.</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="000.000.000-00"
            keyboardType="numeric"
            value={cpfInput}
            onChangeText={(v) => setCpfInput(formatCPF(v))}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={verifyCPF}>
            <Text style={styles.primaryBtnText}>Validar CPF</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeModal === 'email') {
      if (step === 'input') return (
        <View style={styles.modalBody}>
          <Mail size={48} color={PRIMARY} style={styles.modalIcon} />
          <Text style={styles.modalTitle}>Novo E-mail</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="seu.novo@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={newEmail}
            onChangeText={setNewEmail}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={handleUpdateEmail}>
            <Text style={styles.primaryBtnText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      );
      if (step === 'verify') return (
        <View style={styles.modalBody}>
          <Mail size={48} color={PRIMARY} style={styles.modalIcon} />
          <Text style={styles.modalTitle}>Verifique seu E-mail</Text>
          <Text style={styles.modalText}>Simule que você clicou no link enviado para {newEmail}.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={confirmEmailUpdate} disabled={isProcessing}>
            <Text style={styles.primaryBtnText}>{isProcessing ? 'Atualizando...' : 'Simular Clique no Link'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeModal === 'phone') {
      if (step === 'input') return (
        <View style={styles.modalBody}>
          <Phone size={48} color={PRIMARY} style={styles.modalIcon} />
          <Text style={styles.modalTitle}>Novo Telefone</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            value={newPhone}
            onChangeText={setNewPhone}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={handleUpdatePhone}>
            <Text style={styles.primaryBtnText}>Enviar SMS</Text>
          </TouchableOpacity>
        </View>
      );
      if (step === 'verify') return (
        <View style={styles.modalBody}>
          <ShieldCheck size={48} color={PRIMARY} style={styles.modalIcon} />
          <Text style={styles.modalTitle}>Código SMS</Text>
          <Text style={styles.modalText}>Digite o código de 6 dígitos enviado para {newPhone}.</Text>
          <TextInput
            style={[styles.modalInput, { textAlign: 'center', fontSize: 24, letterSpacing: 4 }]}
            placeholder="000000"
            keyboardType="numeric"
            maxLength={6}
            value={smsCode}
            onChangeText={setSmsCode}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={confirmPhoneUpdate} disabled={isProcessing}>
            <Text style={styles.primaryBtnText}>{isProcessing ? 'Verificando...' : 'Confirmar Código'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeModal === 'password') {
      if (step === 'verify') return (
        <View style={styles.modalBody}>
          <Mail size={48} color={PRIMARY} style={styles.modalIcon} />
          <Text style={styles.modalTitle}>Autorização Enviada</Text>
          <Text style={styles.modalText}>Simule que você clicou no link de redefinição enviado para seu e-mail atual.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep('input')}>
            <Text style={styles.primaryBtnText}>Simular Clique no Link</Text>
          </TouchableOpacity>
        </View>
      );
      if (step === 'input') return (
        <View style={styles.modalBody}>
          <Lock size={48} color={PRIMARY} style={styles.modalIcon} />
          <Text style={styles.modalTitle}>Nova Senha</Text>
          <Text style={styles.modalText}>Mín. 6 caracteres (letras, números e símbolos).</Text>
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nova senha"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
            </TouchableOpacity>
          </View>
          
          <View style={[styles.passwordContainer, { marginTop: 12 }]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar nova senha"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity style={[styles.primaryBtn, { marginTop: 20 }]} onPress={handleUpdatePassword} disabled={isProcessing}>
            <Text style={styles.primaryBtnText}>{isProcessing ? 'Salvando...' : 'Alterar Senha'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (step === 'success') {
      return (
        <View style={styles.modalBody}>
          <ShieldCheck size={64} color={ACCENT} style={styles.modalIcon} />
          <Text style={styles.modalTitle}>Sucesso!</Text>
          <Text style={styles.modalText}>Sua alteração foi salva com sucesso no sistema.</Text>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={activeModal === 'password' ? finishPasswordUpdate : resetModal}
          >
            <Text style={styles.primaryBtnText}>{activeModal === 'password' ? 'Ir para o Login' : 'Concluir'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <LinearGradient colors={[PRIMARY, GRADIENT_END]} style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Meu Perfil</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={PRIMARY} />
          </View>
        ) : profile ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              <LinearGradient colors={[PRIMARY, GRADIENT_END]} style={styles.avatar}>
                <User size={40} color="#fff" />
              </LinearGradient>
              <Text style={styles.name}>{profile.nome}</Text>
              <View style={styles.tipoBadge}>
                <Text style={styles.tipoBadgeText}>{(profile.tipo || 'Usuário').toUpperCase()}</Text>
              </View>
            </View>

            {/* Minha Atividade (Novo Bloco Visual) */}
            <Text style={styles.sectionTitle}>Minha Atividade</Text>
            <View style={[styles.infoList, { marginBottom: 24 }]}>
              <TouchableOpacity style={styles.infoRow} onPress={() => navigation.navigate('MyTrips')}>
                <View style={styles.infoRowLeft}>
                  <Map size={20} color={PRIMARY} />
                  <View>
                    <Text style={styles.infoLabel}>Minhas Viagens</Text>
                    <Text style={styles.infoValue}>Pacotes comprados e histórico</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#94a3b8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.infoRow} onPress={() => navigation.navigate('Favorites')}>
                <View style={styles.infoRowLeft}>
                  <Heart size={20} color={DANGER} />
                  <View>
                    <Text style={styles.infoLabel}>Lista de Desejos</Text>
                    <Text style={styles.infoValue}>Pacotes salvos</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Configurações de Conta */}
            <Text style={styles.sectionTitle}>Dados da Conta</Text>
            
            <View style={styles.infoList}>
              {/* E-mail (Editável) */}
              <View style={styles.infoRow}>
                <View style={styles.infoRowLeft}>
                  <Mail size={20} color={ACCENT} />
                  <View>
                    <Text style={styles.infoLabel}>E-mail</Text>
                    <Text style={styles.infoValue}>{profile.email}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setActiveModal('email')}>
                  <Text style={styles.editBtn}>Alterar</Text>
                </TouchableOpacity>
              </View>

              {/* O CPF ficava aqui, mas foi removido por questões de segurança e privacidade */}

              {/* Contato (Editável) */}
              <View style={styles.infoRow}>
                <View style={styles.infoRowLeft}>
                  <Phone size={20} color={ACCENT} />
                  <View>
                    <Text style={styles.infoLabel}>Telefone</Text>
                    <Text style={styles.infoValue}>{profile.contato || 'Não informado'}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setActiveModal('phone')}>
                  <Text style={styles.editBtn}>Alterar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Segurança */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Segurança</Text>
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <View style={styles.infoRowLeft}>
                  <Lock size={20} color={ACCENT} />
                  <View>
                    <Text style={styles.infoLabel}>Senha</Text>
                    <Text style={styles.infoValue}>••••••••</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setActiveModal('password')}>
                  <Text style={styles.editBtn}>Alterar</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Suporte (Novo Bloco Visual) */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Suporte</Text>
            <View style={styles.infoList}>
              <TouchableOpacity style={styles.infoRow} onPress={() => navigation.navigate('FAQ')}>
                <View style={styles.infoRowLeft}>
                  <HelpCircle size={20} color={PRIMARY} />
                  <View>
                    <Text style={styles.infoLabel}>Central de Ajuda</Text>
                    <Text style={styles.infoValue}>Perguntas frequentes e dúvidas</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#94a3b8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.infoRow} onPress={() => Alert.alert('Em breve', 'Redirecionamento para o WhatsApp do suporte.')}>
                <View style={styles.infoRowLeft}>
                  <MessageCircle size={20} color="#16a34a" />
                  <View>
                    <Text style={styles.infoLabel}>Fale Conosco</Text>
                    <Text style={styles.infoValue}>Atendimento via WhatsApp</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut size={18} color={DANGER} />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Não foi possível carregar os dados.</Text>
          </View>
        )}
      </View>

      {/* MODAL DE FLUXOS DE ALTERAÇÃO */}
      <Modal visible={activeModal !== 'none'} animationType="slide" transparent>
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={resetModal}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
            {renderModalContent()}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  backBtn: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  topTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#64748b', fontSize: 14 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  tipoBadge: {
    backgroundColor: 'rgba(5,49,61,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  tipoBadgeText: { fontSize: 11, fontWeight: '600', color: PRIMARY, letterSpacing: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  infoList: { gap: 12 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  infoRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  infoLabel: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#0f172a', marginTop: 2 },
  editBtn: { color: ACCENT, fontWeight: 'bold', fontSize: 14 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 32,
    backgroundColor: 'rgba(220,38,38,0.1)',
  },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: DANGER },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  closeBtn: { alignSelf: 'flex-end', padding: 4 },
  modalBody: { alignItems: 'center', paddingTop: 8 },
  modalIcon: { marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  modalText: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24, paddingHorizontal: 16 },
  modalInput: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    marginBottom: 24,
  },
  passwordContainer: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
  },
  passwordInput: { flex: 1, fontSize: 16, color: '#0f172a' },
  primaryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
