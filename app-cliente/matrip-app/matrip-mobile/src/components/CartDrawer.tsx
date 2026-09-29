import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  QrCode,
  Wallet,
  Copy,
} from 'lucide-react-native';
import type { TicketType } from '../types/adventure';
import { paymentService, PaymentResponse } from '../services/payment';
import { useCartStore } from '../store/useCartStore';

const typeLabel: Record<TicketType, string> = {
  adulto: 'Adulto',
  estudante: 'Estudante',
  crianca: 'Criança',
};

type PaymentMethod = 'pix' | 'credit' | 'paypal' | null;

const SERVICE_FEE = 20;
const formatBRL = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

export default function CartDrawer() {
  const { cartItems, isCartOpen, setCartOpen, updateQuantity, removeItem, clearCart } = useCartStore();
  
  const [showPayment, setShowPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  
  // States for checkout
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);
  const [cardData, setCardData] = useState({ number: '', expiration: '', cvv: '', holderName: '' });

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const grandTotal = total + SERVICE_FEE;
  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleBack = () => {
    if (paymentResult) {
      setPaymentResult(null);
      return;
    }
    setShowPayment(false);
    setSelectedMethod(null);
  };

  const handleClose = () => {
    if (paymentResult) {
      clearCart();
    }
    setShowPayment(false);
    setSelectedMethod(null);
    setPaymentResult(null);
    setCartOpen(false);
  };

  const handleConfirmPayment = async () => {
    if (!selectedMethod) return;
    
    setLoading(true);
    try {
      const items = cartItems.map(item => ({
        adventureId: item.adventureId,
        title: item.title,
        type: item.type,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      const response = await paymentService.checkout({
        items,
        total,
        serviceFee: SERVICE_FEE,
        grandTotal,
        paymentMethod: selectedMethod,
        creditCard: selectedMethod === 'credit' ? cardData : undefined,
      });

      setPaymentResult(response);
    } catch (error: any) {
      Alert.alert('Erro no pagamento', error.message || 'Falha ao processar checkout');
    } finally {
      setLoading(false);
    }
  };

  const methods: { key: Exclude<PaymentMethod, null>; title: string; subtitle: string; color: string; icon: React.ReactNode }[] = [
    {
      key: 'pix',
      title: 'Pix',
      subtitle: 'Pagamento instantâneo · Aprovação imediata',
      color: '#00BDAE',
      icon: <QrCode size={20} color="#fff" />,
    },
    {
      key: 'credit',
      title: 'Cartão de Crédito',
      subtitle: 'Visa, Mastercard · Parcele em até 12x',
      color: '#05313d',
      icon: <CreditCard size={18} color="#fff" />,
    },
    {
      key: 'paypal',
      title: 'PayPal',
      subtitle: 'Pague com sua conta PayPal',
      color: '#003087',
      icon: <Wallet size={18} color="#fff" />,
    },
  ];

  return (
    <Modal visible={isCartOpen} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

        <View style={styles.panel}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {showPayment ? (
                <TouchableOpacity onPress={handleBack}>
                  <ArrowLeft size={18} color="#05313d" />
                </TouchableOpacity>
              ) : (
                <ShoppingBag size={18} color="#05313d" />
              )}
              <Text style={styles.headerTitle}>{showPayment ? 'Pagamento' : 'Carrinho'}</Text>
              {!showPayment && cartItems.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{itemCount}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={handleClose}>
              <X size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {!showPayment ? (
            <>
              <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
                {cartItems.length === 0 ? (
                  <View style={styles.empty}>
                    <ShoppingBag size={40} color="#94a3b8" />
                    <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
                  </View>
                ) : (
                  cartItems.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                      <Image source={item.image} style={styles.cartImage} />
                      <View style={styles.cartItemInfo}>
                        <Text style={styles.cartItemTitle} numberOfLines={2}>
                          {item.title}
                        </Text>
                        <Text style={styles.cartItemMeta}>
                          {typeLabel[item.type]} · {formatBRL(item.unitPrice)}
                        </Text>
                        <View style={styles.cartItemBottom}>
                          <View style={styles.stepper}>
                            <TouchableOpacity
                              style={styles.stepBtnOutline}
                              onPress={() => updateQuantity(cartItems.indexOf(item), -1)}
                            >
                              <Minus size={10} color="#05313d" />
                            </TouchableOpacity>
                            <Text style={styles.stepCount}>{item.quantity}</Text>
                            <TouchableOpacity
                              style={styles.stepBtnFilled}
                              onPress={() => updateQuantity(cartItems.indexOf(item), 1)}
                            >
                              <Plus size={10} color="#fff" />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.cartItemPriceRow}>
                            <Text style={styles.cartItemPrice}>
                              {formatBRL(item.quantity * item.unitPrice)}
                            </Text>
                            <TouchableOpacity onPress={() => removeItem(cartItems.indexOf(item))}>
                              <Trash2 size={13} color="#94a3b8" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>

              {cartItems.length > 0 && (
                <View style={styles.footer}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>{formatBRL(total)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Taxa de serviço</Text>
                    <Text style={styles.summaryValue}>{formatBRL(SERVICE_FEE)}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                    <Text style={styles.summaryTotalLabel}>Total</Text>
                    <Text style={styles.summaryTotalValue}>{formatBRL(grandTotal)}</Text>
                  </View>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowPayment(true)}>
                    <Text style={styles.primaryBtnText}>Finalizar pedido</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <>
              <ScrollView style={styles.body} contentContainerStyle={{ padding: 16 }}>
                <View style={styles.orderSummary}>
                  <Text style={styles.orderSummaryTitle}>Resumo do pedido</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.cartItemTitle}>{itemCount} item(s)</Text>
                    <Text style={styles.summaryTotalValue}>{formatBRL(grandTotal)}</Text>
                  </View>
                </View>

                <Text style={styles.paymentHeading}>Selecione a forma de pagamento</Text>

                <View style={{ gap: 12 }}>
                  {methods.map((m) => {
                    const active = selectedMethod === m.key;
                    return (
                      <View key={m.key}>
                        <TouchableOpacity
                          style={[styles.methodBtn, active && styles.methodBtnActive]}
                          onPress={() => setSelectedMethod(m.key)}
                        >
                          <View style={[styles.methodIcon, { backgroundColor: m.color }]}>{m.icon}</View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.methodTitle}>{m.title}</Text>
                            <Text style={styles.methodSubtitle}>{m.subtitle}</Text>
                          </View>
                          {active && <CheckCircle2 size={20} color="#05313d" />}
                        </TouchableOpacity>

                        {/* Credit Card Form Dropdown */}
                        {active && m.key === 'credit' && (
                          <View style={styles.cardForm}>
                            <TextInput
                              style={styles.input}
                              placeholder="Número do Cartão"
                              keyboardType="numeric"
                              value={cardData.number}
                              onChangeText={text => setCardData({ ...cardData, number: text })}
                            />
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                              <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="MM/AA"
                                value={cardData.expiration}
                                onChangeText={text => setCardData({ ...cardData, expiration: text })}
                              />
                              <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="CVV"
                                keyboardType="numeric"
                                secureTextEntry
                                value={cardData.cvv}
                                onChangeText={text => setCardData({ ...cardData, cvv: text })}
                              />
                            </View>
                            <TextInput
                              style={styles.input}
                              placeholder="Nome do Titular"
                              value={cardData.holderName}
                              onChangeText={text => setCardData({ ...cardData, holderName: text })}
                            />
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* Result Block after payment */}
                {paymentResult && (
                  <View style={styles.resultBox}>
                    <Text style={styles.resultTitle}>Status: {paymentResult.status}</Text>
                    <Text style={styles.resultMessage}>{paymentResult.message}</Text>
                    
                    {paymentResult.method === 'pix' && paymentResult.qrCode && (
                      <View style={styles.pixBox}>
                        <QrCode size={120} color="#00BDAE" />
                        <Text style={styles.pixText}>{paymentResult.qrCode}</Text>
                        <TouchableOpacity style={styles.copyBtn} onPress={() => Alert.alert('Pix copiado!')}>
                          <Copy size={16} color="#05313d" />
                          <Text style={styles.copyBtnText}>Copiar Pix Copia e Cola</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {paymentResult.method === 'paypal' && paymentResult.checkoutUrl && (
                      <TouchableOpacity style={styles.paypalBtn} onPress={() => Linking.openURL(paymentResult.checkoutUrl!)}>
                        <Text style={styles.paypalBtnText}>Ir para o PayPal</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </ScrollView>

              {!paymentResult && (
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[styles.primaryBtn, (!selectedMethod || loading) && styles.primaryBtnDisabled]}
                    onPress={handleConfirmPayment}
                    disabled={!selectedMethod || loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.primaryBtnText}>Confirmar pagamento</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
              
              {paymentResult && (
                 <View style={styles.footer}>
                   <TouchableOpacity
                     style={styles.primaryBtn}
                     onPress={handleClose}
                   >
                     <Text style={styles.primaryBtnText}>Concluir e Voltar</Text>
                   </TouchableOpacity>
                 </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  panel: { width: '88%', maxWidth: 400, height: '100%', backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  countBadge: { backgroundColor: '#05313d', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  countBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 12 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, gap: 12 },
  emptyText: { fontSize: 14, color: '#94a3b8' },
  cartItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  cartImage: { width: 64, height: 64, borderRadius: 8, resizeMode: 'cover' },
  cartItemInfo: { flex: 1 },
  cartItemTitle: { fontSize: 12, fontWeight: '600', color: '#0f172a', lineHeight: 16 },
  cartItemMeta: { fontSize: 11, color: '#64748b', marginTop: 2 },
  cartItemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepBtnOutline: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#05313d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnFilled: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#05313d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCount: { fontSize: 14, fontWeight: 'bold', width: 16, textAlign: 'center', color: '#0f172a' },
  cartItemPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cartItemPrice: { fontSize: 14, fontWeight: 'bold', color: '#f97316' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#e2e8f0', backgroundColor: '#fff' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: 14, color: '#64748b' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  summaryTotalRow: { marginTop: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  summaryTotalLabel: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  summaryTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#f97316' },
  primaryBtn: {
    backgroundColor: '#05313d',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  orderSummary: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, marginBottom: 20 },
  orderSummaryTitle: { fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 8 },
  paymentHeading: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },
  methodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  methodBtnActive: { borderColor: '#05313d', backgroundColor: 'rgba(5,49,61,0.05)' },
  methodIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  methodTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  methodSubtitle: { fontSize: 11, color: '#64748b', marginTop: 2 },
  cardForm: { marginTop: 8, gap: 12, padding: 12, backgroundColor: '#f8fafc', borderRadius: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 14 },
  resultBox: { marginTop: 24, padding: 16, backgroundColor: '#f0fdfa', borderRadius: 12, borderWidth: 1, borderColor: '#ccfbf1', alignItems: 'center' },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f766e', marginBottom: 4 },
  resultMessage: { fontSize: 14, color: '#0f766e', textAlign: 'center', marginBottom: 16 },
  pixBox: { alignItems: 'center', gap: 12 },
  pixText: { fontSize: 10, color: '#64748b', textAlign: 'center' },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e2e8f0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  copyBtnText: { fontSize: 12, fontWeight: 'bold', color: '#05313d' },
  paypalBtn: { backgroundColor: '#003087', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  paypalBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
