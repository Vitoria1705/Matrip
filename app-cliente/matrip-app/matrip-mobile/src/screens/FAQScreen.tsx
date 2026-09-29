import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';

const PRIMARY = '#05313d';
const GRADIENT_END = '#11586a';
const YELLOW = '#f4c430';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Como recebo o meu voucher de viagem?',
    answer: 'Após a confirmação do pagamento do seu carrinho, o voucher ficará disponível na tela "Minhas Viagens". Você pode acessá-lo a qualquer momento e apresentá-lo no local através do QRCode.'
  },
  {
    question: 'Quais são as formas de pagamento aceitas?',
    answer: 'Atualmente aceitamos pagamentos via PIX, Cartão de Crédito em até 12x e boleto bancário.'
  },
  {
    question: 'Como funcionam os cancelamentos e reembolsos?',
    answer: 'O cancelamento gratuito pode ser feito até 48 horas antes da data da viagem. Após esse prazo, pode ser cobrada uma taxa administrativa. O reembolso é feito na mesma forma de pagamento original.'
  },
  {
    question: 'Preciso imprimir o meu voucher?',
    answer: 'Não! O Matrip é totalmente digital. Basta apresentar o QRCode na tela do seu celular no dia do passeio.'
  },
  {
    question: 'Posso alterar a data de uma viagem já comprada?',
    answer: 'Para alterações de datas, entre em contato com nosso suporte via WhatsApp com no mínimo 72 horas de antecedência. A alteração está sujeita à disponibilidade de vagas.'
  },
  {
    question: 'Como faço para contatar o suporte?',
    answer: 'Na aba "Perfil", você encontra opções rápidas para chamar no WhatsApp, enviar um e-mail, ou ligar para nossa central de atendimento disponível 24h.'
  }
];

function FAQCard({ item }: { item: FAQItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.faqCard}>
      <TouchableOpacity 
        style={styles.faqHeader} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestion}>{item.question}</Text>
        {expanded ? (
          <ChevronUp size={20} color={PRIMARY} />
        ) : (
          <ChevronDown size={20} color="#64748b" />
        )}
      </TouchableOpacity>
      {expanded && (
        <View style={styles.faqBody}>
          <Text style={styles.faqAnswer}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
}

export default function FAQScreen({ navigation }: any) {
  return (
    <LinearGradient colors={[PRIMARY, GRADIENT_END]} style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Central de Ajuda</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headerTitle}>Perguntas Frequentes</Text>
          <Text style={styles.headerSubtitle}>
            Tire suas dúvidas rapidamente com nossa seleção de perguntas e respostas mais procuradas.
          </Text>

          <View style={styles.faqList}>
            {faqs.map((faq, index) => (
              <FAQCard key={index} item={faq} />
            ))}
          </View>
          
          <View style={styles.supportBox}>
            <Text style={styles.supportBoxTitle}>Ainda precisa de ajuda?</Text>
            <Text style={styles.supportBoxText}>
              Nossa equipe está disponível para te ajudar. Acesse as opções de Suporte no seu Perfil.
            </Text>
            <TouchableOpacity 
              style={styles.profileBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.profileBtnText}>Ir para o Perfil</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
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
  mainContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 20,
  },
  faqList: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    paddingRight: 16,
  },
  faqBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  supportBox: {
    marginTop: 32,
    backgroundColor: 'rgba(5, 49, 61, 0.05)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  supportBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY,
    marginBottom: 8,
  },
  supportBoxText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  profileBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  profileBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
