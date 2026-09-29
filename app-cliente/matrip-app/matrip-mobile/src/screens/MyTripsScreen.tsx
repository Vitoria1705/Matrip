import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MapPin, Calendar, QrCode, X, CheckCircle2 } from 'lucide-react-native';

import { useTripsStore, type Trip } from '../store/useTripsStore';

const PRIMARY = '#05313d';
const GRADIENT_END = '#11586a';
const ACCENT = '#2dd4bf';
const DANGER = '#dc2626';

export default function MyTripsScreen({ navigation }: any) {
  const { trips } = useTripsStore();
  const [activeTab, setActiveTab] = useState<'proximas' | 'passadas'>('proximas');
  const [selectedVoucher, setSelectedVoucher] = useState<Trip | null>(null);

  const filteredTrips = trips.filter(t => 
    activeTab === 'proximas' ? t.status === 'confirmado' : t.status === 'concluido'
  );

  const renderTrip = ({ item }: { item: Trip }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, item.status === 'confirmado' ? styles.statusConfirmed : styles.statusCompleted]}>
            <Text style={[styles.statusText, item.status === 'confirmado' ? styles.statusConfirmedText : styles.statusCompletedText]}>
              {item.status === 'confirmado' ? 'Confirmado' : 'Concluído'}
            </Text>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <MapPin size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#64748b" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
        </View>

        {item.status === 'confirmado' && (
          <TouchableOpacity 
            style={styles.voucherBtn} 
            onPress={() => setSelectedVoucher(item)}
          >
            <QrCode size={18} color={PRIMARY} />
            <Text style={styles.voucherBtnText}>Ver Voucher</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={[PRIMARY, GRADIENT_END]} style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Minhas Viagens</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'proximas' && styles.activeTab]}
            onPress={() => setActiveTab('proximas')}
          >
            <Text style={[styles.tabText, activeTab === 'proximas' && styles.activeTabText]}>
              Próximas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'passadas' && styles.activeTab]}
            onPress={() => setActiveTab('passadas')}
          >
            <Text style={[styles.tabText, activeTab === 'passadas' && styles.activeTabText]}>
              Passadas
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        {filteredTrips.length > 0 ? (
          <FlatList
            data={filteredTrips}
            keyExtractor={item => item.id}
            renderItem={renderTrip}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Nenhuma viagem por aqui</Text>
            <Text style={styles.emptyStateText}>
              Quando você comprar pacotes para {activeTab === 'proximas' ? 'o futuro' : 'o passado'}, eles aparecerão aqui.
            </Text>
          </View>
        )}
      </View>

      {/* Voucher Modal */}
      <Modal visible={!!selectedVoucher} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedVoucher(null)}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Voucher de Embarque</Text>
            <Text style={styles.modalSubtitle}>{selectedVoucher?.title}</Text>
            
            <View style={styles.qrContainer}>
              <QrCode size={150} color={PRIMARY} />
              <Text style={styles.qrText}>Apresente este código no local</Text>
            </View>

            <View style={styles.modalDetails}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Data:</Text>
                <Text style={styles.modalValue}>{selectedVoucher?.date}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Local:</Text>
                <Text style={styles.modalValue}>{selectedVoucher?.location}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Status:</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                  <CheckCircle2 size={16} color="#16a34a" />
                  <Text style={[styles.modalValue, {color: '#16a34a'}]}>Pagamento Aprovado</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
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
  mainContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  activeTab: {
    backgroundColor: PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
  },
  statusCompleted: {
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusConfirmedText: {
    color: '#0d9488',
  },
  statusCompletedText: {
    color: '#475569',
  },
  cardDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
  },
  voucherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(5, 49, 61, 0.05)',
    paddingVertical: 12,
    borderRadius: 8,
  },
  voucherBtnText: {
    color: PRIMARY,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 32,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginBottom: 32,
  },
  qrText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: 16,
    textTransform: 'uppercase',
  },
  modalDetails: {
    width: '100%',
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  modalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  }
});
