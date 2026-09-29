import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  MapPin,
  Clock,
  CheckCircle,
  User,
  GraduationCap,
  Baby,
  Plus,
  Minus,
  ShoppingCart,
  X,
  CalendarDays,
  Route,
  Timer,
  Shield,
  Info,
} from 'lucide-react-native';
import type { Adventure, CartItem, TicketType } from '../types/adventure';
import { useCartStore } from '../store/useCartStore';

interface Props {
  adventure: Adventure | null;
  onClose: () => void;
}

const TYPES: TicketType[] = ['adulto', 'estudante', 'crianca'];

const typeLabel: Record<TicketType, string> = {
  adulto: 'Adulto',
  estudante: 'Estudante',
  crianca: 'Criança',
};

const formatBRL = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

function TypeIcon({ type }: { type: TicketType }) {
  const color = '#05313d';
  if (type === 'adulto') return <User size={14} color={color} />;
  if (type === 'estudante') return <GraduationCap size={14} color={color} />;
  return <Baby size={14} color={color} />;
}

export default function AdventureDetail({ adventure, onClose }: Props) {
  const addToCart = useCartStore(state => state.addToCart);
  const [quantities, setQuantities] = useState<Record<TicketType, number>>({
    adulto: 0,
    estudante: 0,
    crianca: 0,
  });

  const resetAndClose = () => {
    setQuantities({ adulto: 0, estudante: 0, crianca: 0 });
    onClose();
  };

  if (!adventure) return null;

  const change = (type: TicketType, delta: number) =>
    setQuantities((prev) => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));

  const total = TYPES.reduce((sum, t) => sum + quantities[t] * adventure.prices[t], 0);

  const handleAdd = () => {
    TYPES.filter((t) => quantities[t] > 0).forEach((t) => {
      addToCart({
        id: `${adventure.id}-${t}`,
        adventureId: adventure.id,
        title: adventure.title,
        image: adventure.image,
        type: t,
        quantity: quantities[t],
        unitPrice: adventure.prices[t],
      });
    });
    setQuantities({ adulto: 0, estudante: 0, crianca: 0 });
    onClose();
  };

  const hasExtraInfo =
    adventure.tourDate ||
    (adventure.itinerary && adventure.itinerary.length > 0) ||
    adventure.frequency ||
    adventure.classification ||
    (adventure.importantInfo && adventure.importantInfo.length > 0);

  return (
    <Modal visible={!!adventure} animationType="slide" transparent onRequestClose={resetAndClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={resetAndClose} />

        <View style={styles.panel}>
          {/* Hero image */}
          <View style={styles.hero}>
            <Image source={adventure.image} style={styles.heroImage} />
            <View style={styles.heroGradient} />
            <TouchableOpacity style={styles.closeBtn} onPress={resetAndClose}>
              <X size={16} color="#fff" />
            </TouchableOpacity>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{adventure.category}</Text>
            </View>
          </View>

          {/* Scrollable content */}
          <ScrollView style={styles.content} contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.title}>{adventure.title}</Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color="#64748b" />
              <Text style={styles.locationText}>{adventure.location}</Text>
            </View>

            <Text style={styles.description}>{adventure.description}</Text>

            <View style={styles.durationRow}>
              <Clock size={12} color="#05313d" />
              <Text style={styles.durationText}>{adventure.duration}</Text>
            </View>

            {adventure.includes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>O que inclui:</Text>
                {adventure.includes.map((item, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <CheckCircle size={11} color="#05313d" />
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {hasExtraInfo && (
              <View style={{ marginBottom: 16, gap: 8 }}>
                {adventure.tourDate && (
                  <View style={styles.infoCard}>
                    <View style={styles.infoCardTitleRow}>
                      <CalendarDays size={13} color="#05313d" />
                      <Text style={styles.infoCardTitle}>Data do passeio</Text>
                    </View>
                    <Text style={[styles.infoCardValue, { color: '#05313d' }]}>{adventure.tourDate}</Text>
                  </View>
                )}

                {adventure.itinerary && adventure.itinerary.length > 0 && (
                  <View style={styles.infoCard}>
                    <View style={styles.infoCardTitleRow}>
                      <Route size={13} color="#05313d" />
                      <Text style={styles.infoCardTitle}>Roteiro</Text>
                    </View>
                    {adventure.itinerary.map((item, i) => (
                      <Text key={i} style={styles.infoCardValue}>• {item}</Text>
                    ))}
                  </View>
                )}

                {adventure.frequency && (
                  <View style={styles.infoCard}>
                    <View style={styles.infoCardTitleRow}>
                      <Timer size={13} color="#05313d" />
                      <Text style={styles.infoCardTitle}>Frequência / Horários</Text>
                    </View>
                    <Text style={styles.infoCardValue}>{adventure.frequency}</Text>
                  </View>
                )}

                {adventure.classification && (
                  <View style={styles.infoCard}>
                    <View style={styles.infoCardTitleRow}>
                      <Shield size={13} color="#05313d" />
                      <Text style={styles.infoCardTitle}>Classificação</Text>
                    </View>
                    <Text style={[styles.infoCardValue, { color: '#05313d' }]}>{adventure.classification}</Text>
                  </View>
                )}

                {adventure.importantInfo && adventure.importantInfo.length > 0 && (
                  <View style={styles.infoCard}>
                    <View style={styles.infoCardTitleRow}>
                      <Info size={13} color="#f97316" />
                      <Text style={styles.infoCardTitle}>Informações importantes</Text>
                    </View>
                    {adventure.importantInfo.map((item, i) => (
                      <Text key={i} style={styles.infoCardValue}>• {item}</Text>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Ticket selectors */}
            <View style={styles.ticketBox}>
              {TYPES.map((type, idx) => (
                <View
                  key={type}
                  style={[styles.ticketRow, idx < TYPES.length - 1 && styles.ticketRowBorder]}
                >
                  <View style={styles.ticketInfo}>
                    <TypeIcon type={type} />
                    <View>
                      <Text style={styles.ticketLabel}>{typeLabel[type]}</Text>
                      <Text style={styles.ticketPrice}>{formatBRL(adventure.prices[type])}</Text>
                    </View>
                  </View>
                  <View style={styles.stepper}>
                    <TouchableOpacity style={styles.stepBtnOutline} onPress={() => change(type, -1)}>
                      <Minus size={12} color="#05313d" />
                    </TouchableOpacity>
                    <Text style={styles.stepCount}>{quantities[type]}</Text>
                    <TouchableOpacity style={styles.stepBtnFilled} onPress={() => change(type, 1)}>
                      <Plus size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerTotalLabel}>Total</Text>
              <Text style={styles.footerTotalValue}>{formatBRL(total)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.addBtn, total === 0 && styles.addBtnDisabled]}
              onPress={handleAdd}
              disabled={total === 0}
            >
              <ShoppingCart size={15} color="#fff" />
              <Text style={styles.addBtnText}>Adicionar ao carrinho</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  panel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    maxHeight: '92%',
  },
  hero: { height: 208 },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#05313d',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categoryBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  content: { flexGrow: 0 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  locationText: { fontSize: 12, color: '#64748b' },
  description: { fontSize: 14, color: '#64748b', marginBottom: 12, lineHeight: 20 },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  durationText: { fontSize: 12, fontWeight: '500', color: '#05313d' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#0f172a', marginBottom: 6 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  bulletText: { fontSize: 12, color: '#64748b', flex: 1 },
  infoCard: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 12 },
  infoCardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoCardTitle: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
  infoCardValue: { fontSize: 12, color: '#64748b', marginLeft: 19, lineHeight: 18 },
  ticketBox: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ticketRowBorder: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  ticketInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ticketLabel: { fontSize: 12, fontWeight: '600', color: '#0f172a' },
  ticketPrice: { fontSize: 12, fontWeight: 'bold', color: '#f97316' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtnOutline: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#05313d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnFilled: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#05313d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCount: { width: 20, textAlign: 'center', fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  footerTotalLabel: { fontSize: 10, color: '#64748b' },
  footerTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#f97316' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#05313d',
  },
  addBtnDisabled: { opacity: 0.4 },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
